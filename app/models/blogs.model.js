const mongoose = require('mongoose');

const Blogs = mongoose.model(
  'Blogs',

  new mongoose.Schema({
    title: {
      type: String,
      require: true,
    },

    description: {
      type: String,
      require: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    comments: {
      type: mongoose.Schema.Types.Mixed,
      require: true,
    },

    status: {
      type: String,
      require: true,
      default: 1,
    },

    createdDate: {
      type: Date,
      require: true,
    },
  }),
);

module.exports = Blogs;
