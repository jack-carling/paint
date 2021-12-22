const Canvas = require('./models/Canvas');
const User = require('./models/User');
const { validateToken } = require('./token');

module.exports = (app) => {
  app.post('/api/projects/save', validateToken, async (req, res) => {
    const result = { success: false, message: '' };
    const { id, email, title, base64, width, height, public, access } = req.body;

    const [user] = await User.find({ email });
    if (!user) {
      return handleError(res, 'E-mail not found in database.');
    }
    if (!title?.length) {
      return handleError(res, 'Title is missing.');
    }
    if (!base64?.length) {
      return handleError(res, 'Base64 string is missing.');
    }
    if (!width || !height) {
      return handleError(res, 'Size is missing');
    }
    if (width > 2000) {
      return handleError(res, 'Width is too big.');
    }
    if (height > 2000) {
      return handleError(res, 'Height is too big.');
    }
    if (typeof public !== 'boolean') {
      return handleError(res, 'Public has an incorrect value');
    }
    if (!Array.isArray(access)) {
      return handleError(res, 'Access has an incorrect value');
    }
    if (!id?.length) {
      return handleError(res, 'ID is missing.');
    }

    const [exists] = await Canvas.find({ id });

    if (!exists) {
      const date = Date.now();
      const data = {
        created: date,
        edited: date,
        id,
        email,
        title,
        base64,
        width,
        height,
        public,
        access,
      };
      const db = new Canvas(data);
      try {
        await db.save();
        result.success = true;
        result.message = 'Successfully saved project.';
      } catch (error) {
        return handleError(res, error);
      }
    } else {
      const date = Date.now();
      const data = {
        edited: date,
        title,
        base64,
        width,
        height,
        public,
        access,
      };
      try {
        await Canvas.findOneAndUpdate({ id }, { ...data });
        result.success = true;
        result.message = 'Successfully updated project.';
      } catch (error) {
        return handleError(res, error);
      }
    }

    res.json(result);
  });

  app.get('/api/projects', validateToken, async (req, res) => {
    const result = { success: false, message: '', data: [] };
    const { email } = req.query;
    try {
      const projects = await Canvas.find({ email }).sort({ edited: -1 });
      result.success = true;
      result.message = 'Successfully fetched all projects.';
      if (projects) {
        result.data = projects;
      }
    } catch (error) {
      return handleError(res, error);
    }
    res.json(result);
  });

  app.get('/api/projects/:id', async (req, res) => {
    const result = { success: false, message: '', data: {} };
    const { id } = req.params;
    try {
      const [project] = await Canvas.find({ id });
      if (!project) return handleError(res, 'No project with this ID.');
      result.success = true;
      result.message = 'Successfully fetched a project.';
      result.data = project;
    } catch (error) {
      return handleError(res, error);
    }
    res.json(result);
  });

  function handleError(res, message) {
    const result = { success: false, message };
    res.json(result);
  }
};
