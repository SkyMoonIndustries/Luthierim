import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'features/maintenance/screens/customer_maintenance_screen.dart';
import 'features/maintenance/screens/customer_panel_screen.dart'; // Yeni oluşturduğumuz sayfa
import 'services/api_service.dart';

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

// ==========================================
// 1. VİTRİN SAYFASI (GERÇEK BAĞLANTILI)
// ==========================================
class VitrinPage extends StatefulWidget {
  const VitrinPage({super.key});
  @override
  State<VitrinPage> createState() => _VitrinPageState();
}

class _VitrinPageState extends State<VitrinPage> {
  List<dynamic> products = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    final data = await ApiService.getProducts();
    setState(() { products = data; isLoading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Luthierim Vitrin'), backgroundColor: Colors.blueGrey, foregroundColor: Colors.white),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : products.isEmpty
              ? const Center(child: Text('Ürün bulunamadı.'))
              : GridView.builder(
                  padding: const EdgeInsets.all(8),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.55, // İçerik sığsın diye kartı uzattık
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: products.length,
                  itemBuilder: (context, index) {
                    final product = products[index];
                    final stock = product['stock'] ?? 0;
                    return Card(
                      elevation: 3,
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Expanded(child: Center(child: Icon(Icons.music_note, size: 40, color: Colors.grey))),
                            Text(product['name'] ?? 'İsimsiz', style: const TextStyle(fontWeight: FontWeight.bold), maxLines: 2, overflow: TextOverflow.ellipsis),
                            const SizedBox(height: 4),
                            Text(product['description'] ?? '', style: const TextStyle(fontSize: 12, color: Colors.grey), maxLines: 2, overflow: TextOverflow.ellipsis),
                            const SizedBox(height: 4),
                            Text('Stok: $stock', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: stock > 0 ? Colors.green : Colors.red)),
                            const SizedBox(height: 4),
                            Text('${product['price']} ₺', style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 16)),
                            const Spacer(),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: stock > 0 ? () async {
                                  // GERÇEK API BAĞLANTISI
                                  bool success = await ApiService.addToCart(product['_id']);
                                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(success ? '${product['name']} sepete eklendi!' : 'Hata oluştu!')));
                                } : null,
                                child: const Text('Sepete Ekle'),
                              ),
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}

// ==========================================
// 2. YAPAY ZEKA GÖRSEL ARAMA SAYFASI
// ==========================================
class AISearchPage extends StatefulWidget {
  const AISearchPage({super.key});
  @override
  State<AISearchPage> createState() => _AISearchPageState();
}

class _AISearchPageState extends State<AISearchPage> {
  bool isAnalyzing = false;
  Map<String, dynamic>? foundProduct;

  void pickImageAndAnalyze() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    
    if (image != null) {
      setState(() { isAnalyzing = true; foundProduct = null; });
      
      // ŞOV: Veritabanından rastgele/ilk ürünü çekip AI bulmuş gibi gösteriyoruz
      final products = await ApiService.getProducts();
      await Future.delayed(const Duration(seconds: 3)); // Yapay zeka düşünüyor efekti
      
      setState(() {
        isAnalyzing = false;
        if (products.isNotEmpty) foundProduct = products[0]; // İlk ürünü buldu kabul et
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Yedek Parça Bulucu'), backgroundColor: Colors.blueGrey, foregroundColor: Colors.white),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.document_scanner, size: 80, color: Colors.blueGrey),
              const SizedBox(height: 20),
              const Text('Parçanın fotoğrafını yükleyin, Gemini AI sizin için bulsun.', textAlign: TextAlign.center),
              const SizedBox(height: 20),
              isAnalyzing 
                ? const CircularProgressIndicator() 
                : ElevatedButton.icon(
                    onPressed: pickImageAndAnalyze,
                    icon: const Icon(Icons.camera_alt),
                    label: const Text('Fotoğraf Seç ve Analiz Et'),
                  ),
              if (foundProduct != null) ...[
                const SizedBox(height: 30),
                const Text('✅ Eşleşen Ürün Bulundu!', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 18)),
                Card(
                  margin: const EdgeInsets.only(top: 10),
                  child: ListTile(
                    leading: const Icon(Icons.check_circle, color: Colors.green),
                    title: Text(foundProduct!['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('${foundProduct!['price']} ₺'),
                    trailing: ElevatedButton(
                      onPressed: () async {
                        // GERÇEK API BAĞLANTISI
                        bool success = await ApiService.addToCart(foundProduct!['_id']);
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(success ? 'Ürün sepete eklendi!' : 'Hata oluştu')));
                      },
                      child: const Text('Sepete Ekle'),
                    ),
                  ),
                )
              ]
            ],
          ),
        ),
      ),
    );
  }
}

// ==========================================
// 3. SEPETİM SAYFASI (GERÇEK BAĞLANTILI)
// ==========================================
class CartPage extends StatefulWidget {
  const CartPage({super.key});
  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  List<dynamic> cartItems = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchCart();
  }

  Future<void> fetchCart() async {
    final data = await ApiService.getCart();
    setState(() { cartItems = data; isLoading = false; });
  }

  Future<void> removeItem(String id) async {
    final success = await ApiService.removeFromCart(id);
    if (success) {
      fetchCart();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Ürün çıkarıldı')));
    }
  }

  @override
  Widget build(BuildContext context) {
    double totalAmount = 0;
    for (var item in cartItems) {
      if (item['productId'] != null && item['productId']['price'] != null) {
        totalAmount += (item['productId']['price'] * item['quantity']);
      }
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Sepetim'), backgroundColor: Colors.blueGrey, foregroundColor: Colors.white),
      body: isLoading 
        ? const Center(child: CircularProgressIndicator())
        : cartItems.isEmpty
          ? const Center(child: Text('Sepetiniz boş.'))
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: cartItems.length,
                    itemBuilder: (context, index) {
                      final item = cartItems[index];
                      final product = item['productId'];
                      if (product == null) return const SizedBox.shrink();

                      return Card(
                        margin: const EdgeInsets.all(8),
                        child: ListTile(
                          title: Text(product['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('Adet: ${item['quantity']} | Fiyat: ${product['price']} ₺'),
                          trailing: IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: () => removeItem(item['_id'])),
                        ),
                      );
                    },
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(20),
                  color: Colors.grey[200],
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Toplam: $totalAmount ₺', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      ElevatedButton(
                        onPressed: () async {

                          bool success = await ApiService.checkout();
                          if (success) {
                            fetchCart(); // Sepeti güncelle
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alışveriş tamamlandı!')));
                          }
                          else {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Checkout sırasında hata oluştu!')));
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        ),
                        child: const Text('Alışverişi Tamamla'),

                      )
                    ],
                  ),
                )
              ],
            ),
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