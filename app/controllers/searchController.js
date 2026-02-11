const axios = require("axios");
const db = require("../models/db");

const API = process.env.SPOONACULAR_API_KEY;

const sortAZ = arr =>
  Array.isArray(arr)
    ? arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    : arr;

exports.searchByTitle = async (req, res) => {
  const q = req.query.q || req.query.query || "";
  if (!q) return res.json([]);

  try {
    const r = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        q
      )}&number=12&apiKey=${API}`
    );

    let results = r.data.results || [];
    if (req.sort === "az") results = sortAZ(results);
    res.json(results);
  } catch {
    res.json([]);
  }
};

exports.searchByIngredients = async (req, res) => {
  const ing = req.query.i || "";
  if (!ing) return res.json([]);

  try {
    const r = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
        ing
      )}&number=12&apiKey=${API}`
    );

    let results = r.data || [];
    if (req.sort === "az") results = sortAZ(results);
    res.json(results);
  } catch {
    res.json([]);
  }
};

exports.searchFromPantry = async (req, res) => {
  const userId = req.session.user?.user_id;
  if (!userId) return res.status(401).json([]);

  const rows = await db.query(
    `SELECT i.name
     FROM pantry p
     JOIN ingredients i ON i.ingredient_id = p.ingredient_id
     WHERE p.user_id=?`,
    [userId]
  );

  if (!rows.length) return res.json([]);

  const names = rows.map(r => r.name.trim()).filter(Boolean);
  const pantrySet = new Set(names.map(n => n.toLowerCase()));

  try {
    const r = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
        names.join(",")
      )}&number=12&apiKey=${API}`
    );

    let results = (r.data || []).map(x => ({
      ...x,
      pantryMatchCount: (x.usedIngredients || []).length,
      matchedIngredients: (x.usedIngredients || [])
        .map(i => i.name)
        .filter(n => pantrySet.has(n.toLowerCase()))
    }));

    if (req.sort === "az") results = sortAZ(results);
    res.json(results);
  } catch {
    res.json([]);
  }
};

exports.getRecipeDetails = async (req, res) => {
  try {
    const r = await axios.get(
      `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${API}`
    );
    res.json(r.data);
  } catch {
    res.status(500).json({});
  }
};

exports.popular = async (_req, res) => {
  try {
    const r = await axios.get(
      `https://api.spoonacular.com/recipes/random?number=12&apiKey=${API}`
    );
    res.json(
      (r.data.recipes || []).map(x => ({
        id: x.id,
        title: x.title,
        image: x.image
      }))
    );
  } catch {
    res.json([]);
  }
};
