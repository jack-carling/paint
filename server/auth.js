const bcrypt = require('bcrypt');
const User = require('./models/User');

const validate = require('./validate');

module.exports = (app) => {
  app.post('/api/auth/register', async (req, res) => {
    const result = { success: false, message: '' };
    const { name, email, password } = req.body;

    // Check name
    const checkName = validate.validateName(name);
    if (!checkName.success) {
      handleError(res, checkName.message);
      return;
    }

    // Check password
    const checkPassword = validate.validatePassword(password);
    if (!checkPassword.success) {
      handleError(res, checkPassword.message);
      return;
    }

    // Check email
    const checkEmail = validate.validateEmail(email);
    if (!checkEmail.success) {
      handleError(res, checkEmail.message);
      return;
    }

    // Check if email exists in database
    const exists = await User.find({ email });
    if (exists.length) {
      handleError(res, 'Email already exists.');
      return;
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const date = Date.now();
    const data = { date, name, email, password: hashedPassword };
    const db = new User(data);

    try {
      await db.save();
      result.success = true;
      result.message = 'Successfully registered a new user.';
    } catch (error) {
      handleError(res, error);
      return;
    }

    res.json(result);
  });

  function handleError(res, message) {
    const result = { success: false, message };
    res.json(result);
  }
};
