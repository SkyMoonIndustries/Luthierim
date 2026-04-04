require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();

// 1. Orta katmanlar (Middleware)
app.use(cors()); // Vercel ve Front-end'in haberleşebilmesi için ŞART!
app.use(express.json()); // JSON verilerini okumak için

// 2. --- ZOMBİ KATİLİ VERCEL VERİTABANI BAĞLANTISI ---
let isConnected = false; // Kendi global hafızamız

const connectDB = async () => {
    if (isConnected) {
        return; // Zaten taze bir bağlantımız varsa atla
    }
    try {
        // serverSelectionTimeoutMS: Zombi olursa 10 saniye bekleme, 5 saniyede uyan ve bağlan!
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ Yenilmez (Vercel-Proof) MongoDB bağlantısı kuruldu!');
    } catch (err) {
        console.log('❌ MongoDB bağlantı hatası:', err);
    }
};

// Bu kontrol ROTALARDAN HEMEN ÖNCE olmalı! (Gelen her istek önce buraya çarpar)
app.use(async (req, res, next) => {
    await connectDB();
    next();
});
// ------------------------------------------------

// 3. Rotalar (Routes)

// Gökay Uysal (Senin Kısım)
const productRoutes = require('./app_api/routes/productRoutes');
const cartRoutes = require('./app_api/routes/cartRoutes');
app.use('/', productRoutes);
app.use('/', cartRoutes);

// Halil ve Mustafa'nın Kısımları
const ekipRoutes = require('./app_api/routes/index');
app.use('/v1', ekipRoutes);  // Halil'in Postman testleri için
app.use('/api', ekipRoutes); // Mustafa'nın Postman testleri için


// 4. Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});

// 5. Mustafa'nın Eklediği Vercel (Serverless) Çıkış Kodu ŞARTI
module.exports = app;