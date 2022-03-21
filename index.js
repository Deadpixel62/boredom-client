const express = require("express");
const app = express();
const mongoose=require('mongoose');
const cors = require('cors');
app.use(cors());
require("dotenv").config();
const userRouter = require('./Routes/user.routes');
const favRouter = require('./Routes/favList.routes');

const Port = process.env.PORT || 4002;
const Url = process.env.URL

app.use(express.json());

app.get('/', (req,res) => {
    res.send(`Server connected on Port ${Port}`)
})



mongoose.connect(Url, {
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