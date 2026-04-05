import { useState, useEffect } from 'react';
import { CalendarDays, BrainCircuit, Trash2, CalendarPlus, Activity, CheckCircle, Clock, FileText, Wrench, Edit, Plus, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '../api';

export default function Maintenance() {
  const [loading, setLoading] = useState(false);
  
  // -- YAPAY ZEKA STATE'LERİ (Gereksinim 8) --
  const [aiData, setAiData] = useState({ playFrequency: 'Haftada 5 saat', sweatProfile: 'Normal', environment: 'Standart' });
  const [aiResult, setAiResult] = useState('');

  // -- RANDEVU STATE'LERİ (Gereksinim 1, 2, 3, 4) --
  const [appointmentData, setAppointmentData] = useState({ date: '', notes: '' });
  const [activeAppointments, setActiveAppointments] = useState([]);

  // -- BAKIM GEÇMİŞİ STATE'LERİ (Gereksinim 5, 6, 7) --
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [recordForm, setRecordForm] = useState({ actions: '', notes: '' });
  const [editingRecordId, setEditingRecordId] = useState(null);

  // Sabit Instrument ID (Test için)
  const dummyInstrumentId = "65b2a1c2e4b0c1234567890a";

  useEffect(() => {
    fetchAppointments();
    fetchMaintenanceRecords();
  }, []);

  // --- API İSTEKLERİ ---

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/v1/appointments/active');
      setActiveAppointments(response.data.data);
    } catch (error) {
      console.error("Randevular çekilemedi:", error);
    }
  };

  const fetchMaintenanceRecords = async () => {
    try {
      const response = await api.get('/v1/maintenance-records');
      setMaintenanceRecords(response.data.data);
    } catch (error) {
      console.error("Bakım kayıtları çekilemedi:", error);
    }
  };

  // Gereksinim 8: Akıllı Bakım Tahmini
  const handleAIPrediction = async () => {
    setLoading(true);
    try {
      const { playFrequency, sweatProfile, environment } = aiData;
      const response = await api.get(`/v1/instruments/${dummyInstrumentId}/maintenance-prediction?playFrequency=${playFrequency}&sweatProfile=${sweatProfile}&environment=${environment}`);
      setAiResult(response.data.ai_analysis);
      toast.success("Yapay Zeka analizi tamamlandı!");
    } catch  {
      toast.error("Tahmin oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Gereksinim 1: Yeni Randevu Al
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/v1/appointments', {
        instrumentId: dummyInstrumentId,
        date: appointmentData.date,
        notes: appointmentData.notes
      });
      toast.success("Randevunuz başarıyla oluşturuldu!");
      setAppointmentData({ date: '', notes: '' });
      fetchAppointments();
    } catch {
      toast.error("Randevu oluşturulamadı.");
    }
  };

  // Gereksinim 2: Randevu Erteleme
  const handlePostponeAppointment = async (id) => {
    const { value: newDate } = await Swal.fire({
      title: 'Randevuyu Ertele',
      html: '<input type="datetime-local" id="swal-input1" class="swal2-input">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Ertele',
      cancelButtonText: 'Vazgeç',
      preConfirm: () => {
        return document.getElementById('swal-input1').value
      }
    });

    if (newDate) {
      try {
        await api.put(`/v1/appointments/${id}`, { newDate });
        toast.success("Randevu başarıyla ertelendi!");
        fetchAppointments();
      } catch  {
        toast.error("Erteleme işlemi başarısız.");
      }
    }
  };

  // Gereksinim 3: Randevu İptal Etme
  const handleCancelAppointment = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu bakım randevusunu iptal etmek istiyor musunuz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Evet, İptal Et'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/v1/appointments/${id}`);
        toast.success("Randevu iptal edildi.");
        fetchAppointments();
      } catch  {
        toast.error("İptal işlemi başarısız.");
      }
    }
  };

  // Gereksinim 5 & 6: Bakım Kaydı Oluşturma ve Güncelleme
  const handleSaveRecord = async (e) => {
    e.preventDefault();
    try {
      if (editingRecordId) {
        // Güncelleme
        await api.put(`/v1/maintenance-records/${editingRecordId}`, { notes: recordForm.notes });
        toast.success("Bakım notları güncellendi!");
      } else {
        // Yeni Kayıt (Virgülle ayrılan işlemleri diziye çeviriyoruz)
        const actionsArray = recordForm.actions.split(',').map(item => item.trim());
        await api.post('/v1/maintenance-records', {
          instrumentId: dummyInstrumentId,
          actions: actionsArray,
          notes: recordForm.notes
        });
        toast.success("Yeni bakım geçmişi eklendi!");
      }
      setRecordForm({ actions: '', notes: '' });
      setEditingRecordId(null);
      fetchMaintenanceRecords();
    } catch {
      toast.error("Bakım kaydı işlemi başarısız.");
    }
  };

  const handleEditRecord = (record) => {
    setRecordForm({ actions: record.actions.join(', '), notes: record.notes });
    setEditingRecordId(record._id);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={28} color="#8e44ad" /> Enstrüman Bakım Merkezi
      </h2>

      {/* ÜST BÖLÜM: YAPAY ZEKA VE RANDEVU (Müşteri Tarafı) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* YAPAY ZEKA PANELİ */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #007bff' }}>
          <h3 style={{ marginBottom: '15px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit size={24} color="#007bff" /> Akıllı Bakım Tahmini
          </h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>Çalma alışkanlıklarınızı girin, yapay zeka bir sonraki bakım zamanınızı söylesin.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
            <input type="text" placeholder="Çalma Sıklığı (Örn: Haftada 10 saat)" value={aiData.playFrequency} onChange={e => setAiData({...aiData, playFrequency: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Terleme Profili (Örn: Yüksek, Normal)" value={aiData.sweatProfile} onChange={e => setAiData({...aiData, sweatProfile: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Çevre (Örn: İzmir, Nemli)" value={aiData.environment} onChange={e => setAiData({...aiData, environment: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>
          <button onClick={handleAIPrediction} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#bdc3c7' : '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {loading ? 'Analiz ediliyor...' : <><BrainCircuit size={18} /> Tahmin Et</>}
          </button>
          {aiResult && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', color: '#004085', borderLeft: '4px solid #007bff', borderRadius: '4px', fontSize: '14px', lineHeight: '1.5' }}>
              <strong>Luthier Tavsiyesi:</strong> <br/> {aiResult}
            </div>
          )}
        </div>

        {/* RANDEVU ALMA PANELİ */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #27ae60' }}>
          <h3 style={{ marginBottom: '15px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarPlus size={24} color="#27ae60" /> Yeni Randevu Al
          </h3>
          <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="datetime-local" required value={appointmentData.date} onChange={e => setAppointmentData({...appointmentData, date: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <textarea placeholder="Şikayetiniz veya Notlar (Örn: Teller çok yüksek)" required value={appointmentData.notes} onChange={e => setAppointmentData({...appointmentData, notes: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '80px' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
              <CheckCircle size={18} /> Randevuyu Onayla
            </button>
          </form>
        </div>
      </div>

      {/* ORTA BÖLÜM: RANDEVU VE GEÇMİŞ LİSTELERİ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* AKTİF RANDEVULAR (Gereksinim 4, Erteleme ve İptal) */}
        <div>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={24} color="#e74c3c" /> Aktif Randevular
          </h3>
          {activeAppointments.length === 0 ? <p style={{ color: '#666' }}>Randevu bulunmuyor.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeAppointments.map(app => (
                <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '4px solid #e74c3c', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{new Date(app.date).toLocaleString('tr-TR')}</h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Not: {app.notes}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handlePostponeAppointment(app._id)} style={{ padding: '8px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Ertele"><Clock size={18} /></button>
                    <button onClick={() => handleCancelAppointment(app._id)} style={{ padding: '8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="İptal Et"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TAMAMLANAN BAKIMLAR (Gereksinim 7) */}
        <div>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={24} color="#34495e" /> Tamamlanan Bakımlar
          </h3>
          {maintenanceRecords.length === 0 ? <p style={{ color: '#666' }}>Geçmiş bakım bulunmuyor.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {maintenanceRecords.map(record => (
                <div key={record._id} style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '4px solid #34495e', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{new Date(record.date).toLocaleDateString('tr-TR')}</h4>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>İşlemler: {record.actions.join(', ')}</p>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Luthier Notu: {record.notes}</p>
                  {/* Luthier'in notu güncelleyebilmesi için ufak bir buton */}
                  <button onClick={() => handleEditRecord(record)} style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px', backgroundColor: '#bdc3c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} title="Notu Güncelle"><Edit size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ALT BÖLÜM: LUTHIER İŞLEM PANELİ (Gereksinim 5 ve 6) */}
      <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #f39c12' }}>
        <h3 style={{ marginBottom: '15px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wrench size={24} color="#f39c12" /> Luthier İşlem Paneli (Bakım Kaydı Gir/Güncelle)
        </h3>
        <form onSubmit={handleSaveRecord} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Sadece yeni kayıtta işlemleri soruyoruz, güncellemede sadece not değişiyor (backend API'ne göre) */}
          {!editingRecordId && (
            <input type="text" placeholder="Yapılan İşlemler (Örn: Sap ayarı, Tel değişimi)" required value={recordForm.actions} onChange={e => setRecordForm({...recordForm, actions: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          )}
          <textarea placeholder="Luthier Notu / Detaylar..." required value={recordForm.notes} onChange={e => setRecordForm({...recordForm, notes: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '80px' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {editingRecordId ? <><Save size={18} /> Notu Güncelle</> : <><Plus size={18} /> Yeni Kayıt Ekle</>}
            </button>
            {editingRecordId && (
              <button type="button" onClick={() => { setEditingRecordId(null); setRecordForm({ actions: '', notes: '' }); }} style={{ padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={18} /> İptal
              </button>
            )}
          </div>
        </form>
      </div>

    </div>
  );
}