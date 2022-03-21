const User = require('../Models/user.model');
const favList = require('../Models/favList.model')
const userController = {};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = process.env.KEY

userController.signup = (req, res) => {

  if(!req.body.email || !req.body.password){
    return res.status(400).json({ msg : "Please enter all fields"});
  }

  User.findOne({email : req.body.email})
  .then(user =>{
    if(user) return res.status(400).json({msg : "User already exists with this email."})
    //if user doesn't exist we add new user below
    //hashing password first using bcrypt
    bcrypt.hash(req.body.password, 10).then(
      (hash) => {
          const user = new User({
              email: req.body.email,
              password: hash
            });

            //adding user with hashed password
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
  })

    
        };

userController.login = (req, res, next) => {
  User.findOne({email: req.body.email}).then(
    (user) => {
      if(!user) {
        return res.status(401).json({
          error : new Error("user not found!")
        });
      }
      bcrypt.compare(req.body.password, user.password).then(
        (valid) => {
          if(!valid) {
            return res.status(401).json({
              error : new Error("Incorrect password")
            });
          }
          const token = jwt.sign(
            { userId: user._id },
            key,
            { expiresIn: '24h' });

          res.status(200).json({
            userId:user._id,
            token: token
          });
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error:error
          })
        }
      )
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error:error
      })
    }
  )
}        

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