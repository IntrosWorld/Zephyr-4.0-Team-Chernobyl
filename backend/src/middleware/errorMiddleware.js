const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
};

module.exports = { errorHandler, notFoundHandler };
