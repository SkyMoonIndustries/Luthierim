import 'package:flutter/material.dart';
import 'features/maintenance/screens/customer_maintenance_screen.dart';
import 'features/auth/screens/registration_screen.dart';
import 'features/auth/screens/login_screen.dart';
import 'features/auth/screens/customer_profile_screen.dart';

void main() {
  runApp(const LuthierimApp());
}

class LuthierimApp extends StatelessWidget {
  const LuthierimApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Luthierim',
      debugShowCheckedModeBanner: false, // Sağ üstteki debug yazısını kaldırır
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const MainSkeleton(), // Uygulamanın ana iskeleti
    );
  }
}

// --- ALT SEKMELERİ YÖNETECEK ANA MERKEZ ---
class MainSkeleton extends StatefulWidget {
  const MainSkeleton({super.key});

  @override
  State<MainSkeleton> createState() => _MainSkeletonState();
}

class _MainSkeletonState extends State<MainSkeleton> {
  int _currentIndex = 0;

  // Global login state
  bool _isLoggedIn = false;
  String? _customerId;
  String? _customerName;
  String? _customerEmail;
  String? _customerPhone;
  String? _customerAddress;

  // Alt sekmelere tıklandıkça gövdede gösterilecek sayfalar
  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _initializePages();
  }

  void _initializePages() {
    _pages = [
      const VitrinPage(),
      const AISearchPage(),
      const CartPage(),
      const CustomerMaintenanceScreen(),
      const SizedBox(), // Customer panel built dynamically
    ];
  }

  Widget _buildCustomerPanel() {
    if (!_isLoggedIn) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Müşteri Paneli'),
          backgroundColor: Colors.deepPurple,
        ),
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.person, size: 64, color: Colors.deepPurple.shade200),
                const SizedBox(height: 24),
                const Text('Hoş Geldiniz!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                const Text('Luthierim platformuna erişmek için giriş yapın veya hesap oluşturun.',
                    textAlign: TextAlign.center, style: TextStyle(color: Colors.grey, fontSize: 14)),
                const SizedBox(height: 32),
                ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => RegistrationScreen(
                          onRegistrationSuccess: (userData) {
                            setState(() {
                              _isLoggedIn = true;
                              _customerName = userData['name'] ?? '';
                              _customerEmail = userData['email'] ?? '';
                              _customerPhone = userData['phone'] ?? '';
                              _customerAddress = userData['address'] ?? '';
                              _customerId = userData['customerId']; // Gerçek ID'yi kullan
                            });
                          },
                        ),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.deepPurple, foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12)),
                  icon: const Icon(Icons.person_add),
                  label: const Text('Yeni Hesap Oluştur', style: TextStyle(fontSize: 16)),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (dialogContext) => AlertDialog(
                        title: const Row(
                          children: [
                            Icon(Icons.info, color: Colors.blue),
                            SizedBox(width: 8),
                            Text('Mevcut Hesap ile Giriş'),
                          ],
                        ),
                        content: const Text(
                          'Login sistemi henüz bulunmuyor.\n\n'
                          'Giriş yapmak için:\n'
                          '• Uygulamayı kapat ve tekrar aç\n'
                          '• "Yeni Hesap Oluştur"dan kayıt ol\n'
                          '• Veya tarayıcıdan web sürümü kullan\n\n'
                          'NOT: Backend\'de login endpoint\'i oluşturulduktan sonra bu özellik aktif olacaktır.',
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(dialogContext),
                            child: const Text('Anladım'),
                          ),
                        ],
                      ),
                    );
                  },
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: Colors.deepPurple),
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12)),
                  icon: const Icon(Icons.login, color: Colors.deepPurple),
                  label: const Text('Mevcut Hesapla Giriş Yap', style: TextStyle(fontSize: 16, color: Colors.deepPurple)),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return CustomerProfileScreen(
      customerId: _customerId,
      customerName: _customerName,
      customerEmail: _customerEmail,
      customerPhone: _customerPhone,
      customerAddress: _customerAddress,
      onLogout: () {
        setState(() {
          _isLoggedIn = false;
          _customerId = null;
          _customerName = null;
          _customerEmail = null;
          _customerPhone = null;
          _customerAddress = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Hesaptan çıkış yapıldı.'), backgroundColor: Colors.blue));
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Seçili sayfayı gövdede göster
      body: _currentIndex == 4 ? _buildCustomerPanel() : _pages[_currentIndex], 
      
      // Alt Navigasyon Çubuğu
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index; // Sekme değiştirildiğinde ekranı güncelle
          });
        },
        type: BottomNavigationBarType.fixed, // 3'ten fazla sekme olduğu için bu ayar şart
        selectedItemColor: Colors.blueAccent,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.storefront), label: 'Vitrin'),
          BottomNavigationBarItem(icon: Icon(Icons.psychology), label: 'AI ile Ara'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_cart), label: 'Sepetim'),
          BottomNavigationBarItem(icon: Icon(Icons.build), label: 'Bakım & Randevu'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Müşteri'),
        ],
      ),
    );
  }
}

// =====================================================================
// BURADAN AŞAĞISI İLERİDE HERKESİN KENDİ DOSYASINA TAŞIYACAĞI SAYFALAR
// =====================================================================

class VitrinPage extends StatelessWidget {
  const VitrinPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('1. Vitrin Sayfası', style: TextStyle(fontSize: 24))),
    );
  }
}

class AISearchPage extends StatelessWidget {
  const AISearchPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('2. AI ile Ara Sayfası', style: TextStyle(fontSize: 24))),
    );
  }
}

class CartPage extends StatelessWidget {
  const CartPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('3. Sepetim Sayfası', style: TextStyle(fontSize: 24))),
    );
  }
}


class LuthierPanelPage extends StatelessWidget {
  const LuthierPanelPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Luthier Paneli'),
        backgroundColor: Colors.blueGrey,
        foregroundColor: Colors.white,
      ),
      body: const Center(child: Text('6. Luthier Yönetim Paneli', style: TextStyle(fontSize: 24))),
    );
  }
}