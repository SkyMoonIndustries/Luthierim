import { useState, useEffect } from 'react';
import { User, Music, UserPlus, Edit, Trash2, Save, X, Plus, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '../api';

export default function CustomerPanel() {

  // -- MÜŞTERİ STATE'LERİ --
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [updateData, setUpdateData] = useState({ name: '', email: '', password: '' });
  const [customerId, setCustomerId] = useState('');

  // -- ENSTRÜMAN STATE'LERİ --
  const [instruments, setInstruments] = useState([]);
  const [instrumentForm, setInstrumentForm] = useState({ brand: '', model: '', year: '', type: '' });
  const [editingInstrumentId, setEditingInstrumentId] = useState(null);

  // -- YAPAY ZEKA STATE'İ --
  const [aiResults, setAiResults] = useState({}); // { instrumentId: 'tavsiye metni' }
  const [loadingAi, setLoadingAi] = useState(null);

  // -- GENEL STATE --
  const [loading, setLoading] = useState(false);

  // customerId değişince enstrümanları çek
  useEffect(() => {
    if (customerId) fetchInstruments();
  }, [customerId]);

  // ─────────────────────────────────────────────────────────
  // GEREKSİNİM 1: Müşteri Kayıt (POST /customers/register)
  // ─────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/customers/register', registerData);
      const newId = response.data._id || response.data.customerId || response.data.id;
      setCustomerId(newId);
      toast.success(`Hesap oluşturuldu! ID: ${newId}`);
      setRegisterData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Kayıt hatası:', error);
      toast.error('Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // GEREKSİNİM 2: Müşteri Güncelleme (PUT /customers/:id)
  // ─────────────────────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!customerId) { toast.error('Lütfen önce Müşteri ID girin.'); return; }
    setLoading(true);
    try {
      await api.put(`/customers/${customerId}`, updateData);
      toast.success('Profil bilgilerin güncellendi!');
      setUpdateData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Güncelleme sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // GEREKSİNİM 3: Müşteri Silme (DELETE /customers/:id)
  // ─────────────────────────────────────────────────────────
  const handleDeleteCustomer = async () => {
    if (!customerId) { toast.error('Lütfen önce Müşteri ID girin.'); return; }
    const result = await Swal.fire({
      title: 'Hesabı silmek istediğine emin misin?',
      text: 'Bu işlem geri alınamaz! Tüm veriler kalıcı olarak silinecek.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Vazgeç',
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/customers/${customerId}`);
        toast.success('Müşteri hesabı silindi.');
        setCustomerId('');
        setInstruments([]);
      } catch (error) {
        console.error('Silme hatası:', error);
        toast.error('Silme sırasında hata oluştu.');
      }
    }
  };

  // ─────────────────────────────────────────────────────────
  // GEREKSİNİM 4: Enstrümanları Listele (GET /customers/:id/instruments)
  // ─────────────────────────────────────────────────────────
  const fetchInstruments = async () => {
    try {
      const response = await api.get(`/customers/${customerId}/instruments`);
      setInstruments(response.data);
    } catch (error) {
      console.error('Enstrümanlar çekilemedi:', error);
    }
  };

  // ─────────────────────────────────────────────────────────
  // GEREKSİNİM 5 & 6: Enstrüman Ekle / Güncelle
  // POST /customers/:id/instruments | PUT /instruments/:id
  // ─────────────────────────────────────────────────────────
  const handleInstrumentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInstrumentId) {
        await api.put(`/instruments/${editingInstrumentId}`, instrumentForm);
        toast.success('Enstrüman bilgileri güncellendi!');
      } else {
        await api.post(`/customers/${customerId}/instruments`, instrumentForm);
        toast.success('Enstrüman profiline eklendi! 🎵');
      }
      setInstrumentForm({ brand: '', model: '', year: '', type: '' });
      setEditingInstrumentId(null);
      fetchInstruments();
    } catch (error) {
      console.error('Enstrüman hatası:', error);
      toast.error('İşlem sırasında hata oluştu.');
    }
  };

  const handleEditInstrument = (inst) => {
    setInstrumentForm({ brand: inst.brand || '', model: inst.model || '', year: inst.year || '', type: inst.type || '' });
    setEditingInstrumentId(inst._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─────────────────────────────────────────────────────────
  // GEREKSİNİM 7: Enstrüman Sil (DELETE /instruments/:id)
  // ─────────────────────────────────────────────────────────
  const handleDeleteInstrument = async (id) => {
    const result = await Swal.fire({
      title: 'Enstrümanı silmek istediğine emin misin?',
      text: 'Bu enstrümana ait tüm kayıtlar silinecek!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Vazgeç',
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/instruments/${id}`);
        toast.success('Enstrüman silindi.');
        fetchInstruments();
      } catch (error) {
        console.error('Silme hatası:', error);
        toast.error('Enstrüman silinirken hata oluştu.');
      }
    }
  };

  // ─────────────────────────────────────────────────────────
  // GEREKSİNİM 8: AI Tavsiye (POST /instruments/:id/recommendations)
  // ─────────────────────────────────────────────────────────
  const handleRecommendation = async (id) => {
    if (aiResults[id]) {
      setAiResults(prev => { const u = { ...prev }; delete u[id]; return u; });
      return;
    }
    setLoadingAi(id);
    try {
      const response = await api.post(`/instruments/${id}/recommendations`, { musicGenre: 'Rock', favoriteArtists: ['Metallica'], playStyle: 'Heavy' });
      const text = response.data.ai_recommendations || response.data.recommendation || response.data.message || JSON.stringify(response.data);
      setAiResults(prev => ({ ...prev, [id]: text }));
      toast.success('Yapay Zeka analizi tamamlandı!');
    } catch (error) {
      console.error('AI hatası:', error);
      toast.error('Tavsiye alınırken hata oluştu.');
    } finally {
      setLoadingAi(null);
    }
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <User size={28} color="#2c3e50" /> Müşteri Paneli
      </h2>

      {/* ── ÜST GRID: KAYIT + GÜNCELLEME/SİLME ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '20px' }}>

        {/* GEREKSİNİM 1: Kayıt */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #007bff' }}>
          <h3 style={{ marginBottom: '15px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={22} color="#007bff" /> Yeni Müşteri Kaydı
          </h3>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Ad Soyad" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="email" placeholder="E-posta" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Şifre" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: loading ? '#bdc3c7' : '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
              <UserPlus size={18} /> {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
            </button>
          </form>
          {customerId && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '6px', fontSize: '13px', color: '#155724' }}>
              ✅ Aktif Müşteri ID: <strong>{customerId}</strong>
            </div>
          )}
        </div>

        {/* GEREKSİNİM 2 & 3: Güncelleme + Silme */}
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #f39c12' }}>
          <h3 style={{ marginBottom: '15px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit size={22} color="#f39c12" /> Profil Güncelle / Hesap Sil
          </h3>
          <input type="text" placeholder="Müşteri ID" value={customerId} onChange={e => setCustomerId(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '2px solid #f39c12', width: '100%', marginBottom: '12px', fontWeight: 'bold', boxSizing: 'border-box' }} />
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Yeni Ad Soyad" value={updateData.name} onChange={e => setUpdateData({ ...updateData, name: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="email" placeholder="Yeni E-posta" value={updateData.email} onChange={e => setUpdateData({ ...updateData, email: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Yeni Şifre (boş bırakılabilir)" value={updateData.password} onChange={e => setUpdateData({ ...updateData, password: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', backgroundColor: loading ? '#bdc3c7' : '#f39c12', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Save size={18} /> Güncelle
              </button>
              <button type="button" onClick={handleDeleteCustomer} style={{ flex: 1, padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={18} /> Hesabı Sil
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── ENSTRÜMAN BÖLÜMÜ ── */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '4px solid #8e44ad' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={22} color="#8e44ad" /> Enstrümanlarım
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="text" placeholder="Müşteri ID ile listele" value={customerId} onChange={e => setCustomerId(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '200px' }} />
            <button onClick={fetchInstruments} style={{ padding: '8px 14px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Listele
            </button>
          </div>
        </div>

        {/* GEREKSİNİM 5 & 6: Enstrüman Ekleme / Güncelleme Formu */}
        <div style={{ backgroundColor: '#f9f3ff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px dashed #8e44ad' }}>
          <h4 style={{ marginBottom: '12px', color: '#8e44ad' }}>
            {editingInstrumentId ? '✏️ Enstrümanı Güncelle' : '🎸 Yeni Enstrüman Ekle'}
          </h4>
          <form onSubmit={handleInstrumentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Marka (Örn: Fender)" value={instrumentForm.brand} onChange={e => setInstrumentForm({ ...instrumentForm, brand: e.target.value })} required style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Model (Örn: Stratocaster)" value={instrumentForm.model} onChange={e => setInstrumentForm({ ...instrumentForm, model: e.target.value })} required style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="number" placeholder="Üretim Yılı" value={instrumentForm.year} onChange={e => setInstrumentForm({ ...instrumentForm, year: e.target.value })} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Tür (Örn: Elektro Gitar)" value={instrumentForm.type} onChange={e => setInstrumentForm({ ...instrumentForm, type: e.target.value })} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: editingInstrumentId ? '#f39c12' : '#8e44ad', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                {editingInstrumentId ? <><Save size={18} /> Güncelle</> : <><Plus size={18} /> Ekle</>}
              </button>
              {editingInstrumentId && (
                <button type="button" onClick={() => { setEditingInstrumentId(null); setInstrumentForm({ brand: '', model: '', year: '', type: '' }); }} style={{ padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <X size={18} /> İptal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* GEREKSİNİM 4: Enstrüman Listesi */}
        {instruments.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Henüz enstrüman eklenmedi veya Müşteri ID girilmedi.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {instruments.map(inst => (
              <div key={inst._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #8e44ad', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#333' }}>🎸 {inst.brand} {inst.model}</h4>
                    <span style={{ color: '#666', fontSize: '13px' }}>
                      {inst.type && `${inst.type}`}{inst.year && ` • ${inst.year}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* GEREKSİNİM 8: AI Tavsiye */}
                    <button onClick={() => handleRecommendation(inst._id)} disabled={loadingAi === inst._id} title="Yapay Zeka Tavsiyesi" style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '13px' }}>
                      <Cpu size={16} /> {loadingAi === inst._id ? 'Analiz...' : aiResults[inst._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {/* GEREKSİNİM 6: Düzenle */}
                    <button onClick={() => handleEditInstrument(inst)} title="Düzenle" style={{ padding: '8px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      <Edit size={18} />
                    </button>
                    {/* GEREKSİNİM 7: Sil */}
                    <button onClick={() => handleDeleteInstrument(inst._id)} title="Sil" style={{ padding: '8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* GEREKSİNİM 8: AI Tavsiye Sonucu */}
                {aiResults[inst._id] && (
                  <div style={{ padding: '15px', backgroundColor: '#f0f8ff', color: '#004085', borderLeft: '4px solid #007bff', borderRadius: '0 0 8px 8px', fontSize: '14px', lineHeight: '1.5' }}>
                    <strong>Yapay Zeka Tavsiyesi:</strong><br />{aiResults[inst._id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}