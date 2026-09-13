const cron = require("node-cron");
const { getDb } = require("../config/firebaseAdmin");
const { sendMail } = require("../services/emailService");

function currentHHMM() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

async function sendDueReminders() {
  const db = getDb();
  const hhmm = currentHHMM();

  const habitsSnapshot = await db
    .collection("habits")
    .where("reminderTime", "==", hhmm)
    .where("isArchived", "==", false)
    .get();

  if (habitsSnapshot.empty) return;

  for (const doc of habitsSnapshot.docs) {
    const habit = doc.data();
    const userDoc = await db.collection("users").doc(habit.userId).get();
    const email = userDoc.data()?.email;
    if (!email) continue;

    await sendMail({
      to: email,
      subject: `Reminder: ${habit.name}`,
      text: `Time for your habit "${habit.name}" — open Habitify to check it off.`,
    });
  }
}

// Runs once a minute, matching each habit's reminderTime (HH:MM) against
// the server's local clock. There's no per-user timezone stored yet, so
// this assumes the server and the user are in the same timezone — fine
// for a single-region deploy, worth revisiting if users span timezones.
function startReminderScheduler() {
  cron.schedule("* * * * *", () => {
    sendDueReminders().catch((err) => console.error("Reminder scheduler error:", err.message));
  });
  console.log("✅ Reminder scheduler started (checks every minute).");
}

module.exports = { startReminderScheduler };
