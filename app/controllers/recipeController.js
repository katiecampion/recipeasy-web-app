const Recipe = require("../models/recipeModel");

exports.getMine = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json([]);
  const data = await Recipe.getMine(user.user_id);
  res.json(data);
};

exports.getOne = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).send('Unauthorized');
  const id = req.params.id;
  const data = await Recipe.getWithIngredients(id);
  res.json(data);
};

exports.add = async (req, res) => {
  const { recipe_name, name, description, instructions, image } = req.body;
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  const finalName = recipe_name || name;
  if (!finalName) return res.status(400).json({ ok: false, error: 'Name required' });
  await Recipe.add(user.user_id, finalName, description || '', instructions || '', image || '');
  res.json({ ok: true });
};

exports.update = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok:false, error:'Unauthorized' });
  const id = req.params.id;
  const { recipe_name, description, instructions } = req.body;
  await Recipe.update(id, user.user_id, recipe_name, description, instructions);
  res.json({ ok: true });
};

exports.remove = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok:false, error:'Unauthorized' });
  await Recipe.remove(req.params.id, user.user_id);
  res.json({ ok: true });
};

exports.create = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).send('Unauthorized');
  const { recipe_name, description, instructions, image_url, ingredients } = req.body;
  if (!recipe_name || !description || !instructions) {
    return res.status(400).send('Missing fields');
  }
  const recipeId = await Recipe.create({
    user_id: user.user_id,
    recipe_name,
    description,
    instructions,
    image_url: image_url || null
  });
  if (Array.isArray(ingredients) && ingredients.length) {
    await Recipe.upsertIngredients(recipeId, ingredients);
  }
  res.json({ ok: true, recipe_id: recipeId });
};

exports.replaceIngredients = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok:false, error:'Unauthorized' });
  const id = req.params.id;
  const { ingredients } = req.body;
  if (!Array.isArray(ingredients)) return res.json({ ok:true });
  const rows = await Recipe.getOne(id, user.user_id);
  if (!rows.length) return res.status(404).json({ ok:false, error:'Not found' });
  await Recipe.clearIngredients(id);
  await Recipe.upsertIngredients(id, ingredients);
  res.json({ ok:true });
};
