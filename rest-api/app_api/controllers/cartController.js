const CartItem = require('../models/cartItem');
// Üst dizindeki devops_helpers dosyasından RabbitMQ fırlatıcısını çağırıyoruz
const { sendOrderToQueue } = require('../../devops_helpers'); 

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

// 9. Alışverişi Tamamla (POST)
exports.checkoutCart = async (req, res) => {
    try {
        const items = await CartItem.find();
        if (items.length === 0) {
            return res.status(400).json({ message: "Sepetiniz boş." });
        }

        // KUYRUK DEAKTİF: Sunucuyu riske atmamak için RabbitMQ fırlatıcısını yorum satırı yaptık
        // await sendOrderToQueue(orderData);

        // Sepeti temizle ve kullanıcıya siparişin alındığını söyle (Doğrudan onay sistemi)
        await CartItem.deleteMany({});
        res.status(202).json({ message: "Siparişiniz başarıyla alındı!" });

    } catch (error) {
        res.status(500).json({ message: "Sipariş işlenirken hata oluştu.", error: error.message });
    }
};