const db = require("../models/db");

exports.getAll = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json([]);

  const sort = req.query.sort;
  let orderBy = "created_at DESC";
  if (sort === "az") orderBy = "title ASC";

  const rows = await db.query(
    `
    SELECT id, api_recipe_id, title, image_url, created_at
    FROM saved_recipes
    WHERE user_id=?
    ORDER BY ${orderBy}
    `,
    [user.user_id]
  );

  res.json(rows);
};

exports.add = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok: false });

  const { recipe_id, title, image } = req.body;

  if (!recipe_id || !title) {
    return res.status(400).json({ ok: false });
  }

  await db.query(
    `
    INSERT IGNORE INTO saved_recipes
      (user_id, api_recipe_id, title, image_url, created_at)
    VALUES (?, ?, ?, ?, NOW())
    `,
    [user.user_id, recipe_id, title, image || null]
  );

  res.json({ ok: true });
};

exports.remove = async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ ok: false });

  await db.query(
    "DELETE FROM saved_recipes WHERE id=? AND user_id=?",
    [req.params.id, user.user_id]
  );

  res.json({ ok: true });
};
