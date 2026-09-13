const { withTransaction } = require("../config/db");
const {
  applyXp,
  DIFFICULTY_XP,
  ATTRIBUTES,
  GOLD_RATIO,
  streakMultiplier,
  dayKey,
  daysBetween,
} = require("../config/gameConfig");

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Works out the new streak from the last active day.
 * Same day  -> unchanged (five quests today is still a one-day streak)
 * Yesterday -> +1
 * Otherwise -> reset to 1
 */
function nextStreak({ current, longest, lastActiveDay }, today) {
  let value;
  if (!lastActiveDay) value = 1;
  else if (lastActiveDay === today) value = Math.max(current, 1);
  else if (daysBetween(lastActiveDay, today) === 1) value = current + 1;
  else value = 1;

  return { current: value, longest: Math.max(longest, value), lastActiveDay: today };
}

// DATE columns already arrive as "YYYY-MM-DD" strings (see config/db.js).
const asDayKey = (value) => value || null;

/**
 * Applies XP to one attribute row and returns what it became.
 */
async function bumpAttribute(client, uid, name, xpGained) {
  const existing = await client.query(
    "SELECT level, xp FROM attributes WHERE uid = $1 AND name = $2 FOR UPDATE",
    [uid, name]
  );

  const current = existing.rows[0] ?? { level: 1, xp: 0 };
  const next = applyXp(current.level, current.xp, xpGained);

  await client.query(
    `INSERT INTO attributes (uid, name, level, xp) VALUES ($1, $2, $3, $4)
     ON CONFLICT (uid, name) DO UPDATE SET level = EXCLUDED.level, xp = EXCLUDED.xp`,
    [uid, name, next.level, next.xpIntoLevel]
  );

  return { name, level: next.level, xp: next.xpIntoLevel, leveledUp: next.levelsGained > 0 };
}

async function readAttributes(client, uid) {
  const rows = await client.query("SELECT name, level, xp FROM attributes WHERE uid = $1", [uid]);
  const attributes = Object.fromEntries(ATTRIBUTES.map((n) => [n, { level: 1, xp: 0 }]));
  rows.rows.forEach((r) => {
    attributes[r.name] = { level: r.level, xp: r.xp };
  });
  return attributes;
}

/**
 * Completes a task and grants every reward in ONE transaction, so a failure
 * can never leave a task marked done without the XP that pays for it.
 *
 * `FOR UPDATE` locks the task row for the life of the transaction. That is what
 * makes double-completion impossible even if two requests race: the second one
 * blocks until the first commits, then sees completed = true and is rejected.
 */
