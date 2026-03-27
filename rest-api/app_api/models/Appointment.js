const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  instrumentId: {
    type: mongoose.Schema.Types.ObjectId, // İleride enstrümanları bağlamak için
    required: [true, 'Enstrüman ID zorunludur']
  },
  date: {
    type: Date,
    required: [true, 'Randevu tarihi zorunludur']
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled', 'Postponed'],
    default: 'Active'
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Appointment', appointmentSchema);