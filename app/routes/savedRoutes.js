const router = require("express").Router();
const c = require("../controllers/savedController");
const auth = require("../middleware/auth");

router.get("/", auth, c.getAll);
router.post("/add", auth, c.add);
router.delete("/:id/delete", auth, c.remove);

module.exports = router;
