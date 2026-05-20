import 'package:dio/dio.dart';

class MaintenanceApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://luthierim-backend.vercel.app/v1',
    connectTimeout: const Duration(seconds: 15), // AI için süreyi uzattık
    receiveTimeout: const Duration(seconds: 15),
  ));

  static const String dummyInstrumentId = "65b2a1c2e4b0c1234567890a";

  // --- HATA AYIKLAMA YARDIMCISI ---
  // Backend'den gelen gerçek hatayı okumak için
  String _extractDioError(DioException e) {
    if (e.response != null && e.response?.data != null) {
      // Backend'in gönderdiği JSON içindeki 'message' veya 'error' alanını yakala
      final data = e.response?.data;
      if (data is Map) {
        final msg = data['message'] ?? '';
        final err = data['error'] ?? data.toString();
        return "$msg - Detay: $err";
      }
      return e.response?.data.toString() ?? "Bilinmeyen Sunucu Hatası";
    }
    return e.message ?? "Bağlantı Hatası";
  }

  // 1. Randevu Al (POST)
  Future<void> createAppointment(String date, String notes) async {
    try {
      await _dio.post('/appointments', data: {
        "instrumentId": dummyInstrumentId,
        "date": date, // Eğer backend appointmentDate bekliyorsa hatada bunu göreceğiz
        "notes": notes,
      });
    } on DioException catch (e) {
      throw Exception('Sunucu reddetti: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Randevu alınamadı: $e');
    }
  }

  // 2. Randevu Zamanını Erteleme (PUT)
  Future<void> postponeAppointment(String appointmentId, String newDate) async {
    try {
      await _dio.put('/appointments/$appointmentId', data: {
        "newDate": newDate, 
      });
    } on DioException catch (e) {
      throw Exception('Sunucu reddetti: ${_extractDioError(e)}');
    }
  }

  // 3. Randevu İptal Etme (DELETE)
  Future<void> cancelAppointment(String appointmentId) async {
    try {
      await _dio.delete('/appointments/$appointmentId');
    } on DioException catch (e) {
      throw Exception('Sunucu reddetti: ${_extractDioError(e)}');
    }
  }

  // 4. Aktif Randevuları Listeleme (GET)
  Future<List<dynamic>> getActiveAppointments() async {
    try {
      final response = await _dio.get('/appointments/active');
      return response.data['data']; 
    } on DioException catch (e) {
      throw Exception('Veriler çekilemedi: ${_extractDioError(e)}');
    }
  }

  // 6. Bakım Notlarını Güncelleme (PUT)
  Future<void> updateMaintenanceNote(String recordId, String notes) async {
    try {
      await _dio.put('/maintenance-records/$recordId', data: {
        "notes": notes,
      });
    } on DioException catch (e) {
      throw Exception('Not güncellenemedi: ${_extractDioError(e)}');
    }
  }

  // 7. Tamamlanan Bakımları Listeleme (GET)
  Future<List<dynamic>> getCompletedMaintenances() async {
    try {
      final response = await _dio.get('/maintenance-records');
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Bakım geçmişi çekilemedi: ${_extractDioError(e)}');
    }
  }
  
  // 8. AI Bakım Tahmini (GET)
  Future<String> predictMaintenance(String freq, String sweat, String env) async {
    try {
      final response = await _dio.get(
        '/instruments/$dummyInstrumentId/maintenance-prediction',
        queryParameters: {
          "playFrequency": freq,
          "sweatProfile": sweat,
          "environment": env,
        },
      );
      return response.data['ai_analysis'];
    } on DioException catch (e) {
      // AI çökerse uydurma bir metin değil, gerçek hatayı fırlatıyoruz
      throw Exception('Backend AI Hatası: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('AI tahmini yapılamadı: $e');
    }
  }
}