require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose'); 

const app = express();

app.use(express.json()); 

const apiRoutes = require('./app_api/routes/index');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

app.use('/v1', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});