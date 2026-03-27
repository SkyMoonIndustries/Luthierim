const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Instrument', instrumentSchema);