const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/cart/items', cartController.getCartItems);
router.post('/cart/items', cartController.addToCart);
router.delete('/cart/items/:itemId', cartController.removeFromCart);

module.exports = router;