// middlewares/formatDateMiddleware.js
const { format } = require('date-fns');

// --- helpers ---
const isPlainObject = (v) =>
  v !== null &&
  typeof v === 'object' &&
  (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);

// "2025-09-03" or full ISO like "2025-09-03T10:22:11.123Z"
const isLikelyDateString = (s) =>
  typeof s === 'string' &&
  (/^\d{4}-\d{2}-\d{2}$/.test(s) || /^\d{4}-\d{2}-\d{2}T/.test(s));

const fmt = (d) => {
  try { return format(new Date(d), 'yyyy-MM-dd'); }
  catch { return d; }
};

// deep formatter that only walks arrays + plain objects
const formatDatesDeep = (value, seen = new WeakSet()) => {
  if (value == null) return value;

  // Date object
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return fmt(value);
  }

  // String that looks like a date
  if (typeof value === 'string' && isLikelyDateString(value)) {
    return fmt(value);
  }

  // Arrays
  if (Array.isArray(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    return value.map((v) => formatDatesDeep(v, seen));
  }

  // Only traverse plain JSON-like objects; skip Mongoose docs, ObjectId, Buffers, Maps, etc.
  if (isPlainObject(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    const out = {};
    for (const k of Object.keys(value)) {
      out[k] = formatDatesDeep(value[k], seen);
    }
    return out;
  }

  // everything else (functions, mongoose types, etc.)
  return value;
};

// --- middleware ---
const formatDateMiddleware = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (data) => {
    // Convert Mongoose docs to plain JSON first to avoid circular refs / getters
    let safe;
    try {
      safe = JSON.parse(JSON.stringify(data));
    } catch {
      // if stringify fails, fall back to sending original
      return originalJson(data);
    }

    const formatted = formatDatesDeep(safe);
    return originalJson(formatted);
  };

  next();
};

module.exports = { formatDateMiddleware, formatDatesDeep };
