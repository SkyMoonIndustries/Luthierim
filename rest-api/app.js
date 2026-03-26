const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // .env dosyasındaki gizli verileri okumak için

// Kendi yazdığımız rotaları (routes) içeri aktarıyoruz
const productRoutes = require('./app_api/routes/productRoutes');
const cartRoutes = require('./app_api/routes/cartRoutes');

const app = express();

// Orta katmanlar (Middleware)
app.use(cors()); // Dışarıdan gelen isteklere izin ver (Vercel ve Front-end için şart)
app.use(express.json()); // Gelen JSON verilerini okuyabilmek için

// Rotaları kullan
// Gelen istek /products ile başlıyorsa productRoutes dosyasına git
app.use('/', productRoutes); 
app.use('/', cartRoutes);

// Veritabanı (MongoDB) Bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB veritabanına başarıyla bağlanıldı!'))
    .catch((err) => console.log('❌ MongoDB bağlantı hatası:', err));

// Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});