const rateLimit = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // Default: 15 minutes
  const max = options.max || 5; // Default: 5 requests
  const message = options.message || 'Too many requests from this IP. Please try again after 15 minutes.';

  const requests = new Map();

  // Clean memory periodically to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requests.entries()) {
      const active = timestamps.filter(time => now - time < windowMs);
      if (active.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, active);
      }
    }
  }, 10 * 60 * 1000); // Clean every 10 minutes

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    let timestamps = requests.get(ip);
    
    // Keep only timestamps within the window
    timestamps = timestamps.filter(time => now - time < windowMs);

    if (timestamps.length >= max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    timestamps.push(now);
    requests.set(ip, timestamps);
    next();
  };
};

module.exports = rateLimit;
