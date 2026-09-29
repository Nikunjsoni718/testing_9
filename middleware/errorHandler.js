// GOOD PATTERN: centralized error shape, no stack trace leakage to the client.
// (The actual bug is registration order in server.js, not this file itself.)
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    error: 'Something went wrong. Please try again later.',
  });
}

module.exports = errorHandler;
