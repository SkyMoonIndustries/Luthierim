# Gökay Uysal'ın REST API Metotları

**Canlı Domain Adresi:** `https://luthierim-backend.vercel.app/`
**API Test Videosu:** `https://www.youtube.com/watch?v=6KP2OY5Lm6g`

## 1. Yeni Ürün Ekleme

* **Endpoint:** `POST /products`
* **Request Body:**

```json
{
    "name": "Fender Stratocaster Elektro Gitar",
    "description": "Sıfır ayarında, orijinal kılıfıyla.",
    "price": 25000,
    "stock": 2
}
```

* **Response:** `201 Created` - Ürün başarıyla eklendi

## 2. Satıştaki Ürünleri Listeleme

* **Endpoint:** `GET /products`
* **Response:** `200 OK` - Satıştaki ürünler başarıyla listelendi

## 3. Ürün Bilgilerini Güncelleme

* **Endpoint:** `PUT /products/{productId}`
* **Path Parameters:**
  * `productId` (string, required) - Güncellenecek ürünün ID'si
* **Request Body:**

```json
{
    "price": 24000,
    "stock": 1
}
```

* **Response:** `200 OK` - Ürün bilgileri başarıyla güncellendi

## 4. Ürünü Yayından Kaldırma

* **Endpoint:** `DELETE /products/{productId}`
* **Path Parameters:**
  * `productId` (string, required) - Silinecek ürünün ID'si
* **Response:** `204 No Content` - Ürün başarıyla silindi

## 5. Sepete Ürün Ekleme

* **Endpoint:** `POST /cart/items`
* **Request Body:**

```json
{
    "productId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "quantity": 1
}
```

* **Response:** `201 Created` - Ürün sepete başarıyla eklendi

## 6. Sepetteki Ürünleri Listeleme

* **Endpoint:** `GET /cart/items`
* **Response:** `200 OK` - Sepetteki ürünler başarıyla getirildi

## 7. Sepetten Ürün Çıkarma

* **Endpoint:** `DELETE /cart/items/{itemId}`
* **Path Parameters:**
  * `itemId` (string, required) - Sepetten çıkarılacak elemanın ID'si
* **Response:** `204 No Content` - Ürün sepetten başarıyla çıkarıldı

## 8. Görselden Yedek Parça Bulma [YAPAY ZEKA]

* **Endpoint:** `POST /products/search/image`
* **Request Body:**
  * Form-Data kullanılarak `image` (Type: File) key'i ile fotoğraf gönderilir.
* **Response:** `200 OK` - Yapay zeka analizi yapıldı ve eşleşen ürünler getirildi