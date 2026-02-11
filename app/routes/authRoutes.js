const router = require("express").Router();
const c = require("../controllers/authController");
const { requireFields, cleanStrings } = require("../middleware/validate");

router.post(
  "/register",
  cleanStrings,
  requireFields(["username", "email", "password"]),
  c.register
);

router.post(
  "/login",
  cleanStrings,
  requireFields(["email", "password"]),
  c.login
);

router.post("/logout", c.logout);

router.get("/me", c.me);
router.put(
  "/update",
  cleanStrings,
  requireFields(["email"]),
  c.update
);
router.delete("/delete", c.remove);

module.exports = router;
