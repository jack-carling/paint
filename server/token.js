const jwt = require('jsonwebtoken');

function generateToken(name, email) {
  return jwt.sign({ name, email }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
}

function validateToken(req, res, next) {
  const token = req.body.token;
  console.log('token:', token);
  if (!token) return res.status(401).json({ success: false });
  jwt.verify(token, process.env.TOKEN_SECRET, (error) => {
    console.log(error);
    if (error) return res.status(403).json({ success: false });
    next();
  });
}

exports.generateToken = generateToken;
exports.validateToken = validateToken;
