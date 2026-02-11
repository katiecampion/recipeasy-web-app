const db = require("./db");

exports.create = (username, email, password) =>
  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password]
  );

exports.getByEmail = email =>
  db.query("SELECT * FROM users WHERE email=?", [email]);

exports.update = (id, email, password) =>
  db.query(
    "UPDATE users SET email=?, password=? WHERE user_id=?",
    [email, password, id]
  );

exports.remove = id =>
  db.query("DELETE FROM users WHERE user_id=?", [id]);
