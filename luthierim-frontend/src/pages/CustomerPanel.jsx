import { useState, useEffect } from 'react';
import { User, UserPlus, Settings, Trash2, BrainCircuit, Plus, Music, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '../api';

export default function CustomerPanel() {
  const [loading, setLoading] = useState(false);

  // -- STATE'LER --
  const [customerId, setCustomerId] = useState(''); // Test için manuel ID
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [instrumentData, setInstrumentData] = useState({ brand: '', model: '', year: '' });
  const [instruments, setInstruments] = useState([]);

  // --- API İSTEKLERİ ---

  // 1. Hesap Kaydı (GÜNCELLENDİ: ID Yakalama ve Pop-up)
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/customers/register', registerData);
      
      // Backend'den gelen ID'yi her ihtimale karşı (id, _id, data.id vs) yakalıyoruz
      const newId = response.data.id || response.data._id || (response.data.data && response.data.data._id) || (response.data.data && response.data.data.id);
      
      if (newId) {
        setCustomerId(newId);
        // Ekrana kocaman ID'yi basıyoruz ki gözden kaçmasın
        Swal.fire({
          title: 'Kayıt Başarılı!',
          html: `Yeni hesabınız oluşturuldu.<br><br><b>Müşteri ID'niz:</b><br><code style="font-size: 18px; background: #eee; padding: 5px; border-radius: 4px; display: inline-block; margin-top: 5px;">${newId}</code><br><br>Sistem bu ID'yi sizin için kopyaladı ve ekrana sabitledi!`,
          icon: 'success',
          confirmButtonText: 'Harika'
        });
      } else {
        toast.success("Kayıt oluşturuldu ama ID backend'den okunamadı!");
      }
    } catch {
      toast.error("Kayıt oluşturulamadı.");
    }
  };

  // 2. Hesap Güncelleme
  const handleUpdateCustomer = async () => {
    if (!customerId) return toast.error("Lütfen önce bir Müşteri ID girin.");
    try {
      await api.put(`/customers/${customerId}`, registerData);
      toast.success("Hesap bilgileri güncellendi!");
    } catch {
      toast.error("Güncelleme başarısız.");
    }
  };

  // 3. Hesap Silme (SweetAlert Korumalı)
  const handleDeleteCustomer = async () => {
    if (!customerId) return toast.error("Lütfen önce bir Müşteri ID girin.");
    
    const result = await Swal.fire({
      title: 'Hesabı Sil?',
      text: "Tüm müşteri verileriniz silinecek. Onaylıyor musunuz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Evet, Sil'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/customers/${customerId}`);
        toast.success("Hesap başarıyla silindi.");
        setCustomerId('');
        setInstruments([]); // Hesap silinince ekrandaki enstrümanları da temizle
      } catch {
        toast.error("Hesap silinemedi.");
      }
    }
  };

  // 4. Enstrümanları Getir (GÜNCELLENDİ: Dizi kontrolü)
  const fetchInstruments = async () => {
    if (!customerId) return toast.error("Enstrümanları görmek için Müşteri ID gerekli.");
    try {
      const response = await api.get(`/customers/${customerId}/instruments`);
      // Backend'in veriyi döndürme şekline göre ayarlıyoruz (direkt dizi veya data.data içinde olabilir)
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setInstruments(data);
      toast.success("Enstrümanlar listelendi.");
    } catch {
      toast.error("Enstrümanlar çekilemedi.");
    }
  };

  // 5. Enstrüman Ekle
  const handleAddInstrument = async (e) => {
    e.preventDefault();
    if (!customerId) return toast.error("Önce müşteri seçmelisiniz (ID).");
    try {
      await api.post(`/customers/${customerId}/instruments`, instrumentData);
      toast.success("Yeni enstrüman eklendi!");
      setInstrumentData({ brand: '', model: '', year: '' });
      fetchInstruments();
    } catch {
      toast.error("Enstrüman eklenemedi.");
    }
  };

  // 6. Enstrüman Silme (SweetAlert Korumalı)
  const handleDeleteInstrument = async (instrumentId) => {
    const result = await Swal.fire({
      title: 'Enstrümanı Sil?',
      text: "Bu enstrümanı envanterden çıkarmak istiyor musunuz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Evet, Sil'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/instruments/${instrumentId}`);
        toast.success("Enstrüman silindi.");
        fetchInstruments();
      } catch {
        toast.error("Silme işlemi başarısız.");
      }
    }
  };

  // 7. Yapay Zeka Tavsiyesi
  const handleGetAiRecommendation = async (instrumentId) => {
    setLoading(true);
    try {
      toast.loading("Yapay Zeka analiz ediyor...", { id: 'ai-toast' });
      const response = await api.post(`/instruments/${instrumentId}/recommendations`, {
        style: 'Genel' 
      });
      toast.success("Tavsiye alındı!", { id: 'ai-toast' });
      
      // SweetAlert ile şık gösterim
      Swal.fire({
        title: '🤖 Yapay Zeka Tavsiyesi',
        text: JSON.stringify(response.data),
        icon: 'info',
        confirmButtonText: 'Anladım'
      });
    } catch {
      toast.error("Yapay Zeka sunucuya bağlanamadı!", { id: 'ai-toast' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <User size={28} color="#27ae60" /> Müşteri & Envanter Paneli
      </h2>

      {/* YENİ EKLENEN KISIM: SÜREKLİ EKRANDA DURAN AKTİF ID PANOSU */}
      {customerId && (
        <div style={{ backgroundColor: '#e8f5e9', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', border: '2px solid #4caf50', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🔑</span>
            <span style={{ fontSize: '18px', color: '#2e7d32', fontWeight: 'bold' }}>Aktif Müşteri ID:</span>
          </div>
          <span style={{ backgroundColor: '#fff', padding: '8px 15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '18px', fontWeight: 'bold', userSelect: 'all', letterSpacing: '1px' }}>
            {customerId}
          </span>
        </div>
      )}

      {/* GEÇİCİ ID GİRİŞ ALANI */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Settings size={16} /> <i>Sistemi test etmek için işlem yapılacak Müşteri ID'sini girin:</i>
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Müşteri ID..." value={customerId} onChange={e => setCustomerId(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: '1', maxWidth: '300px' }} />
          <button onClick={fetchInstruments} style={{ padding: '10px 15px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <RefreshCw size={16} /> Verileri Çek
          </button>
        </div>
      </div>

      {/* ÜST BÖLÜM: HESAP VE YENİ ENSTRÜMAN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* HESAP İŞLEMLERİ PANELİ */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #27ae60' }}>
          <h3 style={{ marginBottom: '15px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={24} color="#27ae60" /> Hesap İşlemleri
          </h3>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Ad Soyad" required value={registerData.name} onChange={e => setRegisterData({...registerData, name: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="email" placeholder="E-posta" required value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Şifre" required value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
              <CheckCircle size={18} /> Kayıt Ol
            </button>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <button type="button" onClick={handleUpdateCustomer} style={{ flex: 1, padding: '10px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Güncelle</button>
              <button type="button" onClick={handleDeleteCustomer} style={{ flex: 1, padding: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Hesabı Sil</button>
            </div>
          </form>
        </div>

        {/* YENİ ENSTRÜMAN EKLEME PANELİ */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #f39c12' }}>
          <h3 style={{ marginBottom: '15px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={24} color="#f39c12" /> Yeni Enstrüman Ekle
          </h3>
          <form onSubmit={handleAddInstrument} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Marka (Örn: Fender, Ibanez)" required value={instrumentData.brand} onChange={e => setInstrumentData({...instrumentData, brand: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Model (Örn: Stratocaster)" required value={instrumentData.model} onChange={e => setInstrumentData({...instrumentData, model: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="number" placeholder="Üretim Yılı (Örn: 2020)" required value={instrumentData.year} onChange={e => setInstrumentData({...instrumentData, year: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
              <Plus size={18} /> Envantere Ekle
            </button>
          </form>
        </div>

      </div>

      {/* ALT BÖLÜM: ENSTRÜMAN LİSTESİ */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #34495e' }}>
        <h3 style={{ marginBottom: '15px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Music size={24} color="#34495e" /> Benim Enstrümanlarım
        </h3>
        
        {instruments.length === 0 ? <p style={{ color: '#666' }}>Henüz eklenmiş bir enstrüman bulunmuyor.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {instruments.map(inst => (
              <div key={inst.id || inst._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #34495e', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{inst.brand} - {inst.model}</h4>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Üretim Yılı: {inst.year}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleGetAiRecommendation(inst.id || inst._id)} disabled={loading} style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} title="Akıllı Tavsiye Al">
                    <BrainCircuit size={18} /> <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Yapay Zeka</span>
                  </button>
                  <button onClick={() => handleDeleteInstrument(inst.id || inst._id)} style={{ padding: '8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Sil">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}