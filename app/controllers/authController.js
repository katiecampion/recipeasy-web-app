const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ ok: false, error: "Weak password" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create(username, email, hashed);
  res.json({ ok: true });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const rows = await User.getByEmail(email);
  if (!rows.length) return res.json({ ok: false });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ ok: false });

  req.session.regenerate(err => {
    if (err) return res.status(500).json({ ok: false });

    req.session.user_id = user.user_id;
    req.session.user = {
      user_id: user.user_id,
      username: user.username,
      email: user.email
    };

    req.session.save(err2 => {
      if (err2) return res.status(500).json({ ok: false });
      res.json({ ok: true });
    });
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
};

exports.me = (req, res) => {
  if (!req.session.user) return res.status(401).json({ authenticated: false });
  res.json({ authenticated: true, ...req.session.user });
};

exports.update = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

  const { email, password } = req.body;
  const hashed = password ? await bcrypt.hash(password, 10) : undefined;

  await User.update(req.session.user.user_id, email, hashed);
  res.json({ ok: true });
};

exports.remove = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });

  await User.remove(req.session.user.user_id);
  req.session.destroy(() => res.json({ ok: true }));
};
