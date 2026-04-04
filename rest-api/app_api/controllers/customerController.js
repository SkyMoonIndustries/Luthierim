const Customer = require('../models/Customer');
const Instrument = require('../models/Instrument');

exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const newCustomer = new Customer({ name, email, password, phone });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.customerId, req.body, { new: true });
    if (!updatedCustomer) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.customerId);
    if (!deletedCustomer) return res.status(404).json({ error: 'Not found' });
    await Instrument.deleteMany({ customerId: req.params.customerId });
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCustomerInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find({ customerId: req.params.customerId });
    res.status(200).json(instruments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addInstrument = async (req, res) => {
  try {
    const { brand, model, year } = req.body;
    const newInstrument = new Instrument({ brand, model, year, customerId: req.params.customerId });
    await newInstrument.save();
    res.status(201).json(newInstrument);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};