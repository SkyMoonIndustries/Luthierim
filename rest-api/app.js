require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB baglantisi basarili'))
  .catch((err) => console.log('MongoDB baglanti hatasi:', err));

const apiRoutes = require('./app_api/routes/index');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda calisiyor...`);
});

module.exports = app;