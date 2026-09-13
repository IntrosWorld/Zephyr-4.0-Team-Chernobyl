const { getDb } = require("../config/firebaseAdmin");
const { applyHabitReward } = require("../services/userService");

const HEATMAP_DAYS = 90;
const XP_PER_COMPLETION = 10;
const GOLD_PER_COMPLETION = 5;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function getAllUserLogs(uid) {
  const snapshot = await getDb().collection("habitLogs").where("userId", "==", uid).get();
  const logs = [];
  snapshot.forEach((doc) => logs.push({ id: doc.id, ...doc.data() }));
  return logs;
}

// Today's completion logs, across all habits
const getTodayLogs = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const snapshot = await getDb()
      .collection("habitLogs")
      .where("userId", "==", uid)
      .where("date", "==", todayKey())
      .get();

    const logs = [];
    snapshot.forEach((doc) => logs.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

// Completion logs within a date range (inclusive), e.g. for a weekly grid.
// Filtered in memory rather than with a Firestore range query so this stays
// a single simple index (userId equality) regardless of range size.
const getRangeLogs = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "start and end query params are required" });
    }

    const logs = (await getAllUserLogs(uid)).filter((l) => l.date >= start && l.date <= end);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

// Daily completion counts (across all habits) for the last 90 days, including zero-count days
const getHeatmap = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const logs = await getAllUserLogs(uid);

    const counts = {};
    logs.forEach((l) => {
      counts[l.date] = (counts[l.date] || 0) + 1;
    });

    const days = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - (HEATMAP_DAYS - 1));
    for (let i = 0; i < HEATMAP_DAYS; i++) {
      const key = cursor.toISOString().slice(0, 10);
      days.push({ date: key, count: counts[key] || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    res.status(200).json(days);
  } catch (error) {
    next(error);
  }
};

// Mark a habit complete for a given date (idempotent)
const createLog = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { habitId, date } = req.body;

    if (!habitId || !date) {
      return res.status(400).json({ error: "habitId and date are required" });
    }

    const existing = await getDb()
      .collection("habitLogs")
      .where("userId", "==", uid)
      .where("habitId", "==", habitId)
      .where("date", "==", date)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      return res.status(200).json({ id: doc.id, ...doc.data() });
    }

    const newLog = {
      userId: uid,
      habitId,
      date,
      createdAt: new Date().toISOString(),
    };

    const docRef = await getDb().collection("habitLogs").add(newLog);
    const stats = await applyHabitReward(uid, XP_PER_COMPLETION, GOLD_PER_COMPLETION);

    res.status(201).json({ id: docRef.id, ...newLog, stats });
  } catch (error) {
    next(error);
  }
};

// Undo a habit completion for a given date
const deleteLog = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { habitId, date } = req.body;

    if (!habitId || !date) {
      return res.status(400).json({ error: "habitId and date are required" });
    }

    const snapshot = await getDb()
      .collection("habitLogs")
      .where("userId", "==", uid)
      .where("habitId", "==", habitId)
      .where("date", "==", date)
      .get();

    const batch = getDb().batch();
    snapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    const stats = snapshot.empty
      ? undefined
      : await applyHabitReward(uid, -XP_PER_COMPLETION, -GOLD_PER_COMPLETION);

    res.status(200).json({ message: "Log removed", stats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodayLogs, getRangeLogs, getHeatmap, createLog, deleteLog };
