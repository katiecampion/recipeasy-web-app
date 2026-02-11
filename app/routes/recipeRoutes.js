const router = require("express").Router();
const c = require("../controllers/recipeController");
const auth = require("../middleware/auth");
const { requireFields, cleanStrings } = require("../middleware/validate");

router.get("/", auth, c.getMine);
router.get("/:id", auth, c.getOne);

// Create
router.post(
  "/add",
  auth,
  cleanStrings,
  requireFields(["recipe_name"]),
  c.add
);

router.post(
  "/",
  auth,
  cleanStrings,
  requireFields(["recipe_name"]),
  c.add
);

// Update
router.put(
  "/:id/update",
  auth,
  cleanStrings,
  requireFields(["recipe_name"]),
  c.update
);

router.put(
  "/:id",
  auth,
  cleanStrings,
  requireFields(["recipe_name"]),
  c.update
);

// Delete
router.delete("/:id/delete", auth, c.remove);
router.delete("/:id", auth, c.remove);

// Ingredients
router.post("/:id/ingredients", auth, cleanStrings, c.replaceIngredients);

module.exports = router;
