import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'https://luthierim-backend.vercel.app';

  // 1. Vitrin Ürünleri
  static Future<List<dynamic>> getProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products'));
      if (response.statusCode == 200) return json.decode(response.body);
    } catch (e) { print("Hata: $e"); }
    return [];
  }

  // 2. Sepeti Getir
  static Future<List<dynamic>> getCart() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/cart/items'));
      if (response.statusCode == 200) return json.decode(response.body);
    } catch (e) { print("Hata: $e"); }
    return [];
  }

  // 3. Sepetten Ürün Sil
  static Future<bool> removeFromCart(String itemId) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/cart/items/$itemId'));
      return response.statusCode == 200;
    } catch (e) { print("Hata: $e"); return false; }
  }

  // 4. Sepete Ürün Ekle (Vitrin ve AI sayfasındaki butonlar için)
  static Future<bool> addToCart(String productId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/cart/items'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'productId': productId, 'quantity': 1}),
      );
      return response.statusCode == 201;
    } catch (e) { print("Hata: $e"); return false; }
  }

  // 5. Alışverişi Tamamla (Siparişi RabbitMQ'ya Gönderme)
  static Future<bool> checkout() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/cart/checkout'),
        headers: {'Content-Type': 'application/json'},
      );
      // Backend başarıyla kuyruğa alınca 202 kodu dönüyor
      return response.statusCode == 202; 
    } catch (e) {
      print("Checkout API Hatası: $e");
      return false;
    }
  }
}