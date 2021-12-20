const mongoose = require('mongoose');

const Canvas = new mongoose.Schema({
  author: Number,
  created: Number,
  edited: Number,
  canvas: String,
  width: Number,
  height: Number,
  public: Boolean,
  access: Array,
});

module.exports = mongoose.model('Canvas', Canvas);
