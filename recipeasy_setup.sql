CREATE DATABASE recipeasy_db;
USE recipeasy_db;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(100),
  password VARCHAR(100)
);

CREATE TABLE recipes (
  recipe_id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_name VARCHAR(100),
  description TEXT,
  instructions TEXT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE ingredients (
  ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
  ingredient_name VARCHAR(100)
);

CREATE TABLE recipe_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT,
  ingredient_id INT,
  quantity VARCHAR(50),
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);
CREATE TABLE user_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    quantity VARCHAR(50),
    user_id INT
);
CREATE TABLE shopping_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    quantity VARCHAR(50),
    user_id INT
);

-- Sample data
INSERT INTO users (username, email, password)
VALUES ('katie', 'katie@example.com', 'test123');

INSERT INTO ingredients (ingredient_name)
VALUES ('Chicken'), ('Rice'), ('Tomato'), ('Onion');

INSERT INTO recipes (recipe_name, description, instructions, user_id)
VALUES (
  'Chicken Rice Bowl',
  'Easy pantry meal',
  '1. Cook chicken. 2. Add rice. 3. Add tomato and onion.',
  1
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
VALUES
(1, 1, '200g'),
(1, 2, '150g'),
(1, 3, '1 whole'),
(1, 4, '1/2');
