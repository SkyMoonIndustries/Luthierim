const express = require('express');
const router = express.Router();
const multer = require('multer'); // Fotoğraf yakalamak için
const productController = require('../controllers/productController');

// Fotoğrafı hafızada tutmak için Multer ayarı
const upload = multer({ storage: multer.memoryStorage() });

router.post('/products', productController.addProduct);
router.get('/products', productController.listProducts);
router.put('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);

// AI Uç Noktası (upload.single('image') ile formdan gelen 'image' dosyasını yakalıyoruz)
router.post('/products/search/image', upload.single('image'), productController.searchProductByImage);

module.exports = router;