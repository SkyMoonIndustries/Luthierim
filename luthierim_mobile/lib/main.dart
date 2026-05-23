import 'package:flutter/material.dart';
import 'features/maintenance/screens/customer_maintenance_screen.dart';

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

  // Alt sekmelere tıklandıkça gövdede gösterilecek sayfalar
  final List<Widget> _pages = [
    const VitrinPage(),
    const AISearchPage(),
    const CartPage(),
    const CustomerMaintenanceScreen(),
    const CustomerPanelPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Seçili sayfayı gövdede göster
      body: _pages[_currentIndex], 
      
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

// SENİN ÇALIŞACAĞIN ANA SAYFA BURASI
class MaintenanceAppointmentPage extends StatelessWidget {
  const MaintenanceAppointmentPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('4. Bakım & Randevu Sistemi\n(Halil\'in Modülü)', textAlign: TextAlign.center, style: TextStyle(fontSize: 24))),
    );
  }
}

class CustomerPanelPage extends StatelessWidget {
  const CustomerPanelPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Müşteri Paneli'),
        actions: [
          // Sağ üstteki Çark İkonu
          IconButton(
            icon: const Icon(Icons.settings),
            tooltip: 'Luthier Yönetim Paneline Geç',
            onPressed: () {
              // Çarka basınca Luthier Paneline yönlendir
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const LuthierPanelPage()),
              );
            },
          )
        ],
      ),
      body: const Center(child: Text('5. Müşteri Paneli İçeriği', style: TextStyle(fontSize: 24))),
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