const express = require('express');
const router = express.Router();

const appointmentCtrl = require('../controllers/appointmentController');
const maintenanceCtrl = require('../controllers/maintenanceController');

const customerController = require('../controllers/customerController');
const instrumentController = require('../controllers/instrumentController');

// Halil'in Kısımları
router.post('/appointments', appointmentCtrl.createAppointment);
router.get('/appointments/active', appointmentCtrl.getActiveAppointments);
router.put('/appointments/:appointmentId', appointmentCtrl.postponeAppointment);
router.delete('/appointments/:appointmentId', appointmentCtrl.cancelAppointment);
router.get('/maintenance-records', maintenanceCtrl.getAllMaintenanceRecords);
router.post('/maintenance-records', maintenanceCtrl.createMaintenanceRecord);
router.put('/maintenance-records/:recordId', maintenanceCtrl.updateMaintenanceNotes);
router.get('/instruments/:instrumentId/maintenance-prediction', maintenanceCtrl.predictMaintenance);

// Mustafa'nın Kısımları
router.post('/customers/register', customerController.registerCustomer);
router.put('/customers/:customerId', customerController.updateCustomer);
router.delete('/customers/:customerId', customerController.deleteCustomer);
router.get('/customers/:customerId/instruments', customerController.getCustomerInstruments);
router.post('/customers/:customerId/instruments', customerController.addInstrument);

router.put('/instruments/:instrumentId', instrumentController.updateInstrument);
router.delete('/instruments/:instrumentId', instrumentController.deleteInstrument);
router.post('/instruments/:instrumentId/recommendations', instrumentController.getRecommendations);

module.exports = router;