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

  // 1. Müşteri Hesabı Oluşturma (POST)
  Future<Map<String, dynamic>> registerCustomer({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post('/customers/register', data: {
        "name": name,
        "email": email,
        "password": password,
      });
      return response.data;
    } on DioException catch (e) {
      throw Exception('Kayıt başarısız: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Müşteri kaydı yapılamadı: $e');
    }
  }

  // 2. Müşteri Bilgilerini Güncelleme (PUT)
  Future<void> updateCustomer({
    required String customerId,
    required String name,
    String? email,
    String? phone,
    String? address,
  }) async {
    try {
      final data = {"name": name};
      if (email != null) data["email"] = email;
      if (phone != null) data["phone"] = phone;
      if (address != null) data["address"] = address;

      await _dio.put('/customers/$customerId', data: data);
    } on DioException catch (e) {
      throw Exception('Güncelleme başarısız: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Müşteri güncellenemedi: $e');
    }
  }

  // 3. Müşteri Hesabını Silme (DELETE)
  Future<void> deleteCustomer(String customerId) async {
    try {
      await _dio.delete('/customers/$customerId');
    } on DioException catch (e) {
      throw Exception('Silme başarısız: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Müşteri silinemedi: $e');
    }
  }

  // 4. Müşteri Enstrümanlarını Listeleme (GET)
  Future<List<dynamic>> getCustomerInstruments(String customerId) async {
    try {
      final response = await _dio.get('/customers/$customerId/instruments');

      // Farklı response formatlarını ele al
      if (response.data is List) {
        return response.data as List<dynamic>;
      } else if (response.data is Map) {
        if (response.data.containsKey('data')) {
          final data = response.data['data'];
          return data is List ? data : [];
        }
        return [];
      }
      return [];
    } on DioException catch (e) {
      throw Exception('Enstrümanlar çekilemedi: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Enstrüman listesi alınamadı: $e');
    }
  }

  // 5. Yeni Enstrüman Ekleme (POST)
  Future<Map<String, dynamic>> addInstrument({
    required String customerId,
    required String brand,
    required String model,
    String? year,
    String? type,
    String? notes,
  }) async {
    try {
      final response = await _dio.post(
        '/customers/$customerId/instruments',
        data: {
          "brand": brand,
          "model": model,
          if (year != null) "year": year,
          if (type != null) "type": type,
          if (notes != null) "notes": notes,
        },
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Enstrüman eklenemedi: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Yeni enstrüman ekleme başarısız: $e');
    }
  }

  // 6. Enstrüman Detaylarını Güncelleme (PUT)
  Future<void> updateInstrument({
    required String instrumentId,
    String? brand,
    String? model,
    String? year,
    String? type,
    String? notes,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (brand != null) data["brand"] = brand;
      if (model != null) data["model"] = model;
      if (year != null) data["year"] = year;
      if (type != null) data["type"] = type;
      if (notes != null) data["notes"] = notes;

      await _dio.put('/instruments/$instrumentId', data: data);
    } on DioException catch (e) {
      throw Exception('Enstrüman güncellenemedi: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Enstrüman detayları güncellenemedi: $e');
    }
  }

  // 7. Enstrüman Kaydını Silme (DELETE)
  Future<void> deleteInstrument(String instrumentId) async {
    try {
      await _dio.delete('/instruments/$instrumentId');
    } on DioException catch (e) {
      throw Exception('Enstrüman silinemedi: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Enstrüman silme başarısız: $e');
    }
  }

  // 8. Müşteri Profilini Görüntüle (GET) - Giriş doğrulamak için
  Future<Map<String, dynamic>> getCustomerProfile(String customerId) async {
    try {
      final response = await _dio.get('/customers/$customerId');
      return response.data is Map ? response.data : {};
    } on DioException catch (e) {
      throw Exception('Profil alınamadı: ${_extractDioError(e)}');
    } catch (e) {
      throw Exception('Profil bilgisi alınamadı: $e');
    }
  }
}
