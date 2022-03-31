const favList = require("../Models/favList.model");
const User = require("../Models/user.model");
const favController = {};

favController.addFav = async (req, res) => {
  const newFav = new favList({
    activity: req.body.activity,
    type: req.body.type,
  });
  try {
    await newFav.save();
    const activityId = newFav._id;
    //************/

    const user = await User.updateOne(
      { _id: req.user.userId },
      { $addToSet: { favList: activityId } }
    );
    //************/

    res.status(201).json({
      message: "fav added successfully",
      newFav,
      user,
    });
  } catch (error) {
    console.log(error);
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
    res.status(200).send(product);
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
    user = await User.updateOne(
      { _id: req.user.userId },
      { $pull: { favList: req.body.activityId } }
    );
    fav = await favList.deleteOne({ _id: req.body.activityId });
    res.status(200).json({ fav, user });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = favController;
