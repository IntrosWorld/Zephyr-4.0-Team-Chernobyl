require("dotenv").config();
const app = require("./app");
const { startReminderScheduler } = require("./jobs/reminderScheduler");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  startReminderScheduler();
});
