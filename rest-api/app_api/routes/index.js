const express = require('express');
const router = express.Router();

const appointmentCtrl = require('../controllers/appointmentController');
const maintenanceCtrl = require('../controllers/maintenanceController');

router.post('/appointments', appointmentCtrl.createAppointment);

router.get('/appointments/active', appointmentCtrl.getActiveAppointments);

router.put('/appointments/:appointmentId', appointmentCtrl.postponeAppointment);

router.delete('/appointments/:appointmentId', appointmentCtrl.cancelAppointment);

router.get('/maintenance-records', maintenanceCtrl.getAllMaintenanceRecords);

router.post('/maintenance-records', maintenanceCtrl.createMaintenanceRecord);

router.put('/maintenance-records/:recordId', maintenanceCtrl.updateMaintenanceNotes);

router.get('/instruments/:instrumentId/maintenance-prediction', maintenanceCtrl.predictMaintenance);

module.exports = router;