import 'package:flutter/material.dart';
import '../../../core/services/api_service_maintenance_appointment.dart'; 

class CustomerMaintenanceScreen extends StatefulWidget {
  const CustomerMaintenanceScreen({super.key});

  @override
  State<CustomerMaintenanceScreen> createState() => _CustomerMaintenanceScreenState();
}

class _CustomerMaintenanceScreenState extends State<CustomerMaintenanceScreen> {
  final MaintenanceApiService _apiService = MaintenanceApiService();
  
  // Luthier ve Randevu Formu Controller'ları
  final TextEditingController _luthierNoteController = TextEditingController();
  final TextEditingController _appointmentDateController = TextEditingController();
  final TextEditingController _appointmentNotesController = TextEditingController();
  
  // Yapay Zeka Formu Controller'ları
  final TextEditingController _freqController = TextEditingController();
  final TextEditingController _sweatController = TextEditingController();
  final TextEditingController _envController = TextEditingController();
  
  String? _selectedRecordId;

  @override
  void dispose() {
    _luthierNoteController.dispose();
    _appointmentDateController.dispose();
    _appointmentNotesController.dispose();
    _freqController.dispose();
    _sweatController.dispose();
    _envController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enstrüman Bakım Merkezi', style: TextStyle(color: Colors.deepPurple)),
        backgroundColor: Colors.white,
        elevation: 1,
        centerTitle: false,
        iconTheme: const IconThemeData(color: Colors.deepPurple),
      ),
      backgroundColor: Colors.grey[100],
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildAIPredictionCard(),
            const SizedBox(height: 12),
            _buildNewAppointmentCard(),
            const SizedBox(height: 12),
            _buildActiveAppointmentsCard(),
            const SizedBox(height: 12),
            _buildCompletedMaintenanceCard(),
            const SizedBox(height: 12),
            _buildLuthierPanelCard(),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  // ====================================================================
  // 1. YAPAY ZEKA KARTI
  // ====================================================================
  Widget _buildAIPredictionCard() {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: BorderSide(color: Colors.blue.shade200, width: 1)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.psychology, color: Colors.blue),
                SizedBox(width: 8),
                Text('Akıllı Bakım Tahmini', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 8),
            const Text('Çalma alışkanlıklarınızı girin, yapay zeka bir sonraki bakım zamanınızı söylesin.', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 12),
            _buildTextField('Çalma Sıklığı (Örn: Haftada 5 saat)', controller: _freqController),
            const SizedBox(height: 8),
            _buildTextField('Terleme Profil (Örn: Normal)', controller: _sweatController),
            const SizedBox(height: 8),
            _buildTextField('Çevre/Nem (Örn: Standart)', controller: _envController),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  showDialog(
                    context: context,
                    barrierDismissible: false,
                    builder: (context) => const Center(child: CircularProgressIndicator()),
                  );

