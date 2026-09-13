const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { initFirebaseAdmin } = require("./config/firebaseAdmin");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");

// Initialize Firebase Admin SDK
initFirebaseAdmin();

const app = express();

// Security Middlewares
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// CORS Config
// Reflects whatever origin the request came from instead of one hardcoded
// port, so any teammate's dev server (different port, different machine)
// can talk to this backend. Protected routes still require a valid Firebase
// ID token, so this doesn't loosen who can actually read/write data.
app.use(cors({
  origin: true,
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/integrations", integrationRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
