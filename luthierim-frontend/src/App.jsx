import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, Camera, Store, Settings } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import AiSearch from './pages/AiSearch';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* ÜST MENÜ (NAVBAR) */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '2px solid #ddd', marginBottom: '20px' }}>
          <h1 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🎸 Luthierim
          </h1>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
              <Store size={20} /> Vitrin
            </Link>
            <Link to="/ai-search" style={{ textDecoration: 'none', color: '#007bff', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
              <Camera size={20} /> Yapay Zeka ile Ara
            </Link>
            <Link to="/cart" style={{ textDecoration: 'none', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
              <ShoppingCart size={20} /> Sepetim
            </Link>
            <Link to="/admin" style={{ textDecoration: 'none', color: '#8e44ad', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
              <Settings size={20} /> Luthier Paneli
            </Link>
          </div>
        </nav>

        {/* SAYFA İÇERİKLERİ BURAYA GELECEK */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-search" element={<AiSearch />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;