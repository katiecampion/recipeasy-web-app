const Shopping = require("../models/shoppingModel");

exports.getAll = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json([]);
  const data = await Shopping.getAll(user.user_id);
  res.json(data);
};

exports.add = async (req, res) => {
  const { name, quantity } = req.body;
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  if (!name) return res.status(400).json({ ok: false, error: 'Name required' });
  await Shopping.add(user.user_id, name, quantity || '');
  res.json({ ok: true });
};

exports.remove = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  await Shopping.remove(req.params.id, user.user_id);
  res.json({ ok: true });
};
