const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');
const instrumentController = require('../controllers/instrumentController');

router.post('/customers/register', customerController.registerCustomer);
router.put('/customers/:customerId', customerController.updateCustomer);
router.delete('/customers/:customerId', customerController.deleteCustomer);
router.get('/customers/:customerId/instruments', customerController.getCustomerInstruments);
router.post('/customers/:customerId/instruments', customerController.addInstrument);

router.put('/instruments/:instrumentId', instrumentController.updateInstrument);
router.delete('/instruments/:instrumentId', instrumentController.deleteInstrument);
router.post('/instruments/:instrumentId/recommendations', instrumentController.getRecommendations);

module.exports = router;