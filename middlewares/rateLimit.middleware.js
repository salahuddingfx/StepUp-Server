const rateLimitMap = new Map();

// Standard simple in-memory rate limiter to avoid extra heavy dependencies
const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // default 15 mins
  const max = options.max || 100; // default 100 requests per windowMs

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        resetTime: now + windowMs,
        count: 1
      });
      return next();
    }

    const rateData = rateLimitMap.get(ip);

    if (now > rateData.resetTime) {
      rateData.resetTime = now + windowMs;
      rateData.count = 1;
      return next();
    }

    rateData.count++;
    if (rateData.count > max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP. Please try again later.'
      });
    }

    next();
  };
};

module.exports = rateLimiter;
