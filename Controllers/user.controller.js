const User = require('../Models/user.model');
const favList = require('../Models/favList.model')
const userController = {};
const bcrypt = require('bcrypt')

userController.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
              });
              user.save().then(
                () => {
                  res.status(201).json({
                    message: 'User added successfully!'
                  });
                }
              ).catch(
                (error) => {
                  res.status(500).json({
                    error: error
                  });
                }
              );
            }
          );
        };

userController.getUser = (req, res) => {
  let user;
  try{
   user = User.findOne({_id : req.params.userId})
   .populate("favList")
   .then(user => {
     res.status(201).json(user)
   })
  } catch (error){
    res.status(500).json({
      error : error
    })
  }
};

userController.getAllUsers = async function (req, res) {
  console.log("GET /users");
  let users;
  try {
    users = await User.find().populate("favList")
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

userController.addFavorite = async function (req, res) {
  let user;
  try {
    user = await User.updateOne({_id : req.body._id}, { $addToSet: { favList: req.body.activityId } });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error)
  }
};

userController.addFav = (req,res) => {
  User.findOne({_id : req.body._id}).then(
    (user) => {
      if (!user) {
        return res.status(401).json({
          error : new Error('User not found!')
        });
      }
    User.updateOne({_id : req.body._id}, { $addToSet: { favList: req.body.activityId } });
    res.sent(user)
    }
  ).catch((error) => {
    res.status(500).json({
      error : error
    })
  })
}

userController.removeFavorite = async function (req, res) {
  let user;
  try {
    user = await User.updateOne({_id: req.body._id}, {$pull : {favList : req.body.activityId}});
    res.send(user)
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = userController;