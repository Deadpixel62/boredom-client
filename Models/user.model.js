const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    favList: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "favList"
        }
      ]
},
 { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User
