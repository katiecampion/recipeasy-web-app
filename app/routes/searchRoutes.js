const router = require("express").Router();
const c = require("../controllers/searchController");

router.get("/", (req, res) => {
  if (req.query.i && !req.query.q && !req.query.query) {
    return c.searchByIngredients(req, res);
  }
  return c.searchByTitle(req, res);
});

router.get("/pantry", c.searchFromPantry);
router.get("/recipe/:id", c.getRecipeDetails);
router.get("/popular", c.popular);
router.get("/ingredients", c.searchByIngredients);

module.exports = router;
