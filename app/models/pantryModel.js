const db = require("./db");

// Return items with resolved ingredient name
exports.getAll = userId =>
  db.query(
    `SELECT p.id, i.name AS name, p.quantity
     FROM pantry p
     JOIN ingredients i ON i.ingredient_id = p.ingredient_id
     WHERE p.user_id=?
     ORDER BY p.id DESC`,
    [userId]
  );

// Ensure ingredient exists and add pantry row
exports.add = async (userId, nameOrId, quantity) => {
  let ingredientId = Number(nameOrId) || null;

  if (!ingredientId) {
    // Find or create ingredient by name (schema uses 'name')
    const rows = await db.query("SELECT ingredient_id FROM ingredients WHERE name=?", [nameOrId]);
    if (rows.length) {
      ingredientId = rows[0].ingredient_id;
    } else {
      const ins = await db.query("INSERT INTO ingredients (name) VALUES (?)", [nameOrId]);
      ingredientId = ins.insertId;
    }
  }

  return db.query(
    "INSERT INTO pantry (user_id, ingredient_id, quantity) VALUES (?, ?, ?)",
    [userId, ingredientId, quantity || ""]
  );
};

exports.remove = (id, userId) =>
  db.query("DELETE FROM pantry WHERE id=? AND user_id=?", [id, userId]);
