const mongoose = require('mongoose');
const {Schema} = mongoose;

const favoriteSchema = new Schema({
   activity : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "favList"
    }
  ],
  user : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  
},
 { timestamps: true });

const Favorites = mongoose.model("Favorites", userSchema);
module.exports = Favorites
