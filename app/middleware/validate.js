exports.requireFields = fields => (req, res, next) => {
  for (const f of fields) {
    if (!req.body[f] || String(req.body[f]).trim() === "") {
      return res.status(400).json({ error: `Missing or empty field: ${f}` });
    }
  }
  next();
};

exports.cleanStrings = (req, _res, next) => {
  Object.keys(req.body).forEach(k => {
    if (typeof req.body[k] === "string") {
      req.body[k] = req.body[k].trim();
    }
  });
  next();
};