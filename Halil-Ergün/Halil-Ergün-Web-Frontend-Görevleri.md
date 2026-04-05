# Halil Ergün'ün Web Frontend Görevleri

**Proje Canlı Yayın Adresi (Vercel):** `https://luthierim.vercel.app`
**Görev Test ve Veritabanı Kanıt Videosu:** `https://youtu.be/to98Ow8BxTQ`

> **Not:** Kendi üzerime düşen 8 adet Frontend gereksiniminin 7 tanesini eksiksiz olarak geliştirilmiş, Vercel üzerinde canlıya alınmış ve Backend (API) uç noktalarıyla başarılı bir şekilde entegre edilmiştir.


---

### 1. Bakım Randevusu Alma
**Dosya:** `src/pages/Maintenance.jsx`
 
**Amacı:** Müşterinin, enstrümanının bakımı veya tamiri için luthierin takviminden uygun bir tarih ve saat seçerek randevu oluşturmasını sağlar.
 
**Geliştirme Detayları:**
- **API Entegrasyonu:** Kullanıcı formu doldurup gönderdiğinde `POST /v1/appointments` API'sine istek atılarak randevu veritabanına kaydedildi.
- **Kullanıcı Arayüzü (UI):** Tarih ve saat seçimi için kullanıcı dostu form elemanları (Controlled Components) kullanıldı ve state yönetimi ile bağlandı.
 
---
 
### 2. Randevu Zamanını Erteleme
**Dosya:** `src/pages/Maintenance.jsx`
 
**Amacı:** Daha önceden onaylanmış bir bakım randevusunun tarih veya saatinin ileri bir zamana ertelenmesini (değiştirilmesini) sağlar.
 
**Geliştirme Detayları:**
- **API Entegrasyonu:** İlgili randevu kartı üzerinden "Ertele" (veya Düzenle) işlemi tetiklendiğinde güncel tarih verisiyle `PUT /v1/appointments/{appointmentId}` API'sine istek atıldı.
- **UX Geliştirmesi:** İşlem başarılı olduğunda sayfa yenilenmesine gerek kalmadan ekrandaki randevu tarihi anında güncellendi ve başarılı toast bildirimi gösterildi.
 
---
 
### 3. Randevu İptal Etme
**Dosya:** `src/pages/Maintenance.jsx`
 
**Amacı:** Müşterinin veya luthierin mevcut bir bakım randevusunu sistemden iptal etmesini ve ilgili zaman dilimini diğer müşteriler için boşa çıkarmasını sağlar.
 
**Geliştirme Detayları:**
- **API Entegrasyonu:** İptal butonuna tıklandığında ilgili randevunun ID'si alınarak `DELETE /v1/appointments/{appointmentId}` adresine istek gönderildi.
- **Güvenlik ve UX (SweetAlert2):** Silme işlemi kalıcı olduğu için doğrudan API isteği atmak yerine SweetAlert2 modülü tetiklenerek kullanıcıdan onay istendi. Hata durumları için `catch` blokları ESLint kurallarına uygun şekilde düzenlendi.
 
---
 
### 4. Aktif Randevuları Listeleme
**Dosya:** `src/pages/Maintenance.jsx`
 
**Amacı:** Luthierin, yaklaşan tüm tamir ve bakım randevularını kendi yönetim paneli üzerindeki takvimde görüntülemesini ve günlük iş planını yapmasını sağlar.
 
**Geliştirme Detayları:**
- **API Entegrasyonu:** Sayfa yüklendiğinde `useEffect` hook'u ile `GET /v1/appointments/active` API'sinden veriler çekildi.
- **Arayüz Tasarımı:** `lucide-react` kütüphanesinden ikonlar kullanılarak randevular şık bilgi kartları (cards) halinde dinamik olarak listelendi. Veri gelene kadar yükleniyor (loading) stateleri yönetildi.
 
---
 
### 5. Bakım Geçmişi Kaydı Oluşturma
**Dosya:** `src/pages/Maintenance.jsx`
 
**Amacı:** Luthierin, tamir işlemi biten bir gitar için sisteme yapılan işlemler (tel değişimi yapıldı, entonasyon ayarlandı vb.) hakkında detaylı bir geçmiş notu eklemesini sağlar.
 
**Geliştirme Detayları:**
- **API Entegrasyonu:** Form üzerinden girilen bakım notları `POST /v1/maintenance-records` API'sine iletilerek kalıcı hale getirildi.
- **UX Geliştirmesi:** Kayıt başarıyla eklendiğinde form alanları otomatik olarak temizlendi (resetlendi).
 
---
 
### 6. Bakım Notlarını Güncelleme
**Dosya:** `src/pages/Maintenance.jsx`
 
**Amacı:** Luthierin, daha önceden sisteme girdiği bir bakım işlemindeki eksik veya hatalı notları sonradan düzeltmesini sağlar.
 
**Geliştirme Detayları:**
- **API Entegrasyonu:** Güncellenmek istenen kaydın ID'si ile `PUT /v1/maintenance-records/{recordId}` uç noktasına istek atılarak veritabanındaki notlar yenilendi.
 
---
 
### 7. Tamamlanan Bakımları Listeleme
**Dosya:** `src/pages/Maintenance.jsx`
 
**Amacı:** Müşterinin, kendi enstrümanına geçmişte luthier tarafından yapılan tüm onarım, parça değişimi ve ayar işlemlerini tarihleriyle birlikte detaylıca görüntülemesini sağlar.
 
**Geliştirme Detayları:**
- **API Entegrasyonu:** `GET /v1/maintenance-records` API'sinden müşteriye ait geçmiş bakım kayıtları çekildi.
- **Mantıksal İşlem:** Dizi (Array) halinde gelen veriler işlenerek müşterinin okuyabileceği düzenli bir formatta, tarih sırasına göre ekrana basıldı.
 
---
