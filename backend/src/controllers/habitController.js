const { getDb } = require("../config/firebaseAdmin");
const { colorForIndex } = require("../utils/habitColors");

// Get all active (non-archived) habits for the authenticated user
const getHabits = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const snapshot = await getDb().collection("habits").where("userId", "==", uid).get();

    const habits = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.isArchived) habits.push({ id: doc.id, ...data });
    });
    habits.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

    res.status(200).json(habits);
  } catch (error) {
    next(error);
  }
};

// Create a new habit
const createHabit = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { name, description, category, icon, color, frequency, targetDays, reminderTime } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Habit name is required" });
    }

    const db = getDb();
    const existingCount = (await db.collection("habits").where("userId", "==", uid).get()).size;

    const newHabit = {
      userId: uid,
      name,
      description: description || "",
      category: category || "general",
      icon: icon || "sparkles",
      color: color || colorForIndex(existingCount),
      frequency: frequency || "daily",
      targetDays: targetDays || 7,
      reminderTime: reminderTime || null,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("habits").add(newHabit);
    res.status(201).json({ id: docRef.id, ...newHabit });
  } catch (error) {
    next(error);
  }
};

// Update a habit's fields
const updateHabit = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const updates = req.body;

    const habitRef = getDb().collection("habits").doc(id);
    const doc = await habitRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Habit not found" });
    }
    if (doc.data().userId !== uid) {
      return res.status(403).json({ error: "Forbidden: You don't own this habit" });
    }

    delete updates.userId;
    updates.updatedAt = new Date().toISOString();

    await habitRef.update(updates);

    const updatedDoc = await habitRef.get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    next(error);
  }
};

// Toggle a habit's archived state
const archiveHabit = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const habitRef = getDb().collection("habits").doc(id);
    const doc = await habitRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Habit not found" });
    }
    if (doc.data().userId !== uid) {
      return res.status(403).json({ error: "Forbidden: You don't own this habit" });
    }

    const isArchived = !doc.data().isArchived;
    await habitRef.update({ isArchived, updatedAt: new Date().toISOString() });

    const updatedDoc = await habitRef.get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    next(error);
  }
};

// Delete a habit and all of its completion logs
const deleteHabit = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const habitRef = getDb().collection("habits").doc(id);
    const doc = await habitRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Habit not found" });
    }
    if (doc.data().userId !== uid) {
      return res.status(403).json({ error: "Forbidden: You don't own this habit" });
    }

    const db = getDb();
    const logsSnapshot = await db
      .collection("habitLogs")
      .where("userId", "==", uid)
      .where("habitId", "==", id)
      .get();

    const batch = db.batch();
    logsSnapshot.forEach((logDoc) => batch.delete(logDoc.ref));
    batch.delete(habitRef);
    await batch.commit();

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHabits, createHabit, updateHabit, archiveHabit, deleteHabit };
