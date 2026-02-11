// controllers/apiController.js
const axios = require("axios");
const Pantry = require("../models/pantryModel");

const API = process.env.SPOONACULAR_API_KEY;

// SEARCH BY TITLE OR INGREDIENT
exports.search = async (req, res) => {
    const { q, i } = req.query;

    const params = q
        ? { query: q }
        : { ingredients: i };

    const url = q
        ? `https://api.spoonacular.com/recipes/complexSearch`
        : `https://api.spoonacular.com/recipes/findByIngredients`;

    const response = await axios.get(url, {
        params: {
            apiKey: API,
            number: 12,
            ...params
        }
    });

    res.json(response.data);
};

// GET SINGLE API RECIPE DETAILS
exports.getOne = async (req, res) => {
    const id = req.params.id;

    const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        { params: { apiKey: API } }
    );

    res.json(response.data);
};

// POPULAR RECIPES
exports.popular = async (req, res) => {
    const response = await axios.get(
        "https://api.spoonacular.com/recipes/random",
        { params: { apiKey: API, number: 12 } }
    );

    res.json(response.data.recipes.map(r => ({
        id: r.id,
        title: r.title,
        image: r.image
    })));
};

// RECOMMEND BASED ON PANTRY
exports.fromPantry = async (req, res) => {
    const userId = req.session.user?.user_id;
    if (!userId) return res.status(401).json([]);
    const pantry = await Pantry.getAll(userId);
    if (!pantry.length) return res.json([]);
    const ingredients = pantry.map(p => p.name).join(",+");
    const response = await axios.get(
        "https://api.spoonacular.com/recipes/findByIngredients",
        { params: { apiKey: API, ingredients, number: 12 } }
    );
    res.json(response.data);
};
