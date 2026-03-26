const CartItem = require('../models/cartItem');

// 6. Sepetteki Ürünleri Listeleme (GET)
exports.getCartItems = async (req, res) => {
    try {
        const items = await CartItem.find().populate('productId');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Sepet getirilemedi.", error });
    }
};

// 7. Sepete Ürün Ekleme (POST)
exports.addToCart = async (req, res) => {
    try {
        const newItem = new CartItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: "Sepete eklenemedi.", error });
    }
};

// 8. Sepetten Ürün Çıkarma (DELETE)
exports.removeFromCart = async (req, res) => {
    try {
        const deletedItem = await CartItem.findByIdAndDelete(req.params.itemId);
        if (!deletedItem) return res.status(404).json({ message: "Ürün sepette bulunamadı." });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: "Sepetten çıkarma başarısız.", error });
    }
};