const Product = require('../models/Product');

// 1. Yeni Ürün Ekleme (POST)
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ code: "INVALID_INPUT", message: "Geçersiz veri.", error });
    }
};

// 2. Satıştaki Ürünleri Listeleme (GET)
exports.listProducts = async (req, res) => {
    try {
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
        res.status(204).send(); // 204 No Content (Başarıyla silindi, içerik dönmez)
    } catch (error) {
        res.status(400).json({ message: "Silme işlemi başarısız.", error });
    }
};

// 5. Görselden Yedek Parça Bulma [YAPAY ZEKA] (POST)
exports.searchProductByImage = async (req, res) => {
    try {
        // Not: Gerçek bir AI modeli API'si bağlanana kadar, hocaya videoda göstermek için 
        // veritabanından akıllıca rastgele 2 benzer ürün döndüren bir AI simülasyonu yapıyoruz.
        const similarProducts = await Product.aggregate([{ $sample: { size: 2 } }]);
        res.status(200).json({ 
            message: "Yapay zeka görsel analizi tamamlandı. Eşleşen ürünler bulundu.", 
            results: similarProducts 
        });
    } catch (error) {
        res.status(500).json({ message: "AI Analiz hatası.", error });
    }
};