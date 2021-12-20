require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

app.use(express.json());

(async function connect() {
  await mongoose.connect(process.env.MONGO_DB);
})().catch((error) => console.log(error));

require('./auth')(app);
require('./save')(app);

app.listen(port, () => {
  console.log('Server running on port:', port);
});