async function completeTask(uid, taskId) {
  return withTransaction(async (client) => {
    let task;
    try {
      const result = await client.query(
        "SELECT * FROM tasks WHERE id = $1 FOR UPDATE",
        [taskId]
      );
      task = result.rows[0];
    } catch (error) {
      // A malformed uuid is a client mistake, not a server fault.
      if (error.code === "22P02") throw httpError("Task not found", 404);
      throw error;
    }

    if (!task) throw httpError("Task not found", 404);
    if (task.user_id !== uid) throw httpError("Forbidden: You don't own this task", 403);
    if (task.completed) throw httpError("Task is already completed", 409);

    const userResult = await client.query(
      `SELECT level, xp, xp_into_level, gold, total_completed,
              streak_current, streak_longest, last_active_day
         FROM users WHERE uid = $1 FOR UPDATE`,
      [uid]
    );

    if (!userResult.rowCount) throw httpError("User profile not found", 404);
    const user = userResult.rows[0];

    const today = dayKey();
    const streak = nextStreak(
      {
        current: user.streak_current,
        longest: user.streak_longest,
        lastActiveDay: asDayKey(user.last_active_day),
      },
      today
    );

    const baseXp = DIFFICULTY_XP[task.difficulty] ?? DIFFICULTY_XP.easy;
    const xpGained = Math.round(baseXp * streakMultiplier(streak.current));
    const goldGained = Math.round(xpGained * GOLD_RATIO);

    const progressed = applyXp(user.level, user.xp_into_level, xpGained);

    await client.query(
      `UPDATE tasks SET completed = TRUE, completed_at = now(), updated_at = now()
        WHERE id = $1`,
      [taskId]
    );

    const updated = await client.query(
      `UPDATE users
          SET level = $2, xp_into_level = $3, xp = xp + $4, gold = gold + $5,
              total_completed = total_completed + 1,
              streak_current = $6, streak_longest = $7, last_active_day = $8
        WHERE uid = $1
        RETURNING level, xp, xp_into_level, gold, total_completed`,
      [
        uid,
        progressed.level,
        progressed.xpIntoLevel,
        xpGained,
        goldGained,
        streak.current,
        streak.longest,
        today,
      ]
    );

    const attribute = ATTRIBUTES.includes(task.attribute) ? task.attribute : null;
    const attributeResult = attribute
      ? await bumpAttribute(client, uid, attribute, xpGained)
      : null;

    // Immutable history + the gold ledger, written in the same transaction.
    await client.query(
      `INSERT INTO completions
         (user_id, task_id, title_snapshot, attribute, difficulty,
          xp_awarded, gold_awarded, streak_at_time, day)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [uid, taskId, task.title, attribute, task.difficulty, xpGained, goldGained, streak.current, today]
    );

    await client.query(
      "INSERT INTO transactions (user_id, amount, reason) VALUES ($1, $2, $3)",
      [uid, goldGained, `Completed: ${task.title}`]
    );

    const stats = updated.rows[0];

    return {
      taskId,
      xpGained,
      goldGained,
      leveledUp: progressed.levelsGained > 0,
      levelsGained: progressed.levelsGained,
      attribute: attributeResult,
      stats: {
        level: stats.level,
        xp: stats.xp,
        xpIntoLevel: stats.xp_into_level,
        gold: stats.gold,
        totalCompleted: stats.total_completed,
      },
      attributes: await readAttributes(client, uid),
      streak,
    };
  });
}

/**
 * Rewards finishing a flashcard deck with Intellect XP, so studying feeds the
 * same progression engine as quests rather than being a bolt-on.
 *
 * Capped at once per deck per day by the deck_studies composite primary key:
 * a repeat study conflicts on (user_id, deck_id, day) and pays nothing.
 */
async function studyDeck(uid, deckId, cardsReviewed) {
  return withTransaction(async (client) => {
    let deck;
    try {
      const result = await client.query("SELECT id, user_id FROM decks WHERE id = $1", [deckId]);
      deck = result.rows[0];
    } catch (error) {
      if (error.code === "22P02") throw httpError("Deck not found", 404);
      throw error;
    }

    if (!deck || deck.user_id !== uid) throw httpError("Deck not found", 404);

    await client.query("UPDATE decks SET last_studied = now() WHERE id = $1", [deckId]);

    // 2 XP per card so longer decks are worth more, capped so a 500-card deck
    // can't out-earn every quest in the game.
    const xpGained = Math.min(Math.max(Number(cardsReviewed) || 0, 1) * 2, 60);
    const today = dayKey();

    const claim = await client.query(
      `INSERT INTO deck_studies (user_id, deck_id, day, cards_reviewed, xp_gained)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, deck_id, day) DO NOTHING
       RETURNING day`,
      [uid, deckId, today, Number(cardsReviewed) || 0, xpGained]
    );

    // No row inserted means today's reward for this deck was already claimed.
    if (!claim.rowCount) {
      const current = await client.query(
        "SELECT level, xp, xp_into_level, gold, total_completed FROM users WHERE uid = $1",
        [uid]
      );
      const s = current.rows[0];
      return {
        deckId,
        xpGained: 0,
        alreadyStudiedToday: true,
        leveledUp: false,
        stats: {
          level: s.level,
          xp: s.xp,
          xpIntoLevel: s.xp_into_level,
          gold: s.gold,
          totalCompleted: s.total_completed,
        },
        attributes: await readAttributes(client, uid),
      };
    }

    const userResult = await client.query(
      "SELECT level, xp_into_level FROM users WHERE uid = $1 FOR UPDATE",
      [uid]
    );
    if (!userResult.rowCount) throw httpError("User profile not found", 404);

    const progressed = applyXp(
      userResult.rows[0].level,
      userResult.rows[0].xp_into_level,
      xpGained
    );

    const updated = await client.query(
      `UPDATE users SET level = $2, xp_into_level = $3, xp = xp + $4
        WHERE uid = $1
        RETURNING level, xp, xp_into_level, gold, total_completed`,
      [uid, progressed.level, progressed.xpIntoLevel, xpGained]
    );

    const attributeResult = await bumpAttribute(client, uid, "intellect", xpGained);
    const stats = updated.rows[0];

    return {
      deckId,
      xpGained,
      alreadyStudiedToday: false,
      leveledUp: progressed.levelsGained > 0,
      attribute: attributeResult,
      stats: {
        level: stats.level,
        xp: stats.xp,
        xpIntoLevel: stats.xp_into_level,
        gold: stats.gold,
        totalCompleted: stats.total_completed,
      },
      attributes: await readAttributes(client, uid),
    };
  });
}

module.exports = { completeTask, studyDeck };
