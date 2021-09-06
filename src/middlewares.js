function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  res.status(res.statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'production' : err.stack
  });
}

module.exports = {
  notFound,
  errorHandler
};
