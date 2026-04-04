const MaintenanceRecord = require('../models/MaintenanceRecord');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
    const { playFrequency = "Bilinmiyor", sweatProfile = "Normal", environment = "Standart" } = req.query;
    const lastRecord = await MaintenanceRecord.findOne({ instrumentId }).sort({ date: -1 });
    const lastMaintenanceDate = lastRecord ? lastRecord.date.toLocaleDateString('tr-TR') : "Geçmiş bakım kaydı yok.";
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Sen profesyonel bir Luthier'sin.
      Gitarın son bakım tarihi: ${lastMaintenanceDate}
      Kullanıcının çalma sıklığı: ${playFrequency}
      Terleme profili: ${sweatProfile}
      Çevre şartları: ${environment}

      Bu verilere dayanarak, luthier ağzıyla kısa ve öz (maksimum 3 cümle) bir sonraki tel değişimi ve sap ayarı için zaman tahmini ve tavsiyesi ver.
      `;
      const result = await model.generateContent(prompt);
      const aiMessage = result.response.text();
      res.status(200).json({ 
      message: 'Akıllı tahmin başarıyla oluşturuldu', 
      ai_analysis: aiMessage
    });
  } catch (error) {
    console.error("AI Hatası:", error);
    res.status(500).json({ message: 'Tahmin oluşturulurken hata oluştu', error: error.message });
  }
};