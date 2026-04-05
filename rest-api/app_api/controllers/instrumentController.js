const Instrument = require('../models/Instrument');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // .env dosyasını okuması için şart

exports.updateInstrument = async (req, res) => {
  try {
    const updatedInstrument = await Instrument.findByIdAndUpdate(req.params.instrumentId, req.body, { new: true });
    if (!updatedInstrument) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(updatedInstrument);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInstrument = async (req, res) => {
  try {
    const deletedInstrument = await Instrument.findByIdAndDelete(req.params.instrumentId);
    if (!deletedInstrument) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getRecommendations = async (req, res) => {
  try {
    const { instrumentId } = req.params;
    // Postman'den body ile göndereceğimiz müşteri zevkleri
    const { musicGenre, favoriteArtists, playStyle } = req.body; 

    
    const instrument = await Instrument.findById(instrumentId);
    if (!instrument) return res.status(404).json({ error: 'Enstrüman bulunamadı' });
    
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_3);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

   
    const prompt = `
      Sen profesyonel bir luthier ve müzik ekipmanı danışmanısın.
      Müşterinin Gitarı: ${instrument.brand} ${instrument.model} (Üretim Yılı: ${instrument.year || 'Bilinmiyor'})
      Müzik Tarzı: ${musicGenre || 'Bilinmiyor'}
      Sevdiği Sanatçılar: ${favoriteArtists ? favoriteArtists.join(', ') : 'Bilinmiyor'}
      Çalım Tarzı: ${playStyle || 'Bilinmiyor'}

      Bu bilgilere dayanarak, bu müşterinin gitarına en uygun 1 adet gitar telini, 1 adet manyetik modifiyesini ve 2 adet efekt pedalını tavsiye et. Tavsiyelerinin nedenini kısa, net ve samimi bir dille açıkla.
    `;

    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

   
    res.status(200).json({ 
        message: "Yapay zeka analizi başarıyla tamamlandı.",
        ai_recommendations: responseText 
    });

  } catch (error) {
    console.error("AI Hatası:", error);
    res.status(500).json({ error: "Tavsiye alınırken bir sorun oluştu.", details: error.message });
  }
};