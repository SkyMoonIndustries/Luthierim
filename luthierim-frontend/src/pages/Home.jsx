import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sayfa açıldığı an Vercel'deki API'ne gidip ürünleri çeker (GET /products)
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

  // Sepete Ekleme İşlemi (POST /cart/items)
const addToCart = async (productId) => {
    try {
      await api.post('/cart/items', { productId, quantity: 1 });
      toast.success("Ürün başarıyla sepete eklendi!");
    } catch (error) {
      toast.error("Sepete eklenirken bir hata oluştu.");
      console.error(error);
    }
  };

  if (loading) return <h2>⏳ Ürünler Vercel'den Yükleniyor...</h2>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Mağaza Vitrini</h2>
      
      {/* Ürünleri Izgara (Grid) Şeklinde Listeleme */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
            <p style={{ color: '#666', height: '60px', overflow: 'hidden', fontSize: '14px' }}>{product.description}</p>
            <h2 style={{ color: '#2c3e50', margin: '15px 0' }}>{product.price} ₺</h2>
            
            <p style={{ color: product.stock > 0 ? '#27ae60' : '#e74c3c', fontWeight: 'bold', marginBottom: '15px' }}>
              {product.stock > 0 ? `✅ Stokta: ${product.stock} adet` : '❌ Stokta Yok'}
            </p>
            
            <button
              onClick={() => addToCart(product._id)}
              disabled={product.stock === 0}
              style={{ 
                width: '100%', padding: '12px', 
                backgroundColor: product.stock > 0 ? '#007bff' : '#bdc3c7', 
                color: 'white', border: 'none', borderRadius: '8px', 
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                fontWeight: 'bold', transition: '0.2s'
              }}
            >
              <ShoppingCart size={18} /> Sepete Ekle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}