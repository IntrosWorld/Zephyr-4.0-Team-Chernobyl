const { getDb } = require("../config/firebaseAdmin");

// Get all tasks for the authenticated user
const getTasks = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const tasksSnapshot = await getDb().collection("tasks").where("userId", "==", uid).get();
    
    const tasks = [];
    tasksSnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// Create a new task
const createTask = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { title, description, type, difficulty } = req.body;
    
    if (!title || !type) {
      return res.status(400).json({ error: "Title and type are required" });
    }
    
    const newTask = {
      userId: uid,
      title,
      description: description || "",
      type, // habit, daily, todo
      difficulty: difficulty || "easy",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await getDb().collection("tasks").add(newTask);
    
    res.status(201).json({ id: docRef.id, ...newTask });
  } catch (error) {
    next(error);
  }
};

// Update a task (e.g., mark complete)
const updateTask = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const updates = req.body;
    
    const taskRef = getDb().collection("tasks").doc(id);
    const doc = await taskRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    if (doc.data().userId !== uid) {
      return res.status(403).json({ error: "Forbidden: You don't own this task" });
    }
    
    updates.updatedAt = new Date().toISOString();
    // Prevent updating userId
    delete updates.userId;
    
    await taskRef.update(updates);
    
    const updatedDoc = await taskRef.get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    next(error);
  }
};

// Delete a task
const deleteTask = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    
    const taskRef = getDb().collection("tasks").doc(id);
    const doc = await taskRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    if (doc.data().userId !== uid) {
      return res.status(403).json({ error: "Forbidden: You don't own this task" });
    }
    
    await taskRef.delete();
    
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