                  try {
                    String result = await _apiService.predictMaintenance(
                      _freqController.text.isEmpty ? "Haftada 5 saat" : _freqController.text,
                      _sweatController.text.isEmpty ? "Normal" : _sweatController.text,
                      _envController.text.isEmpty ? "Standart" : _envController.text,
                    );

                    Navigator.pop(context); 

                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Row(
                          children: [
                            Icon(Icons.auto_awesome, color: Colors.deepPurple),
                            SizedBox(width: 8),
                            Text("AI Analiz Sonucu", style: TextStyle(fontSize: 18)),
                          ],
                        ),
                        content: Text(result),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Tamam"))
                        ],
                      ),
                    );
                  } catch (e) {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("AI Hatası: $e"), backgroundColor: Colors.red));
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.blueAccent, foregroundColor: Colors.white),
                icon: const Icon(Icons.auto_awesome),
                label: const Text('Tahmin Et'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ====================================================================
  // 2. YENİ RANDEVU AL KARTI (AKILLI TAKVİM ENTEGRE EDİLDİ)
  // ====================================================================
  Widget _buildNewAppointmentCard() {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: BorderSide(color: Colors.green.shade200, width: 1)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.calendar_today, color: Colors.green),
                SizedBox(width: 8),
                Text('Yeni Randevu Al', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            
            // DÜZELTİLEN YER: Artık elle yazılmıyor, tıklanınca takvim ve saati açıyor
            TextField(
              controller: _appointmentDateController,
              readOnly: true, // Klavyenin açılmasını engeller
              onTap: () async {
                // Önce Günü Seçtir
                final DateTime? pickedDate = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now().add(const Duration(days: 1)),
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 60)),
                );

                if (pickedDate != null && context.mounted) {
                  // Sonra Saati Seçtir
                  final TimeOfDay? pickedTime = await showTimePicker(
                    context: context,
                    initialTime: const TimeOfDay(hour: 10, minute: 0),
                  );

                  if (pickedTime != null) {
                    // Tarih ve Saati birleştirip asıl backend formatına (ISO-8601) çeviriyoruz
                    final DateTime finalDateTime = DateTime(
                      pickedDate.year, pickedDate.month, pickedDate.day, 
                      pickedTime.hour, pickedTime.minute
                    );
                    
                    setState(() {
                      _appointmentDateController.text = finalDateTime.toUtc().toIso8601String();
                    });
                  }
                }
              },
              decoration: const InputDecoration(
                hintText: 'Tarih ve Saat Seçmek İçin Tıklayın',
                contentPadding: EdgeInsets.symmetric(horizontal: 12),
                border: OutlineInputBorder(),
                suffixIcon: Icon(Icons.calendar_month, size: 20, color: Colors.green),
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _appointmentNotesController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'Şikayetiniz veya Notlar (Örn: Teller çok yüksek)',
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.all(12),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  if (_appointmentDateController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lütfen bir randevu tarihi seçin!'), backgroundColor: Colors.red));
                    return;
                  }
                  try {
                    await _apiService.createAppointment(_appointmentDateController.text, _appointmentNotesController.text);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Randevu Başarıyla Oluşturuldu!'), backgroundColor: Colors.green));
                    _appointmentDateController.clear();
                    _appointmentNotesController.clear();
                    setState(() {}); 
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString()), backgroundColor: Colors.red));
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
                icon: const Icon(Icons.check_circle_outline),
                label: const Text('Randevuyu Onayla'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ====================================================================
  // 3. AKTİF RANDEVULAR KARTI
  // ====================================================================
  Widget _buildActiveAppointmentsCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 4, vertical: 8),
          child: Row(
            children: [
              Icon(Icons.event_note, color: Colors.deepOrange),
              SizedBox(width: 8),
              Text('Aktif Randevular', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        FutureBuilder<List<dynamic>>(
          future: _apiService.getActiveAppointments(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
            if (snapshot.hasError) return Text("HATA: ${snapshot.error}", style: const TextStyle(color: Colors.red));
            if (!snapshot.hasData || snapshot.data!.isEmpty) return const Text("Şu an aktif bir randevunuz bulunmuyor.");

            return Column(
              children: snapshot.data!.map((app) {
                final rawDate = app['date']?.toString() ?? '';
                String formattedDate = 'Tarih Belirsiz';
                if (rawDate.isNotEmpty) {
                  try {
                    final DateTime dt = DateTime.parse(rawDate).toLocal();
                    formattedDate = "${dt.day.toString().padLeft(2,'0')}.${dt.month.toString().padLeft(2,'0')}.${dt.year} ${dt.hour.toString().padLeft(2,'0')}:${dt.minute.toString().padLeft(2,'0')}";
                  } catch (e) { formattedDate = rawDate; }
                }
                
                final notes = app['notes'] ?? "Not girilmemiş";
                final appId = app['_id']; 

                return Card(
                  color: Colors.white,
                  shape: const Border(left: BorderSide(color: Colors.deepOrange, width: 4)),
                  child: ListTile(
                    title: Text(formattedDate, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Not: $notes'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.access_time, color: Colors.orange), 
                          onPressed: () => _handlePostponeAppointment(appId)
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red), 
                          onPressed: () => _handleCancelAppointment(appId)
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }

void _handleCancelAppointment(String appointmentId) {
    showDialog(
      context: context,
      // BURAYA DİKKAT: Ana sayfanın context'i ile karışmasın diye adını dialogContext yaptık
      builder: (dialogContext) => AlertDialog(
        title: const Text("Randevuyu İptal Et"),
        content: const Text("Bu randevuyu iptal etmek istediğinize emin misiniz?"),
        actions: [
          // Kapatırken de dialogContext'i kullanıyoruz
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text("Vazgeç")),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            onPressed: () async {
              Navigator.pop(dialogContext); // Önce onay kutusunu kapat
              
              try {
                // Backend'e silme isteğini at (Asenkron bekleme)
                await _apiService.cancelAppointment(appointmentId);
                
                // GÜVENLİK KİLİDİ: Eğer işlem bitene kadar kullanıcı ana sayfadan çıkmadıysa (mounted) devam et
                if (!mounted) return;
                
                // Artık ana sayfanın güvenli 'context'ini kullanarak mesajı gösterebiliriz
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Randevu iptal edildi!'), backgroundColor: Colors.green)
                );
                setState(() {}); // Listeyi yenile
              } catch (e) {
                if (!mounted) return; // Hata durumunda da güvenlik kilidi şart
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(e.toString()), backgroundColor: Colors.red)
                );
              }
            },
            child: const Text("İptal Et"),
          ),
        ],
      ),
    );
  }

  void _handlePostponeAppointment(String appointmentId) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 60)),
    );

    if (pickedDate != null && context.mounted) {
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: const TimeOfDay(hour: 10, minute: 0),
      );

      if (pickedTime != null) {
        final DateTime finalDateTime = DateTime(
          pickedDate.year, pickedDate.month, pickedDate.day, 
          pickedTime.hour, pickedTime.minute
        );
        final String formattedNewDate = finalDateTime.toUtc().toIso8601String();

        try {
          await _apiService.postponeAppointment(appointmentId, formattedNewDate);
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Randevu başarıyla ertelendi!'), backgroundColor: Colors.green));
            setState(() {}); 
          }
        } catch (e) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString()), backgroundColor: Colors.red));
          }
        }
      }
    }
  }

  // ====================================================================
  // 4. TAMAMLANAN BAKIMLAR KARTI
  // ====================================================================
  Widget _buildCompletedMaintenanceCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 4, vertical: 8),
          child: Row(
            children: [
              Icon(Icons.history_edu, color: Colors.blueGrey),
              SizedBox(width: 8),
              Text('Tamamlanan Bakımlar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        FutureBuilder<List<dynamic>>(
          future: _apiService.getCompletedMaintenances(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
            if (snapshot.hasError) return Text("Bakım geçmişi yüklenemedi: ${snapshot.error}", style: const TextStyle(color: Colors.red));
            if (!snapshot.hasData || snapshot.data!.isEmpty) return const Text("Henüz tamamlanan bir bakım kaydınız yok.");

            return Column(
              children: snapshot.data!.map((record) {
                final rawDate = record['date']?.toString() ?? '';
                String formattedDate = 'Belirsiz';
                if (rawDate.isNotEmpty) {
                  try {
                    final DateTime dt = DateTime.parse(rawDate).toLocal();
                    formattedDate = "${dt.day.toString().padLeft(2,'0')}.${dt.month.toString().padLeft(2,'0')}.${dt.year}";
                  } catch (e) { formattedDate = rawDate; }
                }
                
                final actionsList = record['actions'] as List<dynamic>? ?? [];
                final actionsText = actionsList.join(', '); 
                final notes = record['notes'] ?? "Not girilmemiş";
                final recordId = record['_id']; 

                return Card(
                  color: Colors.white,
                  shape: const Border(left: BorderSide(color: Colors.blueGrey, width: 4)),
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(formattedDate, style: const TextStyle(fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Text('İşlemler: ${actionsText.isEmpty ? "Belirtilmemiş" : actionsText}'),
                              const SizedBox(height: 4),
                              Text('Luthier Notu: $notes', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.edit_square, color: Colors.grey),
                          onPressed: () {
                            setState(() {
                              _selectedRecordId = recordId; 
                              _luthierNoteController.text = notes; 
                            });
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Kayıt, Luthier Paneline aktarıldı.')));
                          },
                        )
                      ],
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }

  // ====================================================================
  // 5. LUTHIER İŞLEM PANELİ KARTI
  // ====================================================================
  Widget _buildLuthierPanelCard() {
    return Card(
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: BorderSide(color: Colors.orange.shade300, width: 1)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.build, color: Colors.orange),
                SizedBox(width: 8),
                Text('Luthier İşlem Paneli', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            const Text('(Bakım Kaydı Gir/Güncelle)', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 12),
            TextField(
              controller: _luthierNoteController,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'Yukarıdaki listeden bir kaydın düzenleme butonuna tıklayın...',
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.all(12),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: ElevatedButton(
                    onPressed: () async {
                      if (_selectedRecordId == null) {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lütfen güncellenecek bir kayıt seçin!'), backgroundColor: Colors.red));
                        return;
                      }
                      try {
                        await _apiService.updateMaintenanceNote(_selectedRecordId!, _luthierNoteController.text);
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bakım notu güncellendi!'), backgroundColor: Colors.green));
                        setState(() {
                          _selectedRecordId = null;
                          _luthierNoteController.clear();
                        });
                      } catch (e) {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString()), backgroundColor: Colors.red));
                      }
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: Colors.white),
                    child: const Text('Notu Güncelle'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 1,
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _selectedRecordId = null;
                        _luthierNoteController.clear();
                      });
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.grey.shade400, foregroundColor: Colors.white),
                    child: const Text('İptal'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Ortak TextField
  Widget _buildTextField(String hint, {IconData? icon, TextEditingController? controller}) {
    return SizedBox(
      height: 45,
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          hintText: hint,
          contentPadding: const EdgeInsets.symmetric(horizontal: 12),
          border: const OutlineInputBorder(),
          suffixIcon: icon != null ? Icon(icon, size: 20) : null,
        ),
      ),
    );
  }
}