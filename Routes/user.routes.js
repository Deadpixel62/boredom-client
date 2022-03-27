const express = require("express");
const Router = express.Router();
const userController = require("../Controllers/user.controller");
const auth = require("../Middleware/auth");

Router.post("/signup", userController.signup);
Router.post("/login", userController.login);
Router.get("/user/:userId", userController.getUser);
Router.get("/users", userController.getAllUsers);
Router.put("/users/:userId/fav/:activityId", userController.addFavorite);
Router.put("/user/add", userController.addFav);
Router.delete(
  "/users/removeFav",

  userController.removeFavorite
);

module.exports = Router;
