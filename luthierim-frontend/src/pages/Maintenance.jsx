import { useState, useEffect } from 'react';
import { CalendarDays, BrainCircuit, Trash2, CalendarPlus, Activity, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '../api';

export default function Maintenance() {
  const [loading, setLoading] = useState(false);
  
  // -- YAPAY ZEKA STATE'LERİ --
  const [aiData, setAiData] = useState({ playFrequency: 'Haftada 5 saat', sweatProfile: 'Normal', environment: 'Standart' });
  const [aiResult, setAiResult] = useState('');

  // -- RANDEVU STATE'LERİ --
  const [appointmentData, setAppointmentData] = useState({ date: '', notes: '' });
  const [activeAppointments, setActiveAppointments] = useState([]);

  // Sabit Instrument ID (Test için)
  const dummyInstrumentId = "65b2a1c2e4b0c1234567890a";

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 1. Randevuları Çek (GET)
  const fetchAppointments = async () => {
    try {
      const response = await api.get('/v1/appointments/active');
      setActiveAppointments(response.data.data);
    } catch (error) {
      console.error("Randevular çekilemedi:", error);
    }
  };

  // 2. Yapay Zeka Bakım Tahmini (GET)
  const handleAIPrediction = async () => {
    setLoading(true);
    try {
      const { playFrequency, sweatProfile, environment } = aiData;
      const response = await api.get(`/v1/instruments/${dummyInstrumentId}/maintenance-prediction?playFrequency=${playFrequency}&sweatProfile=${sweatProfile}&environment=${environment}`);
      
      setAiResult(response.data.ai_analysis);
      toast.success("Yapay Zeka analizi tamamlandı!");
    } catch (error) {
      console.error("AI Hatası:", error);
      toast.error("Tahmin oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Yeni Randevu Al (POST)
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
      fetchAppointments(); // Listeyi güncelle
    } catch (error) {
      toast.error("Randevu oluşturulamadı.");
    }
  };

  // 4. Randevu İptal Et (DELETE)
  const handleCancelAppointment = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu bakım randevusunu iptal etmek istiyor musunuz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Evet, İptal Et',
      cancelButtonText: 'Vazgeç',
      borderRadius: '12px'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/v1/appointments/${id}`);
        toast.success("Randevu iptal edildi.");
        fetchAppointments();
      } catch (error) {
        toast.error("İptal işlemi başarısız.");
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={28} color="#8e44ad" /> Bakım & Luthier Hizmetleri
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* SOL KOLON: YAPAY ZEKA */}
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

        {/* SAĞ KOLON: RANDEVU ALMA */}
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

      {/* ALT KISIM: AKTİF RANDEVULAR LISTESI */}
      <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CalendarDays size={24} color="#e74c3c" /> Yaklaşan Randevularım
      </h3>
      
      {activeAppointments.length === 0 ? (
         <p style={{ color: '#666', fontStyle: 'italic' }}>Şu an aktif bir bakım randevunuz bulunmuyor.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeAppointments.map(app => (
            <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', borderLeft: '4px solid #e74c3c', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{new Date(app.date).toLocaleString('tr-TR')}</h4>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Not: {app.notes}</p>
              </div>
              <button onClick={() => handleCancelAppointment(app._id)} style={{ padding: '8px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="İptal Et">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}