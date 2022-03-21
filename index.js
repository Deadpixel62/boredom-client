const express = require("express");
const app = express();
const mongoose=require('mongoose');
const cors = require('cors');
app.use(cors());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
require("dotenv").config();
app.use(express.json());
const userRouter = require('./Routes/user.routes');
const favRouter = require('./Routes/favList.routes');

const Port = process.env.PORT || 4002;
const Url = process.env.URL



app.get('/', (req,res) => {
    res.send(`Server connected on Port ${Port}`)
})



mongoose.connect("mongodb+srv://Deadpixel62:popo0909@cluster0.xwll3.mongodb.net/boredom-api?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;

db.on("open", () => {
  console.log("connected to database MongoDb");
});

app.use('/', userRouter);
app.use('/', favRouter);


app.listen(Port, () => console.log(`Server connected on port ${Port}`));