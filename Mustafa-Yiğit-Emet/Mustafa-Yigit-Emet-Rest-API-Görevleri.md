# Mustafa Yiğit Emet'in REST API Metotları

**Canlı Domain Adresi:** `https://luthierim-backend.vercel.app/`
**API Test Videosu:** `https://youtu.be/PxF-VdF1fz0`

> **Not:** Kendi üzerime düşen 7 adet Backend (API) gereksiniminin tamamı (%100) eksiksiz olarak geliştirilmiş, Postman üzerinden uçtan uca test edilmiş ve yukarıdaki videoda kanıtlanmıştır.

---

## 1. Müşteri Hesabı Oluşturma (Kayıt)

* **Endpoint:** `POST /v1/customers/register`
* **Request Body:**
```json
{
    "name": "Mustafa Yiğit Emet",
    "email": "mustafa@test.com",
    "password": "123"
}
```
* **Response:** `201 Created` - Müşteri kaydı başarıyla oluşturuldu ve ID döndürüldü.

---

## 2. Müşteri Bilgilerini Güncelleme

* **Endpoint:** `PUT /v1/customers/{customerId}`
* **Path Parameters:**
  * `customerId` *(string, required)* - Bilgileri güncellenecek müşterinin ID'si
* **Request Body:**
```json
{
    "name": "Mustafa Yiğit Güncel",
    "email": "yigit.guncel@test.com"
}
```
* **Response:** `200 OK` - Müşteri bilgileri başarıyla güncellendi.

---

## 3. Müşteri Hesabını Silme

* **Endpoint:** `DELETE /v1/customers/{customerId}`
* **Path Parameters:**
  * `customerId` *(string, required)* - Sistemden tamamen silinecek müşterinin ID'si
* **Response:** `200 OK` (veya `204 No Content`) - Müşteri hesabı başarıyla silindi.

---

## 4. Müşteri Enstrümanlarını Listeleme

* **Endpoint:** `GET /v1/customers/{customerId}/instruments`
* **Path Parameters:**
  * `customerId` *(string, required)* - Envanteri getirilecek müşterinin ID'si
* **Response:** `200 OK` - Müşteriye ait enstrümanlar başarıyla listelendi.

---

## 5. Yeni Enstrüman Ekleme

* **Endpoint:** `POST /v1/customers/{customerId}/instruments`
* **Path Parameters:**
  * `customerId` *(string, required)* - Enstrümanın ekleneceği müşterinin ID'si
* **Request Body:**
```json
{
    "brand": "Fender",
    "model": "Stratocaster",
    "year": 2020
}
```
* **Response:** `201 Created` - Yeni enstrüman müşteri profiline başarıyla eklendi.

---

## 6. Enstrüman Detaylarını Güncelleme

* **Endpoint:** `PUT /v1/instruments/{instrumentId}`
* **Path Parameters:**
  * `instrumentId` *(string, required)* - Düzenlenecek enstrümanın ID'si
* **Request Body:**
```json
{
    "brand": "Fender",
    "model": "Telecaster",
    "year": 2005
}
```
* **Response:** `200 OK` - Enstrüman detayları başarıyla güncellendi.

---

## 7. Enstrüman Kaydını Silme

* **Endpoint:** `DELETE /v1/instruments/{instrumentId}`
* **Path Parameters:**
  * `instrumentId` *(string, required)* - Envanterden çıkarılacak enstrümanın ID'si
* **Response:** `200 OK` (veya `204 No Content`) - Enstrüman kaydı başarıyla silindi.
