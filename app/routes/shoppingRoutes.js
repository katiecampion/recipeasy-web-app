const router = require("express").Router();
const c = require("../controllers/shoppingcontroller");
const auth = require("../middleware/auth");
const { cleanStrings } = require("../middleware/validate");

router.get("/", auth, c.getAll);
router.post("/add", auth, cleanStrings, c.add);
router.post("/", auth, cleanStrings, c.add);
router.delete("/:id/delete", auth, c.remove);
router.delete("/:id", auth, c.remove);

module.exports = router;
