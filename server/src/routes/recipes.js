import express from "express";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel(req.body);
  try {
    const response = await recipe.save();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

// Save a Recipe
router.put("/", verifyToken, async (req, res) => {
  const { recipeID, userID } = req.body;

  try {
    const recipe = await RecipesModel.findById(recipeID);
    const user = await UserModel.findById(userID);
    if (!recipe || !user) {
      // Check if recipe or user not found
      return res.status(404).json({ message: "Recipe or user not found" });
    }

    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/savedRecipes/ids", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

// Save a Recipe
router.get("/savedRecipes", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as recipesRouter };
