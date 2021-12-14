const bcrypt = require('bcrypt');
const User = require('./models/User');
const { generateToken, validateToken } = require('./token');

const validate = require('./validate');

module.exports = (app) => {
  app.post('/api/auth/register', async (req, res) => {
    const result = { success: false, message: '' };
    const { name, email, password } = req.body;

    // Check name
    const checkName = validate.validateName(name);
    if (!checkName.success) {
      return handleError(res, checkName.message);
    }

    // Check password
    const checkPassword = validate.validatePassword(password);
    if (!checkPassword.success) {
      return handleError(res, checkPassword.message);
    }

    // Check email
    const checkEmail = validate.validateEmail(email);
    if (!checkEmail.success) {
      return handleError(res, checkEmail.message);
    }

    // Check if email exists in database
    const exists = await User.find({ email });
    if (exists.length) {
      return handleError(res, 'Email already exists.');
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const date = Date.now();
    const data = { date, name, email, password: hashedPassword };
    const db = new User(data);

    const token = generateToken(name, email);

    try {
      await db.save();
      result.success = true;
      result.name = name;
      result.email = email;
      result.token = token;
      result.message = 'Successfully registered a new user.';
    } catch (error) {
      return handleError(res, error);
    }

    res.json(result);
  });

  app.post('/api/auth/login', async (req, res) => {
    const result = { success: false, message: '' };
    const { email, password } = req.body;

    const [user] = await User.find({ email });
    if (!user) {
      return handleError(res, 'E-mail and/or password does not match.');
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const name = user.name;
      const token = generateToken(name, email);
      result.success = true;
      result.name = name;
      result.email = email;
      result.token = token;
      result.message = 'Successfully logged in.';
    } else {
      return handleError(res, 'E-mail and/or password does not match.');
    }

    res.json(result);
  });

  app.post('/api/auth/validate', validateToken, (req, res) => {
    res.json({ success: true });
  });

  function handleError(res, message) {
    const result = { success: false, message };
    res.json(result);
  }
};
