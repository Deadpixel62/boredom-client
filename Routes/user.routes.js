const express = require('express');
const Router = express.Router();
const userController = require('../Controllers/user.controller');
const auth = require('../Middleware/auth');


Router.post('/signup', userController.signup);
Router.post('/login', userController.logIn)
Router.get('/user/:userId', userController.getUser);
Router.get('/users', userController.getAllUsers);
Router.put('/users/addFav', auth, userController.addFavorite);
Router.put('/user/add', auth,  userController.addFav);
Router.put('/users/removeFav',auth,  userController.removeFavorite);


module.exports = Router;