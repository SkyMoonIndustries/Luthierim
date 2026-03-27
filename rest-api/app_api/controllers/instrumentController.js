const Instrument = require('../models/Instrument');

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
    const instrument = await Instrument.findById(req.params.instrumentId);
    if (!instrument) return res.status(404).json({ error: 'Not found' });
    
    const aiResponse = {
      message: "Tavsiyeler",
      recommendations: [
        "10-46 kalibre tel",
        "Klavye bakim yagi",
        "Kilitli akort burgusu"
      ]
    };
    res.status(200).json(aiResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};