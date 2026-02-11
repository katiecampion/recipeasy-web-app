const db = require("./db");

exports.getAll = userId =>
  db.query("SELECT * FROM shopping_list WHERE user_id=?", [userId]);

exports.add = (userId, name, quantity) =>
  db.query(
    "INSERT INTO shopping_list (user_id, name, quantity) VALUES (?, ?, ?)",
    [userId, name, quantity]
  );

exports.remove = (id, userId) =>
  db.query("DELETE FROM shopping_list WHERE id=? AND user_id=?", [id, userId]);
