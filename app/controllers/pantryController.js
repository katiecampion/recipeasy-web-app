const Pantry = require("../models/pantryModel");

exports.getAll = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json([]);
  const data = await Pantry.getAll(user.user_id);
  res.json(data);
};

exports.add = async (req, res) => {
  const { ingredient_id, name, quantity } = req.body;
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized' });

  const ing = name?.trim() || ingredient_id;
  if (!ing) return res.status(400).json({ ok: false, error: 'Ingredient name required' });

  await Pantry.add(user.user_id, ing, quantity || '');
  res.json({ ok: true });
};

exports.remove = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok: false, error:'Unauthorized' });
  await Pantry.remove(req.params.id, user.user_id);
  res.json({ ok: true });
};
