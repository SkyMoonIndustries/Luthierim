import 'package:dio/dio.dart';

class CustomerApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://luthierim-backend.vercel.app/v1',
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
  ));

  // --- HATA AYIKLAMA YARDIMCISI ---
  String _extractDioError(DioException e) {
    if (e.response != null && e.response?.data != null) {
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

  // 1. Müşteri Kayıt (POST)
  Future<String> registerCustomer(String name, String email, String password) async {
    try {
      final response = await _dio.post('/customers/register', data: {
        "name": name,
        "email": email,
        "password": password,
      });
      
      final resData = response.data;
      String newId = "";
      
      // Backend veriyi hangi klasörde gizlerse gizlesin bulup çıkarıyoruz
      if (resData is Map) {
        newId = resData['_id']?.toString() ?? resData['id']?.toString() ?? resData['customerId']?.toString() ?? '';
        if (newId.isEmpty && resData['data'] is Map) {
          newId = resData['data']['_id']?.toString() ?? resData['data']['id']?.toString() ?? '';
        }
        if (newId.isEmpty && resData['customer'] is Map) {
          newId = resData['customer']['_id']?.toString() ?? resData['customer']['id']?.toString() ?? '';
        }
      }
      
      // Eğer backend cidden ID göndermediyse ekrana hatayı basıp ne yolladığını göreceğiz
      if (newId.isEmpty) {
        throw Exception("Kayıt başarılı ama Backend ID vermedi! Gelen: $resData");
      }
      
      return newId;
      
    } on DioException catch (e) {
      throw Exception('Kayıt başarısız: ${_extractDioError(e)}');
    }
  }

  // 2. Müşteri Güncelle (PUT)
  Future<void> updateCustomer(String customerId, String name, String email) async {
    try {
      await _dio.put('/customers/$customerId', data: {
        "name": name,
        "email": email,
      });
    } on DioException catch (e) {
      throw Exception('Güncelleme başarısız: ${_extractDioError(e)}');
    }
  }

  // 3. Müşteri Sil (DELETE)
  Future<void> deleteCustomer(String customerId) async {
    try {
      await _dio.delete('/customers/$customerId');
    } on DioException catch (e) {
      throw Exception('Hesap silinemedi: ${_extractDioError(e)}');
    }
  }

  // 4. Müşteri Enstrümanlarını Listele (GET)
  Future<List<dynamic>> getCustomerInstruments(String customerId) async {
    try {
      final response = await _dio.get('/customers/$customerId/instruments');
      final data = response.data;
      
      // DÜZELTME BURADA: Backend direkt Liste yolluyorsa çökmeyecek, direkt alacak
      if (data is List) return data;
      
      // Eğer backend "data" klasörü içinde yolluyorsa oradan alacak
      if (data is Map && data['data'] is List) return data['data'];
      
      return [];
    } on DioException catch (e) {
      throw Exception('Enstrümanlar getirilemedi: ${_extractDioError(e)}');
    }
  }

  // 5. Yeni Enstrüman Ekle (POST)
  Future<void> addInstrument(String customerId, String brand, String model, int year) async {
    try {
      await _dio.post('/customers/$customerId/instruments', data: {
        "brand": brand,
        "model": model,
        "year": year,
      });
    } on DioException catch (e) {
      throw Exception('Enstrüman eklenemedi: ${_extractDioError(e)}');
    }
  }

  // 6. Enstrüman Güncelle (PUT)
  Future<void> updateInstrument(String instrumentId, String brand, String model, int year) async {
    try {
      await _dio.put('/instruments/$instrumentId', data: {
        "brand": brand,
        "model": model,
        "year": year,
      });
    } on DioException catch (e) {
      throw Exception('Enstrüman güncellenemedi: ${_extractDioError(e)}');
    }
  }

  // 7. Enstrüman Sil (DELETE)
  Future<void> deleteInstrument(String instrumentId) async {
    try {
      await _dio.delete('/instruments/$instrumentId');
    } on DioException catch (e) {
      throw Exception('Enstrüman silinemedi: ${_extractDioError(e)}');
    }
  }
}