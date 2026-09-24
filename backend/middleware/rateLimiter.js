/**
 * In-Memory Sliding Window Rate Limiter
 * Protects AI endpoints against quota exhaustion and abusive bursts.
 */

const config = require('../config');

const clients = new Map();

function rateLimiter(req, res, next) {
  // Bypass rate limiting in testing mode if needed
  if (process.env.NODE_ENV === 'test') return next();

  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  let record = clients.get(ip);
  if (!record) {
    record = { timestamps: [] };
    clients.set(ip, record);
  }

  // Filter out timestamps outside the active window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const retryAfterSeconds = Math.ceil((record.timestamps[0] + windowMs - now) / 1000);
    res.setHeader('Retry-After', retryAfterSeconds);
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait a moment before sending more requests.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfterSeconds
    });
  }

  record.timestamps.push(now);
  next();
}

// Clean up stale client entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  for (const [ip, record] of clients.entries()) {
    record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);
    if (record.timestamps.length === 0) {
      clients.delete(ip);
    }
  }
}, 5 * 60 * 1000);

module.exports = rateLimiter;
