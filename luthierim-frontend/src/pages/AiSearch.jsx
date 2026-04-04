import { useState } from 'react';
import { Upload, Search, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function AiSearch() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null); // Yüklenen fotoğrafın önizlemesi
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [aiMessage, setAiMessage] = useState('');

  // Kullanıcı bilgisayardan dosya seçtiğinde çalışır
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Ekranda göstermek için geçici link
      setResults([]); // Yeni resim seçilince eski sonuçları temizle
      setAiMessage('');
    }
  };

  // Yapay Zekaya Gönderme İşlemi (POST /products/search/image)
  const handleSearch = async () => {
    if (!selectedFile) {
      toast.error("Lütfen önce bir fotoğraf seçin!");
      return;
    }

    setLoading(true);
    // Fotoğrafı sunucuya gönderebilmek için FormData kullanmalıyız
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // multipart/form-data başlığı ile Vercel'e yolluyoruz
      const response = await api.post('/products/search/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setAiMessage(response.data.message);
      setResults(response.data.results);
    } catch (error) {
      console.error("AI Arama Hatası:", error);
      toast.error("Lütfen önce bir fotoğraf seçin!");
    } finally {
      setLoading(false);
    }
  };

  // Sepete Ekleme (Vitrin sayfasındakiyle aynı mantık)
  const addToCart = async (productId) => {
    try {
      await api.post('/cart/items', { productId, quantity: 1 });
      toast.success('Ürün sepete eklendi!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '10px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ImageIcon size={28} color="#007bff" /> Görselden Yedek Parça Bul
      </h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Aradığınız gitar parçasının fotoğrafını yükleyin, yapay zekamız mağazamızdaki en benzer ürünleri bulsun.</p>

      {/* Fotoğraf Yükleme ve Arama Alanı */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        
        {/* Gizli dosya seçici ve özel buton tasarımı */}
        <input 
          type="file" 
          id="fileInput" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', border: '2px dashed #007bff', borderRadius: '12px', width: '100%', maxWidth: '400px', backgroundColor: '#f0f8ff' }}>
          {preview ? (
            <img src={preview} alt="Önizleme" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
          ) : (
            <>
              <Upload size={48} color="#007bff" style={{ marginBottom: '10px' }} />
              <span style={{ color: '#007bff', fontWeight: 'bold' }}>Fotoğraf Seçmek İçin Tıklayın</span>
            </>
          )}
        </label>

        {/* Yapay Zeka Arama Butonu */}
        <button 
          onClick={handleSearch} 
          disabled={!selectedFile || loading}
          style={{ padding: '15px 30px', backgroundColor: loading ? '#bdc3c7' : '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loading || !selectedFile ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '400px', justifyContent: 'center' }}
        >
          {loading ? '🤖 Yapay Zeka Analiz Ediyor...' : <><Search size={20} /> Benzer Ürünleri Bul</>}
        </button>
      </div>

      {/* Yapay Zeka Mesajı */}
      {aiMessage && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold', border: '1px solid #c3e6cb' }}>
          {aiMessage}
        </div>
      )}

      {/* Sonuçları Listeleme Alanı */}
      {results.length > 0 && (
        <>
          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Bulunan Eşleşmeler</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {results.map(product => (
              <div key={product._id} style={{ border: '2px solid #28a745', padding: '20px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
                <h2 style={{ color: '#2c3e50', margin: '15px 0' }}>{product.price} ₺</h2>
                <button
                  onClick={() => addToCart(product._id)}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                >
                  <ShoppingCart size={18} /> Sepete Ekle
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Resim seçilip arama yapıldı ama sonuç bulunamadıysa */}
      {aiMessage && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666', backgroundColor: '#fff', borderRadius: '12px' }}>
          Yüklediğiniz fotoğrafa uygun bir parça envanterimizde bulunamadı.
        </div>
      )}
    </div>
  );
}