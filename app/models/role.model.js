const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",

  new mongoose.Schema({
    name: {
      type:String,
      require : true,
    },

    status: {
      type: String,
      require : true,
      default: 1
    },

    createdDate: {
    type: Date,
    require : true    
    },

  })

);

module.exports = Role;