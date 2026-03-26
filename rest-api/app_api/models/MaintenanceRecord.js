const mongoose = require('mongoose');

const maintenanceRecordSchema = new mongoose.Schema({
  instrumentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Enstrüman ID zorunludur']
  },
  actions: {
    type: [String], // "Sap ayarı", "Tel değişimi" gibi birden fazla işlemi dizi olarak tutmak için
    required: [true, 'Yapılan bakım işlemleri belirtilmelidir']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRecord', maintenanceRecordSchema);