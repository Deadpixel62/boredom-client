const express = require("express");
const Router = express.Router();
const userController = require("../Controllers/user.controller");
const auth = require("../Middleware/auth");

Router.post("/signup", userController.signup);
Router.post("/login", userController.login);
Router.get("/user/:userId", userController.getUser);
Router.get("/users", userController.getAllUsers);
Router.put("/users/addFavorite", auth, userController.addFavorite);
Router.delete("/users/removeFav", auth, userController.removeFavorite);

module.exports = Router;
