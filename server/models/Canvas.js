const mongoose = require('mongoose');

const Canvas = new mongoose.Schema({
  id: String,
  email: String,
  title: String,
  created: Number,
  edited: Number,
  base64: String,
  width: Number,
  height: Number,
  public: Boolean,
  access: Array,
});

module.exports = mongoose.model('Canvas', Canvas);
