const mongoose = require('mongoose');

const Canvas = new mongoose.Schema({
  author: mongoose.Types.ObjectId,
  title: String,
  created: Number,
  edited: Number,
  canvas: String,
  width: Number,
  height: Number,
  public: Boolean,
  access: Array,
});

module.exports = mongoose.model('Canvas', Canvas);
