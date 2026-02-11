require("dotenv").config();
const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "recipeasy.sid",
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});

app.use(express.static(path.join(__dirname, "view")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "view", "index.html"))
);

app.use("/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));

app.use("/recipes", require("./routes/recipeRoutes"));
app.use("/pantry", require("./routes/pantryRoutes"));
app.use("/saved", require("./routes/savedRoutes"));
app.use("/shopping", require("./routes/shoppingRoutes"));
app.use("/search", require("./routes/searchRoutes"));

app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api/pantry", require("./routes/pantryRoutes"));
app.use("/api/saved", require("./routes/savedRoutes"));
app.use("/api/shopping", require("./routes/shoppingRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
