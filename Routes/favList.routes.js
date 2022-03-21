const express = require('express');
const Router = express.Router();
const favController = require('../Controllers/fav.controller');

Router.post('/addFav', favController.addFav);
Router.get('/getAllFav', favController.findAll);
Router.get('/getFav/:type', favController.findByType);
Router.get('/getAct/:activity', favController.findByName);
Router.delete('/deleteFav', favController.deleteFav);

module.exports = Router;
