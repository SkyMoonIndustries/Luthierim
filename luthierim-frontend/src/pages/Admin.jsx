import { useState, useEffect } from 'react';
import { Settings, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '../api';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form verilerini tutacağımız state
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });
  
  // Güncelleme modunda mıyız kontrolü (Eğer null değilse, o id'li ürünü güncelliyoruz demektir)
  const [editingId, setEditingId] = useState(null);

  // Sayfa açıldığında ürünleri Vercel'den çek
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Ürünler çekilemedi:", error);
      setLoading(false);
    }
  };

  // Form elemanları değiştikçe state'i güncelleyen fonksiyon
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Yeni Ürün Ekleme (POST) veya 2. Ürün Güncelleme (PUT) İşlemi
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    try {
      if (editingId) {
        // Güncelleme (PUT /products/:id)
        await api.put(`/products/${editingId}`, formData);
        toast.success('Ürün başarıyla güncellendi!');
      } else {
        // Yeni Ekleme (POST /products)
        await api.post('/products', formData);
        toast.success('Yeni ürün vitrine eklendi!');
      }
      
      // İşlem bitince formu temizle ve ürünleri tekrar çek
      setFormData({ name: '', description: '', price: '', stock: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("İşlem hatası:", error);
      toast.error('İşlem sırasında bir hata oluştu.');
    }
  };

  // Düzenle butonuna basılınca formun içini o ürünün bilgileriyle doldur
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfayı en üste kaydır
  };

  // İptal Butonu
  const handleCancel = () => {
    setFormData({ name: '', description: '', price: '', stock: '' });
    setEditingId(null);
  };

// 3. Ürünü Yayından Kaldırma (DELETE) - SWEETALERT2 İLE
  const handleDelete = async (productId) => {
    // Ekrana şık bir onay kutusu çıkar
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu ürünü vitrinden kalıcı olarak sileceksiniz. Bu işlem geri alınamaz!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c', // Bizim kırmızı silme rengimiz
      cancelButtonColor: '#95a5a6',  // Gri iptal rengimiz
      confirmButtonText: 'Evet, Kalıcı Olarak Sil!',
      cancelButtonText: 'Vazgeç',
      background: '#fff',
      borderRadius: '12px'
    });

    // Eğer kullanıcı "Evet, Sil" butonuna bastıysa (isConfirmed) işlemi yap
    if (result.isConfirmed) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success("Ürün vitrinden başarıyla kaldırıldı."); // Sağ alttan çıkan şık bildirimimiz
        fetchProducts(); // Listeyi güncelle
      } catch (error) {
        console.error("Silme hatası:", error);
        toast.error("Ürün silinirken bir hata oluştu.");
      }
    }
  };

  if (loading) return <h2>⏳ Yönetim Paneli Yükleniyor...</h2>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Settings size={28} color="#2c3e50" /> Mağaza Yönetim Paneli
      </h2>

      {/* Ürün Ekleme / Güncelleme Formu */}
      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', borderTop: editingId ? '4px solid #f39c12' : '4px solid #27ae60' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          {editingId ? '✏️ Ürün Bilgilerini Güncelle' : '➕ Yeni Ürün Ekle'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="name" placeholder="Ürün Adı (Örn: Fender Gitar Teli)" value={formData.name} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <textarea name="description" placeholder="Ürün Açıklaması..." value={formData.description} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '80px' }} />
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <input type="number" name="price" placeholder="Fiyat (₺)" value={formData.price} onChange={handleChange} required style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="number" name="stock" placeholder="Stok Adedi" value={formData.stock} onChange={handleChange} required style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: editingId ? '#f39c12' : '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {editingId ? <><Save size={20} /> Güncelle</> : <><Plus size={20} /> Vitrine Ekle</>}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} style={{ padding: '12px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={20} /> İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Mevcut Ürünlerin Listesi */}
      <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Vitrindeki Ürünler</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {products.map(product => (
          <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{product.name}</h4>
              <span style={{ color: '#27ae60', fontWeight: 'bold', marginRight: '15px' }}>{product.price} ₺</span>
              <span style={{ color: '#666', fontSize: '14px' }}>Stok: {product.stock}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(product)} style={{ padding: '8px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Düzenle">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(product._id)} style={{ padding: '8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Sil">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}