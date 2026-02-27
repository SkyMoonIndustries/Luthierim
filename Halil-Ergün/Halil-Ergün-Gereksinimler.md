1. *Bakım Randevusu Alma*
   - *API Metodu:* POST /appointments
   - *Açıklama:* Müşterinin, enstrümanının bakımı veya tamiri için luthierin takviminden uygun bir tarih ve saat seçerek randevu oluşturmasını sağlar. İşlemin yapılabilmesi için sisteme giriş yapılmış olması gerekir.

2. *Randevu Zamanını Erteleme*
   - *API Metodu:* PUT /appointments/{appointmentId}
   - *Açıklama:* Daha önceden onaylanmış bir bakım randevusunun tarih veya saatinin ileri bir zamana ertelenmesini (değiştirilmesini) sağlar. Hem müşteri hem de luthier (kendi paneli üzerinden) bu işlemi yapabilir.

3. *Randevu İptal Etme*
   - *API Metodu:* DELETE /appointments/{appointmentId}
   - *Açıklama:* Müşterinin veya luthierin mevcut bir bakım randevusunu sistemden iptal etmesini ve ilgili zaman dilimini diğer müşteriler için boşa çıkarmasını sağlar.

4. *Aktif Randevuları Listeleme*
   - *API Metodu:* GET /appointments/active
   - *Açıklama:* Luthierin, yaklaşan tüm tamir ve bakım randevularını kendi yönetim paneli üzerindeki takvimde görüntülemesini ve günlük iş planını yapmasını sağlar. Güvenlik için sadece luthier yetkisiyle erişilebilir.

5. *Bakım Geçmişi Kaydı Oluşturma*
   - *API Metodu:* POST /maintenance-records
   - *Açıklama:* Luthierin, tamir işlemi biten bir gitar için sisteme yapılan işlemler (tel değişimi yapıldı, entonasyon ayarlandı vb.) hakkında detaylı bir geçmiş notu eklemesini sağlar.

6. *Bakım Notlarını Güncelleme*
   - *API Metodu:* PUT /maintenance-records/{recordId}
   - *Açıklama:* Luthierin, daha önceden sisteme girdiği bir bakım işlemindeki eksik veya hatalı notları sonradan düzeltmesini sağlar. Güvenlik için sadece luthier yetkisi gerektirir.

7. *Tamamlanan Bakımları Listeleme*
   - *API Metodu:* GET /maintenance-records
   - *Açıklama:* Müşterinin, kendi enstrümanına geçmişte luthier tarafından yapılan tüm onarım, parça değişimi ve ayar işlemlerini tarihleriyle birlikte detaylıca görüntülemesini sağlar. 

8. *Akıllı Bakım Zamanı Tahmin Etme [YAPAY ZEKA]*
   - *API Metodu:* GET /instruments/{instrumentId}/maintenance-prediction
   - *Açıklama:* Sistemin; kullanıcının gitar çalma sıklığına, terleme profiline ve bulunduğu çevrenin nem/hava durumu koşullarına bakarak yapay zeka algoritmalarıyla bir sonraki tel değişim veya sap ayarı zamanını dinamik olarak tahmin edip önermesini sağlar.
