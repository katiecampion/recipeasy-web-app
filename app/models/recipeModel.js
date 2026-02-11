const db = require('./db');

// Get all recipes from logged in user
exports.getMine = userId =>
  db.query("SELECT * FROM recipes WHERE user_id=?", [userId]);

// Get one recipe by ID
exports.getOne = (id, userId) =>
  db.query(
    "SELECT * FROM recipes WHERE recipe_id=? AND user_id=?",
    [id, userId]
  );

// Add a new recipe
exports.add = (userId, name, description, instructions, image) =>
  db.query(
    "INSERT INTO recipes (user_id, recipe_name, description, instructions, image_url) VALUES (?, ?, ?, ?, ?)",
    [userId, name, description, instructions, image]
  );

// Update
exports.update = (id, userId, name, description, instructions) =>
  db.query(
    "UPDATE recipes SET recipe_name=?, description=?, instructions=? WHERE recipe_id=? AND user_id=?",
    [name, description, instructions, id, userId]
  );

// Delete
exports.remove = (id, userId) =>
  db.query(
    "DELETE FROM recipes WHERE recipe_id=? AND user_id=?",
    [id, userId]
  );

// Create recipe
exports.create = async ({ user_id, recipe_name, description, instructions, image_url }) => {
  const r = await db.query(
    `INSERT INTO recipes (user_id, recipe_name, description, instructions, image_url)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, recipe_name, description, instructions, image_url]
  );
  return r.insertId;
};

// Upsert ingredient names and link with quantities
exports.upsertIngredients = async (recipeId, items) => {
  for (const it of items) {
    const name = (it.name || '').trim();
    const qty = (it.quantity || '').trim();
    if (!name) continue;

    // Find or create ingredient by name (schema uses 'name')
    const rows = await db.query("SELECT ingredient_id FROM ingredients WHERE name=?", [name]);
    let ingredientId;
    if (rows.length) {
      ingredientId = rows[0].ingredient_id;
    } else {
      const ins = await db.query("INSERT INTO ingredients (name) VALUES (?)", [name]);
      ingredientId = ins.insertId;
    }

    await db.query(
      `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
       VALUES (?, ?, ?)`,
      [recipeId, ingredientId, qty]
    );
  }
};

// Clear ingredients for a recipe
exports.clearIngredients = (recipeId) =>
  db.query("DELETE FROM recipe_ingredients WHERE recipe_id=?", [recipeId]);

// Fetch recipe with ingredients (optional helper for detail page)
exports.getWithIngredients = async (recipeId) => {
  const [recipe] = await db.query(`SELECT * FROM recipes WHERE recipe_id=?`, [recipeId]);
  const ing = await db.query(
    `SELECT i.name, ri.quantity
     FROM recipe_ingredients ri
     JOIN ingredients i ON i.ingredient_id = ri.ingredient_id
     WHERE ri.recipe_id=?`,
    [recipeId]
  );
  return { recipe, ingredients: ing };
};
