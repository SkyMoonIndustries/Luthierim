import 'package:flutter/material.dart';
import 'features/maintenance/screens/customer_maintenance_screen.dart';
import 'features/maintenance/screens/customer_panel_screen.dart'; // Yeni oluşturduğumuz sayfa

void main() {
  runApp(const LuthierimApp());
}

class LuthierimApp extends StatelessWidget {
  const LuthierimApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Luthierim',
      debugShowCheckedModeBanner: false, 
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const MainSkeleton(), 
    );
  }
}

class MainSkeleton extends StatefulWidget {
  const MainSkeleton({super.key});

  @override
  State<MainSkeleton> createState() => _MainSkeletonState();
}

class _MainSkeletonState extends State<MainSkeleton> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const VitrinPage(),
    const AISearchPage(),
    const CartPage(),
    const CustomerMaintenanceScreen(), // SENİN MODÜLÜN
    const CustomerPanelScreen(),       // ARKADAŞININ YENİ TERTEMİZ MODÜLÜ
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex], 
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index; 
          });
        },
        type: BottomNavigationBarType.fixed,
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
// DUMMY SAYFALAR (Vitrin, AI, Sepet vs.)
// =====================================================================

class VitrinPage extends StatelessWidget {
  const VitrinPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('1. Vitrin Sayfası', style: TextStyle(fontSize: 24))));
  }
}

class AISearchPage extends StatelessWidget {
  const AISearchPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('2. AI ile Ara Sayfası', style: TextStyle(fontSize: 24))));
  }
}

class CartPage extends StatelessWidget {
  const CartPage({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('3. Sepetim Sayfası', style: TextStyle(fontSize: 24))));
  }
}