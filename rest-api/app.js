require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

// Orta katmanlar (Middleware)
app.use(cors()); // Vercel ve Front-end'in haberleşebilmesi için ŞART!
app.use(express.json()); // JSON verilerini okumak için

// Rotalar (Routes)
// 1. Gökay Uysal (Senin Kısım)
const productRoutes = require('./app_api/routes/productRoutes');
const cartRoutes = require('./app_api/routes/cartRoutes');
app.use('/', productRoutes);
app.use('/', cartRoutes);

// 2. Halil ve Mustafa'nın Kısımları
// DİKKAT: İkisi de aynı 'index.js' dosyasını göstermiş. Kimsenin testi patlamasın diye
// aynı dosyayı hem /v1 hem de /api üzerinden ulaşılabilecek şekilde ayarlıyoruz.
const ekipRoutes = require('./app_api/routes/index');
app.use('/v1', ekipRoutes);  // Halil'in Postman testleri için
app.use('/api', ekipRoutes); // Mustafa'nın Postman testleri için

// Veritabanı Bağlantısı
// YENİ VERCEL (SERVERLESS) VERİTABANI BAĞLANTISI
const connectDB = async () => {
    // Eğer bağlantı zaten varsa (uyaniksa), boşuna tekrar bağlanma
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    // Bağlantı kopmuşsa (uyumuşsa) yeniden bağlan
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Serverless MongoDB bağlantısı ayağa kaldırıldı!');
    } catch (err) {
        console.log('❌ MongoDB bağlantı hatası:', err);
    }
};

// Her API isteği geldiğinde önce veritabanının uyanık olduğundan emin ol!
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});

// Mustafa'nın Eklediği Vercel (Serverless) Çıkış Kodu ŞARTI
module.exports = app;