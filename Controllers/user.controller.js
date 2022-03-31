const User = require("../Models/user.model");
const userController = {};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.KEY;

userController.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ msg: "User already exists with this email." });
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hash,
    });

    await newUser.save();
    return res.status(201).json({
      message: "User added successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

userController.signup = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user)
      return res
        .status(400)
        .json({ msg: "User already exists with this email." });
    //if user doesn't exist we add new user below
    //hashing password first using bcrypt
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      //saving user with hashed password to database
      user
        .save()
        .then(() => {
          res.status(201).json({
            message: "User added successfully!",
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    });
  });
};

userController.loginAsync = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: new Error("user not found") });
    const valid = bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: new Error("incorrect password") });
    const token = jwt.sign({ userId: user._id, email: user.email }, key, {
      expiresIn: 12000,
    });
    return res.status(200).json({
      userId: user._id,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

userController.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error("user not found!"),
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error("Incorrect password"),
            });
          }
          const token = jwt.sign({ userId: user._id }, key, {
            expiresIn: 60,
          });

          res.status(200).json({
            token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

//Another way to write a login function:

userController.decodeToken = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: err,
      });
    }
    return res.status(200).json({
      userId: decoded.userId,
      email: decoded.email,
    });
  });
};

userController.logIn = (req, res) => {
  const { email, password } = req.body;
  //simple validation:
  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }

  // check for existing user:
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "user not found" });

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign({ userId: user._id }, key, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          user: {
            userId: user._id,
            email: user.email,
          },
        });
      });
    });
  });
};

userController.getUser = (req, res) => {
  try {
    let user;
    user = User.findOne({ _id: req.user.userId })
      .populate("favList")
      .then((user) => {
        res.status(200).json(user);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
};

userController.getAllUsers = async function (req, res) {
  console.log("GET /users");
  let users;
  try {
    users = await User.find().populate("favList");
    return res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

userController.addFavorite = async function (req, res) {
  let users;
  try {
    users = await User.updateOne(
      { _id: req.user.userId },
      { $addToSet: { favList: req.body.activityId } }
    );
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

userController.addFav = (req, res) => {
  User.findOne({ _id: req.body._id })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error("User not found!"),
        });
      }
      User.updateOne(
        { _id: req.body._id },
        { $addToSet: { favList: req.body.activityId } }
      );
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};
//addFav and removeFav  taken to favModel.

userController.removeFav = async function (req, res) {
  let user;
  try {
    user = await User.updateOne(
      { _id: req.body.userId },
      { $pull: { favList: req.body.activityId } }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

userController.removeFavorite = async function (req, res) {
  let user;
  try {
    user = await User.updateOne(
      { _id: req.body.userId },
      { $pull: { favList: req.body.activityId } }
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = userController;
