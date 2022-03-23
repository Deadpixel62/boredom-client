const mongoose = require("mongoose");
const { Schema } = mongoose;

const favSchema = new Schema(
  {
    activity: {
      type: String,
      required: true,
    },

    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const favList = mongoose.model("favList", favSchema);
module.exports = favList;
