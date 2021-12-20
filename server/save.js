const Canvas = require('./models/Canvas');

module.exports = (app) => {
  app.post('/api/save', (req, res) => {
    res.json({ success: true });
  });
};
