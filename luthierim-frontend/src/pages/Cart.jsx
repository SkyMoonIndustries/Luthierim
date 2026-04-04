import { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import api from '../api';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sayfa açıldığında sepeti Vercel'den çek (GET /cart/items)
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart/items');
      setCartItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Sepet çekilemedi:", error);
      setLoading(false);
    }
  };

  // Sepetten Ürün Çıkarma (DELETE /cart/items/:itemId)
    const removeFromCart = async (itemId) => {
        try {
         await api.delete(`/cart/items/${itemId}`);
         setCartItems(cartItems.filter(item => item._id !== itemId));
         toast.success("Ürün sepetten çıkarıldı."); // Bunu ekledik
        } catch (error) {
        console.error("Silme hatası:", error);
        toast.error("Ürün silinirken hata oluştu."); // alert yerine bunu yazdık
        }
    };

    const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Sepetiniz şu an boş!");
      return;
    }
    
    // Ekrana patlayan o şık sipariş onay kutusu
    Swal.fire({
      title: 'Siparişiniz Alındı! 🎸',
      text: 'Luthier atölyemiz ürünlerinizi özenle hazırlamaya başladı. Bizi tercih ettiğiniz için teşekkürler!',
      icon: 'success',
      confirmButtonColor: '#27ae60',
      confirmButtonText: 'Harika!',
      background: '#fff',
      borderRadius: '12px'
    });
  };

  // Sepetteki tüm ürünlerin toplam fiyatını hesaplayan akıllı fonksiyon
  const totalAmount = cartItems.reduce((total, item) => {
    // Backend'de populate yaptığımız için ürün detayları 'productId' objesinin içinde geliyor
    if(item.productId && item.productId.price) {
      return total + (item.productId.price * item.quantity);
    }
    return total;
  }, 0);

  if (loading) return <h2>⏳ Sepetiniz Yükleniyor...</h2>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShoppingBag size={28} color="#e74c3c" /> Alışveriş Sepetim
      </h2>

      {cartItems.length === 0 ? (
        /* Sepet Boşsa Gösterilecek Havalı Tasarım */
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <ShoppingBag size={64} color="#ccc" style={{ marginBottom: '15px' }} />
          <h3 style={{ color: '#666' }}>Sepetiniz şu an boş.</h3>
          <p style={{ color: '#999' }}>Hemen vitrine dönüp luthier ekipmanları eklemeye başlayabilirsiniz!</p>
        </div>
      ) : (
        /* Sepet Doluysa Ürünleri Listele */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cartItems.map(item => (
            item.productId ? (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #e74c3c' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{item.productId.name}</h3>
                  <p style={{ margin: '0', color: '#666' }}>Miktar: {item.quantity} adet</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <h2 style={{ margin: '0', color: '#2c3e50' }}>{item.productId.price * item.quantity} ₺</h2>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    style={{ padding: '10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Sepetten Çıkar"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : null
          ))}

          {/* Toplam Tutar ve Satın Alma Paneli */}
          <div style={{ marginTop: '20px', padding: '25px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#bdc3c7' }}>Ödenecek Toplam Tutar</p>
              <h1 style={{ margin: '0', fontSize: '32px' }}>{totalAmount} ₺</h1>
            </div>
            <button onClick={handleCheckout} style={{ padding: '15px 30px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={24} /> Alışverişi Tamamla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}