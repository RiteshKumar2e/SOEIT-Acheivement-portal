const NodeCache = require('node-cache');

/**
 * Standard Cache: 
 * stdTTL: 5 minutes (300 seconds)
 * checkperiod: 1 minute (60 seconds)
 */
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * Middleware for caching API responses
 * @param {number} duration - TTL in seconds
 */
const cacheMiddleware = (duration) => (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        return res.send(cachedResponse);
    } else {
        res.sendResponse = res.send;
        res.send = (body) => {
            cache.set(key, body, duration);
            res.sendResponse(body);
        };
        next();
    }
};

/**
 * Clear specific cache key or pattern
 * @param {string} pattern - Key or prefix to clear
 */
const clearCache = (pattern) => {
    if (!pattern) return cache.flushAll();
    
    const keys = cache.keys();
    keys.forEach(key => {
        if (key.includes(pattern)) {
            cache.del(key);
        }
    });
};

/**
 * Get cache statistics
 */
const getStats = () => {
    return cache.getStats();
};

module.exports = {
    cache,
    cacheMiddleware,
    clearCache,
    getStats
};
