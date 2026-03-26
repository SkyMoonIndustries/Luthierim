const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  try {
    const { instrumentId, date, notes } = req.body;
    
    const newAppointment = new Appointment({ 
      instrumentId, 
      date, 
      notes 
    });
    
    await newAppointment.save();
    res.status(201).json({ message: 'Randevu başarıyla oluşturuldu', data: newAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Randevu oluşturulurken hata oluştu', error: error.message });
  }
};

exports.getActiveAppointments = async (req, res) => {
  try {
    const activeAppointments = await Appointment.find({ status: 'Active' });
    res.status(200).json({ data: activeAppointments });
  } catch (error) {
    res.status(500).json({ message: 'Aktif randevular getirilirken hata oluştu', error: error.message });
  }
};

exports.postponeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { newDate } = req.body; 

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date: newDate, status: 'Postponed' },
      { new: true } 
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Ertelenecek randevu bulunamadı' });
    }

    res.status(200).json({ message: 'Randevu başarıyla ertelendi', data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Randevu ertelenirken hata oluştu', error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!cancelledAppointment) {
      return res.status(404).json({ message: 'İptal edilecek randevu bulunamadı' });
    }

    res.status(200).json({ message: 'Randevu iptal edildi', data: cancelledAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Randevu iptal edilirken hata oluştu', error: error.message });
  }
};