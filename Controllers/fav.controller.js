const favList = require("../Models/favList.model");
const favController = {};

favController.addFav = (req, res) => {
  const newFav = new favList({
    activity: req.body.activity,
    type: req.body.type,
  });
  try {
    newFav.save();
    res.status(201).json({
      message: "fav added successfully",
      newFav,
    });
  } catch {
    res.status(500).json({
      message: "Error occured while adding fav",
      error,
    });
  }
};

favController.findAll = async function (req, res) {
  let favorites;

  try {
    favorites = await favList.find();
    res.send(favorites);
  } catch (error) {
    res.status(500).send(error);
  }
};

favController.findByType = (req, res) => {
  favList.find({ type: req.params.type }).exec(function (err, product) {
    if (err) {
      if (err.kind === "String") {
        return res.status(404).send({
          message: "Products not found with given name " + req.params.type,
        });
      }
      return res.status(500).send({
        message:
          "Error retrieving Products with given favorite type: " +
          req.params.type,
      });
    }
    res.send(product);
  });
};

//findByNom and findByName are the same function written in two different ways:
favController.findByNom = (req, res) => {
  favList
    .find({ activity: { $regex: req.params.activity } })
    .exec(function (err, product) {
      if (err) {
        if (err.kind === "String") {
          return res.status(404).send({
            message:
              "Products not found with given name " + req.params.activity,
          });
        }
        return res.status(500).send({
          message:
            "Error retrieving Products with given favorite activity : " +
            req.params.activity,
        });
      }

      res.send(product);
    });
};

favController.findByName = async function (req, res) {
  let activity;
  try {
    activity = await favList.find({
      activity: { $regex: req.params.activity },
    });
    res.send(activity);
  } catch (error) {
    res.status(500).send(error);
  }
};

favController.deleteFav = async function (req, res) {
  let fav;
  try {
    fav = await favList.deleteOne({ _id: req.body._id });
    res.send(fav);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = favController;
