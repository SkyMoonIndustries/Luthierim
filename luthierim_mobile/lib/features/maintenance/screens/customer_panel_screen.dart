import 'package:flutter/material.dart';
import '../../../core/services/api_service_customer.dart';

class CustomerPanelScreen extends StatefulWidget {
  const CustomerPanelScreen({super.key});

  @override
  State<CustomerPanelScreen> createState() => _CustomerPanelScreenState();
}

class _CustomerPanelScreenState extends State<CustomerPanelScreen> {
  final CustomerApiService _apiService = CustomerApiService();

  // O an sistemde aktif olan (test edilen) müşterinin ID'si
  String? _activeCustomerId;

  // Test Alanı Controller
  final TextEditingController _testIdController = TextEditingController();

  // Hesap İşlemleri Controller'ları
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // Enstrüman Ekleme Controller'ları
  final TextEditingController _brandController = TextEditingController();
  final TextEditingController _modelController = TextEditingController();
  final TextEditingController _yearController = TextEditingController();

  @override
  void dispose() {
    _testIdController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _brandController.dispose();
    _modelController.dispose();
    _yearController.dispose();
    super.dispose();
  }

  void _showSnackBar(String message, Color color) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message), backgroundColor: color));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Müşteri & Envanter Paneli', style: TextStyle(color: Colors.green)),
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.green),
      ),
      backgroundColor: Colors.grey[100],
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildTestIdCard(),
            const SizedBox(height: 12),
            _buildAccountOperationsCard(),
            const SizedBox(height: 12),
            _buildAddInstrumentCard(),
            const SizedBox(height: 12),
            _buildMyInstrumentsCard(),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  // =========================================================
  // ÜST TEST ALANI (ID Girip Verileri Çekme)
  // =========================================================
  Widget _buildTestIdCard() {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: BorderSide(color: Colors.grey.shade300)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('⚙️ Sistemi test etmek için işlem yapılacak Müşteri ID\'sini girin:', style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: SizedBox(
                    height: 45,
                    child: TextField(
                      controller: _testIdController,
                      decoration: const InputDecoration(hintText: 'Müşteri ID...', border: OutlineInputBorder(), contentPadding: EdgeInsets.symmetric(horizontal: 12)),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: () {
                    if (_testIdController.text.trim().isNotEmpty) {
                      setState(() { _activeCustomerId = _testIdController.text.trim(); });
                      _showSnackBar('Test ID ayarlandı. Enstrümanlar getiriliyor...', Colors.blue);
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.blueGrey, foregroundColor: Colors.white, minimumSize: const Size(120, 45)),
                  icon: const Icon(Icons.sync),
                  label: const Text('Verileri Çek'),
                )
              ],
            )
          ],
        ),
      ),
    );
  }

  // =========================================================
  // 1, 2, 3. HESAP İŞLEMLERİ (Kayıt, Güncelle, Sil)
  // =========================================================
  Widget _buildAccountOperationsCard() {
    return Card(
      color: Colors.white,
      shape: const Border(top: BorderSide(color: Colors.green, width: 4)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.person_add_alt_1, color: Colors.green),
                SizedBox(width: 8),
                Text('Hesap İşlemleri', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            _buildTextField('Ad Soyad', controller: _nameController),
            const SizedBox(height: 8),
            _buildTextField('E-posta', controller: _emailController),
            const SizedBox(height: 8),
            _buildTextField('Şifre', controller: _passwordController, isPassword: true),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  try {
                    String newId = await _apiService.registerCustomer(_nameController.text, _emailController.text, _passwordController.text);
                    setState(() { 
                      _activeCustomerId = newId; 
                      _testIdController.text = newId; 
                    });
                    _showSnackBar('Kayıt Başarılı! ID: $newId', Colors.green);
                  } catch (e) { _showSnackBar(e.toString(), Colors.red); }
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
                icon: const Icon(Icons.check_circle_outline),
                label: const Text('Kayıt Ol'),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () async {
                      if (_activeCustomerId == null) return _showSnackBar('Önce Müşteri ID girin!', Colors.red);
                      try {
                        await _apiService.updateCustomer(_activeCustomerId!, _nameController.text, _emailController.text);
                        _showSnackBar('Bilgiler güncellendi!', Colors.orange);
                      } catch (e) { _showSnackBar(e.toString(), Colors.red); }
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: Colors.white),
                    child: const Text('Güncelle'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () async {
                      if (_activeCustomerId == null) return _showSnackBar('Önce Müşteri ID girin!', Colors.red);
                      try {
                        await _apiService.deleteCustomer(_activeCustomerId!);
                        setState(() { _activeCustomerId = null; _testIdController.clear(); });
                        _showSnackBar('Hesap başarıyla silindi!', Colors.red);
                      } catch (e) { _showSnackBar(e.toString(), Colors.red); }
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade400, foregroundColor: Colors.white),
                    child: const Text('Hesabı Sil'),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  // =========================================================
  // 5. YENİ ENSTRÜMAN EKLE (HAYALET HESAP BYPASS'I EKLENDİ)
  // =========================================================
  Widget _buildAddInstrumentCard() {
    return Card(
      color: Colors.white,
      shape: const Border(top: BorderSide(color: Colors.orange, width: 4)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.add, color: Colors.orange),
                SizedBox(width: 8),
                Text('Yeni Enstrüman Ekle', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            _buildTextField('Marka (Örn: Fender, Ibanez)', controller: _brandController),
            const SizedBox(height: 8),
            _buildTextField('Model (Örn: Stratocaster)', controller: _modelController),
            const SizedBox(height: 8),
            _buildTextField('Üretim Yılı (Örn: 2020)', controller: _yearController, isNumber: true),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  
                  // 🔥 HACKER ÇÖZÜMÜ: Kullanıcı ID girmemişse çaktırmadan arka planda hesap aç!
                  if (_activeCustomerId == null || _activeCustomerId!.isEmpty) {
                    _showSnackBar('Otomatik misafir hesabı oluşturuluyor, bekleyin...', Colors.blue);
                    try {
                      String autoId = await _apiService.registerCustomer(
                        "Misafir Müşteri", 
                        "misafir_${DateTime.now().millisecondsSinceEpoch}@test.com", 
                        "123"
                      );
                      setState(() {
                        _activeCustomerId = autoId;
                        _testIdController.text = autoId;
                      });
                    } catch (e) {
                      return _showSnackBar('Otomatik hesap açılamadı: $e', Colors.red);
                    }
                  }

                  // Artık kesinlikle bir ID var, direkt envantere ekle!
                  try {
                    await _apiService.addInstrument(
                      _activeCustomerId!, 
                      _brandController.text.isEmpty ? "Belirtilmedi" : _brandController.text, 
                      _modelController.text.isEmpty ? "Belirtilmedi" : _modelController.text, 
                      int.tryParse(_yearController.text) ?? 2024
                    );
                    _showSnackBar('Enstrüman Eklendi!', Colors.green);
                    _brandController.clear(); 
                    _modelController.clear(); 
                    _yearController.clear();
                    setState(() {}); // Listeyi yenile
                  } catch (e) { 
                    _showSnackBar(e.toString(), Colors.red); 
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: Colors.white),
                icon: const Icon(Icons.add),
                label: const Text('Envantere Ekle'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // =========================================================
  // 4, 6, 7. BENİM ENSTRÜMANLARIM (Listele, Düzenle, Sil)
  // =========================================================
  Widget _buildMyInstrumentsCard() {
    return Card(
      color: Colors.white,
      shape: const Border(top: BorderSide(color: Colors.blueGrey, width: 4)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.music_note, color: Colors.blueGrey),
                SizedBox(width: 8),
                Text('Benim Enstrümanlarım', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            if (_activeCustomerId == null)
              const Text('Lütfen envanteri görmek için yukarıdan Müşteri ID girin veya direkt enstrüman ekleyin.', style: TextStyle(color: Colors.grey)),
            if (_activeCustomerId != null)
              FutureBuilder<List<dynamic>>(
                future: _apiService.getCustomerInstruments(_activeCustomerId!),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
                  if (snapshot.hasError) return Text("Hata: ${snapshot.error}", style: const TextStyle(color: Colors.red));
                  if (!snapshot.hasData || snapshot.data!.isEmpty) return const Text("Henüz eklenmiş bir enstrüman bulunmuyor.");

                  return Column(
                    children: snapshot.data!.map((inst) {
                      final instId = inst['_id'];
                      return ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.music_note),
                        title: Text("${inst['brand']} ${inst['model']}"),
                        subtitle: Text("Yıl: ${inst['year']}"),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit, color: Colors.orange),
                              onPressed: () => _showEditDialog(instId, inst['brand'], inst['model'], inst['year'].toString()),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () async {
                                try {
                                  await _apiService.deleteInstrument(instId);
                                  _showSnackBar('Enstrüman silindi!', Colors.green);
                                  setState(() {});
                                } catch (e) { _showSnackBar(e.toString(), Colors.red); }
                              },
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  // --- Düzenleme Dialog Penceresi ---
  void _showEditDialog(String instId, String brand, String model, String year) {
    final bCtrl = TextEditingController(text: brand);
    final mCtrl = TextEditingController(text: model);
    final yCtrl = TextEditingController(text: year);

    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Enstrümanı Güncelle'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: bCtrl, decoration: const InputDecoration(labelText: 'Marka')),
            TextField(controller: mCtrl, decoration: const InputDecoration(labelText: 'Model')),
            TextField(controller: yCtrl, decoration: const InputDecoration(labelText: 'Yıl'), keyboardType: TextInputType.number),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('İptal')),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(dialogContext);
              try {
                await _apiService.updateInstrument(instId, bCtrl.text, mCtrl.text, int.parse(yCtrl.text));
                if (mounted) { _showSnackBar('Güncellendi!', Colors.green); setState(() {}); }
              } catch (e) { if (mounted) _showSnackBar(e.toString(), Colors.red); }
            },
            child: const Text('Kaydet'),
          )
        ],
      ),
    );
  }

  // Ortak TextField
  Widget _buildTextField(String hint, {TextEditingController? controller, bool isPassword = false, bool isNumber = false}) {
    return SizedBox(
      height: 45,
      child: TextField(
        controller: controller,
        obscureText: isPassword,
        keyboardType: isNumber ? TextInputType.number : TextInputType.text,
        decoration: InputDecoration(
          hintText: hint,
          contentPadding: const EdgeInsets.symmetric(horizontal: 12),
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }
}