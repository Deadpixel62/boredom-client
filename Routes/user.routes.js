const express = require('express');
const Router = express.Router();
const userController = require('../Controllers/user.controller');


Router.post('/signup', userController.signup);
Router.get('/user/:userId', userController.getUser);
Router.get('/users', userController.getAllUsers);
Router.put('/users/addFav', userController.addFavorite);
Router.put('/user/add', userController.addFav)
Router.put('/users/removeFav', userController.removeFavorite)

module.exports = Router;