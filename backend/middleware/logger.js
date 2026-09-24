/**
 * HTTP Request Logger Middleware
 * Formats incoming API traffic with execution duration and status codes.
 */

function logger(req, res, next) {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  // Intercept the end of response to log outcome
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const statusBadge = status >= 500
      ? `\x1b[31m${status}\x1b[0m` // Red for 5xx
      : status >= 400
      ? `\x1b[33m${status}\x1b[0m` // Yellow for 4xx
      : `\x1b[32m${status}\x1b[0m`; // Green for 2xx/3xx

    console.log(`[${timestamp}] ${method} ${originalUrl} -> ${statusBadge} (${duration}ms) - IP: ${ip}`);
  });

  next();
}

module.exports = logger;
