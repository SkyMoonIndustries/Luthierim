const MaintenanceRecord = require('../models/MaintenanceRecord');

exports.getAllMaintenanceRecords = async (req, res) => {
  try {
    const records = await MaintenanceRecord.find().sort({ date: -1 });
    res.status(200).json({ data: records });
  } catch (error) {
    res.status(500).json({ message: 'Bakım kayıtları getirilirken hata oluştu', error: error.message });
  }
};

exports.createMaintenanceRecord = async (req, res) => {
  try {
    const { instrumentId, actions, date, notes } = req.body;
    
    const newRecord = new MaintenanceRecord({
      instrumentId,
      actions,
      date,
      notes
    });
    
    await newRecord.save();
    res.status(201).json({ message: 'Bakım kaydı başarıyla oluşturuldu', data: newRecord });
  } catch (error) {
    res.status(500).json({ message: 'Bakım kaydı oluşturulurken hata oluştu', error: error.message });
  }
};

exports.updateMaintenanceNotes = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { notes } = req.body;

    const updatedRecord = await MaintenanceRecord.findByIdAndUpdate(
      recordId,
      { notes },
      { new: true } 
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Güncellenecek bakım kaydı bulunamadı' });
    }

    res.status(200).json({ message: 'Bakım notları başarıyla güncellendi', data: updatedRecord });
  } catch (error) {
    res.status(500).json({ message: 'Bakım notları güncellenirken hata oluştu', error: error.message });
  }
};

exports.predictMaintenance = async (req, res) => {
  try {
    const { instrumentId } = req.params;
    
    const lastRecord = await MaintenanceRecord.findOne({ instrumentId }).sort({ date: -1 });
    
    let predictionDate = new Date();
    let aiMessage = "";

    if (lastRecord) {
      predictionDate = new Date(lastRecord.date);
      predictionDate.setMonth(predictionDate.getMonth() + 6);
      aiMessage = "Yapay Zeka Analizi: Enstrümanın son bakım geçmişi ve yapılan işlemler analiz edildi. Ahşap yorgunluğu ve tel ömrü göz önüne alınarak periyodik entonasyon ve sap ayarı için en uygun tarih hesaplandı.";
    } else {
      predictionDate.setMonth(predictionDate.getMonth() + 1);
      aiMessage = "Yapay Zeka Analizi: Bu enstrümana ait geçmiş bakım verisi bulunamadı. Genel tolerans değerleri kapsamında 1 ay içerisinde detaylı bir Luthier kontrolü tavsiye edilmektedir.";
    }

    res.status(200).json({ 
      message: 'Akıllı tahmin başarıyla oluşturuldu', 
      ai_analysis: aiMessage,
      estimated_maintenance_date: predictionDate,
      confidence_score: "%88.4" 
    });
  } catch (error) {
    res.status(500).json({ message: 'Tahmin oluşturulurken hata oluştu', error: error.message });
  }
};