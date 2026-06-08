import 'package:flutter/material.dart';
import '../../../core/services/api_service_customer.dart';

class CustomerProfileScreen extends StatefulWidget {
  final String? customerId;
  final String? customerName;
  final String? customerEmail;
  final String? customerPhone;
  final String? customerAddress;
  final VoidCallback? onLogout;

  const CustomerProfileScreen({
    super.key,
    this.customerId,
    this.customerName,
    this.customerEmail,
    this.customerPhone,
    this.customerAddress,
    this.onLogout,
  });

  @override
  State<CustomerProfileScreen> createState() => _CustomerProfileScreenState();
}

class _CustomerProfileScreenState extends State<CustomerProfileScreen> {
  final CustomerApiService _apiService = CustomerApiService();
  late TabController _tabController;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();

  // Enstrüman Form Controller'ları
  final TextEditingController _brandController = TextEditingController();
  final TextEditingController _modelController = TextEditingController();
  final TextEditingController _yearController = TextEditingController();
  final TextEditingController _typeController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  String? _selectedInstrumentId;
  bool _isEditingProfile = false;

  @override
  void initState() {
    super.initState();
    _nameController.text = widget.customerName ?? '';
    _emailController.text = widget.customerEmail ?? '';
    _phoneController.text = widget.customerPhone ?? '';
    _addressController.text = widget.customerAddress ?? '';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _brandController.dispose();
    _modelController.dispose();
    _yearController.dispose();
    _typeController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Müşteri Paneli'),
          backgroundColor: Colors.deepPurple,
          foregroundColor: Colors.white,
          bottom: const TabBar(
            indicatorColor: Colors.white,
            labelColor: Colors.white,
            unselectedLabelColor: Colors.white70,
            tabs: [
              Tab(icon: Icon(Icons.person), text: 'Profil'),
              Tab(icon: Icon(Icons.music_note), text: 'Enstrümanlar'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildProfileTab(),
            _buildInstrumentsTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            color: Colors.deepPurple.shade50,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.deepPurple,
                    child: Text(
                      (widget.customerName?.isNotEmpty ?? false)
                          ? widget.customerName!.substring(0, 1).toUpperCase()
                          : 'M',
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    widget.customerName ?? 'Müşteri',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'ID: ${widget.customerId ?? "Yükleniyor..."}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          if (!_isEditingProfile) ...[
            _buildProfileInfoCard(),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                setState(() => _isEditingProfile = true);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepPurple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              icon: const Icon(Icons.edit),
              label: const Text('Profili Düzenle'),
            ),
          ] else ...[
            _buildEditProfileForm(),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () async {
                      // Validasyon
                      if (_nameController.text.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Lütfen adınızı girin!'),
                            backgroundColor: Colors.red,
                          ),
                        );
                        return;
                      }
                      if (_emailController.text.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Lütfen e-postanızı girin!'),
                            backgroundColor: Colors.red,
                          ),
                        );
                        return;
                      }
                      if (!_emailController.text.contains('@')) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Geçerli bir e-posta adresi girin!'),
                            backgroundColor: Colors.red,
                          ),
                        );
                        return;
                      }

                      if (widget.customerId == null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Müşteri ID bulunamadı!'),
                            backgroundColor: Colors.red,
                          ),
                        );
                        return;
                      }

                      try {
                        await _apiService.updateCustomer(
                          customerId: widget.customerId!,
                          name: _nameController.text,
                          email: _emailController.text,
                          phone: _phoneController.text.isNotEmpty
                              ? _phoneController.text
                              : null,
                          address: _addressController.text.isNotEmpty
                              ? _addressController.text
                              : null,
                        );

                        if (!mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Profil başarıyla güncellendi!'),
                            backgroundColor: Colors.green,
                          ),
                        );
                        setState(() => _isEditingProfile = false);
                      } catch (e) {
                        if (!mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(e.toString()),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    icon: const Icon(Icons.save),
                    label: const Text('Kaydet'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() => _isEditingProfile = false);
                      _clearProfileForm();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    icon: const Icon(Icons.close),
                    label: const Text('İptal'),
                  ),
                ),
              ],
            ),
          ],
          const SizedBox(height: 24),
          Divider(color: Colors.grey.shade300),
          const SizedBox(height: 24),

          // Çıkış Butonu
          ElevatedButton.icon(
            onPressed: () {
              showDialog(
                context: context,
                builder: (dialogContext) => AlertDialog(
                  title: const Row(
                    children: [
                      Icon(Icons.logout, color: Colors.orange),
                      SizedBox(width: 8),
                      Text('Çıkış Yap'),
                    ],
                  ),
                  content: const Text(
                    'Hesaptan çıkış yapmak istediğinize emin misiniz?',
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(dialogContext),
                      child: const Text('Hayır'),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        foregroundColor: Colors.white,
                      ),
                      onPressed: () {
                        Navigator.pop(dialogContext);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('👋 Hoşça kalın!'),
                            backgroundColor: Colors.orange,
                          ),
                        );
                        widget.onLogout?.call();
                      },
                      child: const Text('Evet, Çıkış Yap'),
                    ),
                  ],
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
            ),
            icon: const Icon(Icons.logout),
            label: const Text('Çıkış Yap'),
          ),
          const SizedBox(height: 12),

          // Hesabı Sil Butonu
          ElevatedButton.icon(
            onPressed: () => _showDeleteAccountDialog(),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
            ),
            icon: const Icon(Icons.delete_forever),
            label: const Text('Hesabı Sil'),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileInfoCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Profil Bilgileri',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildInfoRow('Ad', _nameController.text),
            _buildInfoRow('E-posta', _emailController.text.isEmpty
                ? 'Belirtilmemiş'
                : _emailController.text),
            _buildInfoRow('Telefon', _phoneController.text.isEmpty
                ? 'Belirtilmemiş'
                : _phoneController.text),
            _buildInfoRow('Adres', _addressController.text.isEmpty
                ? 'Belirtilmemiş'
                : _addressController.text),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildEditProfileForm() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Profil Bilgilerini Düzenle',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildTextField('Ad *', _nameController),
            const SizedBox(height: 12),
            _buildTextField('E-posta *', _emailController),
            const SizedBox(height: 12),
            _buildTextField('Telefon', _phoneController),
            const SizedBox(height: 12),
            _buildTextField('Adres', _addressController, maxLines: 2),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info, color: Colors.blue, size: 20),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Ad ve E-posta zorunludur',
                      style: TextStyle(fontSize: 12, color: Colors.blue),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _clearProfileForm() {
    // Formu mevcut verilerle geri yükle (temizleme değil)
    _nameController.text = widget.customerName ?? '';
    _emailController.text = widget.customerEmail ?? '';
    _phoneController.text = widget.customerPhone ?? '';
    _addressController.text = widget.customerAddress ?? '';
  }

  void _showDeleteAccountDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning, color: Colors.red),
            SizedBox(width: 8),
            Text('Hesabı Sil'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '⚠️ Bu işlem geri alınamaz!',
                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Silme sırasında:\n'
                    '• Tüm kişisel bilgileriniz silinir\n'
                    '• Tüm enstrümanlarınız silinir\n'
                    '• Tüm bakım kayıtlarınız silinir\n'
                    '• Hesabınızı tekrar açamazsınız',
                    style: TextStyle(fontSize: 12, color: Colors.red),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Hayır, Devam Etme'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              Navigator.pop(dialogContext);

              if (widget.customerId == null || widget.customerId!.isEmpty) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('❌ Müşteri ID bulunamadı! Lütfen çıkış yapıp tekrar giriş yapın.'),
                    backgroundColor: Colors.red,
                    duration: Duration(seconds: 3),
                  ),
                );
                return;
              }

              // Loading göster
              if (!mounted) return;
              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (loadingContext) => const AlertDialog(
                  title: Text('Hesap Siliniyor...'),
                  content: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 16),
                      Text('Lütfen bekleyin...'),
                    ],
                  ),
                ),
              );

              try {
                await _apiService.deleteCustomer(widget.customerId!);

                if (!mounted) return;
                Navigator.pop(context); // Loading dialog'u kapat

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('✅ Hesabınız başarıyla silindi.'),
                    backgroundColor: Colors.green,
                    duration: Duration(seconds: 2),
                  ),
                );

                // Biraz bekle sonra logout yap
                await Future.delayed(const Duration(milliseconds: 500));
                widget.onLogout?.call();
              } catch (e) {
                if (!mounted) return;
                Navigator.pop(context); // Loading dialog'u kapat

                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('❌ Hata: ${e.toString()}'),
                    backgroundColor: Colors.red,
                    duration: const Duration(seconds: 3),
                  ),
                );
              }
            },
            child: const Text('Evet, Hesabımı Sil'),
          ),
        ],
      ),
    );
  }

  Widget _buildInstrumentsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Başlık
          Card(
            color: Colors.orange.shade50,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.music_note, color: Colors.orange.shade700, size: 28),
                      const SizedBox(width: 12),
                      const Text(
                        'Enstrüman Yönetimi',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Enstrümanlarınızı kaydederek bakım takvimini yönetebilirsiniz',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          const Text(
            'Kayıtlı Enstrümanlarım',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          FutureBuilder<List<dynamic>>(
            future: widget.customerId != null
                ? _apiService.getCustomerInstruments(widget.customerId!)
                : Future.value([]),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Padding(
                  padding: EdgeInsets.all(24.0),
                  child: Center(child: CircularProgressIndicator()),
                );
              }
              if (snapshot.hasError) {
                return Card(
                  color: Colors.red.shade50,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Icon(Icons.error_outline, color: Colors.red, size: 48),
                        const SizedBox(height: 12),
                        const Text(
                          'Enstrümanlar yüklenemedi',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          snapshot.error.toString(),
                          style: const TextStyle(color: Colors.red, fontSize: 12),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                );
              }
              if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        const Icon(Icons.music_note, size: 48, color: Colors.grey),
                        const SizedBox(height: 12),
                        const Text('Henüz enstrüman kaydınız yok.'),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () => _showAddInstrumentForm(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                          ),
                          icon: const Icon(Icons.add),
                          label: const Text('İlk Enstrümanı Ekle'),
                        ),
                      ],
                    ),
                  ),
                );
              }

              return Column(
                children: [
                  ...snapshot.data!.map((instrument) {
                    final brand = instrument['brand'] ?? 'Bilinmiyor';
                    final model = instrument['model'] ?? 'Bilinmiyor';
                    final year = instrument['year'] ?? '-';
                    final type = instrument['type'] ?? 'Gitar';
                    final instrumentId = instrument['_id'];

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: const Icon(Icons.music_note, color: Colors.deepPurple),
                        title: Text('$brand $model'),
                        subtitle: Text('Tür: $type | Yıl: $year'),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit, color: Colors.orange),
                              onPressed: () =>
                                  _showEditInstrumentForm(instrumentId, instrument),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () =>
                                  _showDeleteInstrumentDialog(instrumentId),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    onPressed: () => _showAddInstrumentForm(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    icon: const Icon(Icons.add),
                    label: const Text('Yeni Enstrüman Ekle'),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  void _showAddInstrumentForm() {
    _clearInstrumentForm();
    _selectedInstrumentId = null;

    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.add_circle, color: Colors.green),
            SizedBox(width: 8),
            Text('Yeni Enstrüman Ekle'),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Başlık
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info, color: Colors.green, size: 18),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '* İşaretli alanlar zorunludur',
                        style: TextStyle(fontSize: 12, color: Colors.green),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Marka (Zorunlu)
              const Text('Marka *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: Gibson, Fender, Ibanez', _brandController),
              const SizedBox(height: 12),

              // Model (Zorunlu)
              const Text('Model *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: Les Paul, Stratocaster', _modelController),
              const SizedBox(height: 12),

              // Yıl (Opsiyonel)
              const Text('Üretim Yılı (Opsiyonel)', style: TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: 2020', _yearController),
              const SizedBox(height: 12),

              // Tür (Opsiyonel)
              const Text('Tür (Opsiyonel)', style: TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: Elektro Gitar, Akustik, Bas', _typeController),
              const SizedBox(height: 12),

              // Notlar (Opsiyonel)
              const Text('Notlar (Opsiyonel)', style: TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: İyi durumda, orijinal kese ile', _notesController, maxLines: 2),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('İptal'),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              // Validasyon
              if (_brandController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Lütfen Marka alanını doldurun!'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }
              if (_modelController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Lütfen Model alanını doldurun!'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }

              if (widget.customerId == null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Müşteri ID bulunamadı!'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }

              Navigator.pop(dialogContext);

              try {
                await _apiService.addInstrument(
                  customerId: widget.customerId!,
                  brand: _brandController.text.trim(),
                  model: _modelController.text.trim(),
                  year: _yearController.text.isNotEmpty ? _yearController.text.trim() : null,
                  type: _typeController.text.isNotEmpty ? _typeController.text.trim() : null,
                  notes: _notesController.text.isNotEmpty ? _notesController.text.trim() : null,
                );

                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('✅ Enstrüman başarıyla eklendi!'),
                    backgroundColor: Colors.green,
                  ),
                );
                setState(() {});
              } catch (e) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('❌ Hata: ${e.toString()}'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            icon: const Icon(Icons.check),
            label: const Text('Enstrümanı Ekle'),
          ),
        ],
      ),
    );
  }

  void _showEditInstrumentForm(String instrumentId, Map<String, dynamic> instrument) {
    _clearInstrumentForm();
    _selectedInstrumentId = instrumentId;
    _brandController.text = instrument['brand'] ?? '';
    _modelController.text = instrument['model'] ?? '';
    _yearController.text = instrument['year']?.toString() ?? '';
    _typeController.text = instrument['type'] ?? '';
    _notesController.text = instrument['notes'] ?? '';

    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.edit, color: Colors.orange),
            SizedBox(width: 8),
            Text('Enstrümanı Düzenle'),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Başlık
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info, color: Colors.orange, size: 18),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '* İşaretli alanlar zorunludur',
                        style: TextStyle(fontSize: 12, color: Colors.orange),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              const Text('Marka *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: Gibson, Fender, Ibanez', _brandController),
              const SizedBox(height: 12),

              const Text('Model *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: Les Paul, Stratocaster', _modelController),
              const SizedBox(height: 12),

              const Text('Üretim Yılı (Opsiyonel)', style: TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: 2020', _yearController),
              const SizedBox(height: 12),

              const Text('Tür (Opsiyonel)', style: TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: Elektro Gitar, Akustik, Bas', _typeController),
              const SizedBox(height: 12),

              const Text('Notlar (Opsiyonel)', style: TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
              const SizedBox(height: 4),
              _buildTextField('Örn: İyi durumda, orijinal kese ile', _notesController, maxLines: 2),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('İptal'),
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              // Validasyon
              if (_brandController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Lütfen Marka alanını doldurun!'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }
              if (_modelController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Lütfen Model alanını doldurun!'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }

              Navigator.pop(dialogContext);

              try {
                await _apiService.updateInstrument(
                  instrumentId: instrumentId,
                  brand: _brandController.text.trim(),
                  model: _modelController.text.trim(),
                  year: _yearController.text.isNotEmpty ? _yearController.text.trim() : null,
                  type: _typeController.text.isNotEmpty ? _typeController.text.trim() : null,
                  notes: _notesController.text.isNotEmpty ? _notesController.text.trim() : null,
                );

                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('✅ Enstrüman başarıyla güncellendi!'),
                    backgroundColor: Colors.green,
                  ),
                );
                setState(() {});
              } catch (e) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('❌ Hata: ${e.toString()}'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            icon: const Icon(Icons.check),
            label: const Text('Güncelle'),
          ),
        ],
      ),
    );
  }

  void _showDeleteInstrumentDialog(String instrumentId) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Enstrümanı Sil'),
        content: const Text('Bu enstrümanı silmek istediğinize emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Vazgeç'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              Navigator.pop(dialogContext);

              try {
                await _apiService.deleteInstrument(instrumentId);
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Enstrüman silindi!'),
                    backgroundColor: Colors.green,
                  ),
                );
                setState(() {});
              } catch (e) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(e.toString()),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: const Text('Sil'),
          ),
        ],
      ),
    );
  }

  void _clearInstrumentForm() {
    _brandController.clear();
    _modelController.clear();
    _yearController.clear();
    _typeController.clear();
    _notesController.clear();
  }

  Widget _buildTextField(String hint, TextEditingController controller,
      {int maxLines = 1, IconData? icon}) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        hintText: hint,
        border: const OutlineInputBorder(),
        contentPadding: const EdgeInsets.all(12),
        suffixIcon: icon != null ? Icon(icon) : null,
      ),
    );
  }
}
