const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/products', productController.addProduct);
router.get('/products', productController.listProducts);
router.put('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);
router.post('/products/search/image', productController.searchProductByImage);

module.exports = router;