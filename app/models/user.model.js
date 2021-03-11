const mongoose = require("mongoose");

const User = mongoose.model(

  "User",

  new mongoose.Schema({
    username: {
      type:String,
      require : true,
    },

    email: {
      type:String,
      require : true,
    },

    password:{
      type:String
    },

    status: {
      type: String,
      require : true,
      default: 1
    },

    createdDate: {
    type: Date,
    require : true,
    
    },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })

);

module.exports = User;
