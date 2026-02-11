const db = require("./db");

exports.getAll = userId =>
  db.query(
    "SELECT * FROM saved_recipes WHERE user_id = ?",
    [userId]
  );

exports.add = (userId, apiId, title, image) =>
  db.query(
    `
    INSERT IGNORE INTO saved_recipes
      (user_id, api_recipe_id, title, image_url)
    VALUES (?, ?, ?, ?)
    `,
    [
      userId,
      apiId,
      title,
      image ?? null
    ]
  );

exports.remove = (id, userId) =>
  db.query(
    "DELETE FROM saved_recipes WHERE id = ? AND user_id = ?",
    [id, userId]
  );
