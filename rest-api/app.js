require('dotenv').config(); // .env dosyasındaki gizli verileri okumak için
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Kendi yazdığımız rotaları (routes) içeri aktarıyoruz
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const apiRoutes = require('./app_api/routes/index'); // Senin dalından (halil-ergun) gelen yeni rota

const app = express();

// Orta katmanlar (Middleware)
app.use(cors()); // Dışarıdan gelen isteklere izin ver (Vercel ve Front-end için şart)
app.use(express.json()); // Gelen JSON verilerini okuyabilmek için

// Rotaları kullan
app.use('/', productRoutes); 
app.use('/', cartRoutes);
app.use('/v1', apiRoutes); // Senin dalından (halil-ergun) gelen yeni kullanım

// Veritabanı (MongoDB) Bağlantısı
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB veritabanına başarıyla bağlanıldı!'))
    .catch((err) => console.log('❌ MongoDB bağlantı hatası:', err));

// Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});
// Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});