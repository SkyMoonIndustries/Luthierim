# Halil Ergün'ün REST API Metotları

**Canlı Domain Adresi:** `https://luthierim-backend.vercel.app/`
**API Test Videosu:** `https://youtu.be/to98Ow8BxTQ`


## 1. Bakım Randevusu Alma

* **Endpoint:** `POST /v1/appointments`
* **Request Body:**
```json
{
    "instrumentId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "appointmentDate": "2026-04-15T14:30:00Z",
    "notes": "Gitarın sap ayarı yapılacak ve teller değiştirilecek."
}
```
* **Response:** `201 Created` - Randevu başarıyla oluşturuldu.

---

## 2. Randevu Zamanını Erteleme

* **Endpoint:** `PUT /v1/appointments/{appointmentId}`
* **Path Parameters:**
  * `appointmentId` *(string, required)* - Ertelenecek/güncellenecek randevunun ID'si
* **Request Body:**
```json
{
    "appointmentDate": "2026-04-20T10:00:00Z"
}
```
* **Response:** `200 OK` - Randevu zamanı başarıyla güncellendi.

---

## 3. Randevu İptal Etme

* **Endpoint:** `DELETE /v1/appointments/{appointmentId}`
* **Path Parameters:**
  * `appointmentId` *(string, required)* - İptal edilecek randevunun ID'si
* **Response:** `204 No Content` - Randevu başarıyla iptal edildi ve silindi.

---

## 4. Aktif Randevuları Listeleme

* **Endpoint:** `GET /v1/appointments/active`
* **Response:** `200 OK` - Yaklaşan tüm aktif randevular başarıyla listelendi.

---

## 5. Bakım Geçmişi Kaydı Oluşturma

* **Endpoint:** `POST /v1/maintenance-records`
* **Request Body:**
```json
{
    "instrumentId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "actionsTaken": "Entonasyon ayarı yapıldı, fretler parlatıldı.",
    "cost": 1500,
    "completedAt": "2026-04-05T16:00:00Z"
}
```
* **Response:** `201 Created` - Bakım kaydı başarıyla sisteme eklendi.

---

## 6. Bakım Notlarını Güncelleme

* **Endpoint:** `PUT /v1/maintenance-records/{recordId}`
* **Path Parameters:**
  * `recordId` *(string, required)* - Düzenlenecek geçmiş bakım kaydının ID'si
* **Request Body:**
```json
{
    "actionsTaken": "Entonasyon ayarı yapıldı, fretler parlatıldı ve manyetik yüksekliği ayarlandı.",
    "cost": 1750
}
```
* **Response:** `200 OK` - Bakım notları başarıyla güncellendi.

---

## 7. Tamamlanan Bakımları Listeleme

* **Endpoint:** `GET /v1/maintenance-records`
* **Response:** `200 OK` - Müşteriye ait tamamlanmış geçmiş bakım kayıtları başarıyla getirildi.
