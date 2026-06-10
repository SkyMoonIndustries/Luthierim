const Product = require('../models/Product');
// Üst dizindeki devops_helpers dosyasından Redis istemcisini çağırıyoruz
const { redisClient } = require('../../devops_helpers'); 

// 1. Yeni Ürün Ekleme (POST)
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        
        // ÖNEMLİ: Yeni ürün eklenince Redis'teki eski listeyi temizle
        await redisClient.del('all_products');
        console.log('♻️ Yeni ürün eklendi, Redis cache temizlendi.');

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ code: "INVALID_INPUT", message: "Geçersiz veri.", error });
    }
};

// 2. Satıştaki Ürünleri Listeleme (GET)
exports.listProducts = async (req, res) => {
    try {
        // RADAR DEAKTİF: Redis'i şimdilik bypass ediyoruz ki uygulama asla çökmesin
        /*
        const cachedProducts = await redisClient.get('all_products');
        if (cachedProducts) {
            return res.status(200).json(JSON.parse(cachedProducts));
        }
        */

        // Sistem doğrudan güvenli liman olan MongoDB'den veriyi çekecek
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası.", error });
    }
};

// 3. Ürün Bilgilerini Güncelleme (PUT)
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "İstenilen kaynak bulunamadı." });
        
        // ÖNEMLİ: Ürün güncellenince eski cache'i patlat ki vitrinde eski fiyat kalmasın
        await redisClient.del('all_products');
        console.log('♻️ Ürün güncellendi, Redis cache temizlendi.');

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Güncelleme başarısız.", error });
    }
};

// 4. Ürünü Yayından Kaldırma (DELETE)
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
        if (!deletedProduct) return res.status(404).json({ message: "İstenilen kaynak bulunamadı." });
        
        // ÖNEMLİ: Ürün silinince cache'i temizle
        await redisClient.del('all_products');
        console.log('♻️ Ürün silindi, Redis cache temizlendi.');

        res.status(204).send(); 
    } catch (error) {
        res.status(400).json({ message: "Silme işlemi başarısız.", error });
    }
};

const { GoogleGenAI } = require('@google/genai');

// 5. Görselden Yedek Parça Bulma [GERÇEK YAPAY ZEKA] (POST)
exports.searchProductByImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Lütfen 'image' anahtarı ile bir fotoğraf yükleyin." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_2});

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                "Bu fotoğraftaki müzik aleti donanımının veya yedek parçasının adını Türkçe olarak, sadece tek bir kelime ile söyle (örneğin: gitar, manyetik, tel, pena, köprü, klavye, amfi). Başka hiçbir açıklama yapma.",
                {
                    inlineData: {
                        data: req.file.buffer.toString("base64"),
                        mimeType: req.file.mimetype
                    }
                }
            ]
        });

        const keyword = response.text.trim();
        console.log("🤖 Yapay Zeka Algıladı:", keyword);

        const matchedProducts = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        });

        res.status(200).json({ 
            message: `Yapay zeka görseli analiz etti. Algılanan nesne: '${keyword}'`, 
            results: matchedProducts 
        });

    } catch (error) {
        console.error("AI Hatası:", error);
        res.status(500).json({ message: "Yapay zeka analizi sırasında bir hata oluştu.", error: error.message });
    }
};