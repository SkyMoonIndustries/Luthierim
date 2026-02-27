1. **Müşteri Hesabı Oluşturma**
   - **API Metodu:** `POST /customers/register`
   - **Açıklama:** Sisteme yeni katılacak kullanıcıların kişisel bilgilerini (ad, e-posta, şifre) girerek kendi profillerini oluşturmalarını sağlar. Müşterinin platforma ilk adımını attığı kayıt işlemidir.

2. **Müşteri Bilgilerini Güncelleme**
   - **API Metodu:** `PUT /customers/{customerId}`
   - **Açıklama:*** Kayıtlı kullanıcının adres, telefon veya şifre gibi kişisel bilgilerini sonradan değiştirmesini sağlar. Güvenlik için kullanıcının sisteme giriş yapmış olması gerekir ve herkes sadece kendi bilgilerini güncelleyebilir.

3. **Müşteri Hesabını Silme**
   - **API Metodu:** `DELETE /customers/{customerId}`
   - **Açıklama:** Kullanıcının kendi isteğiyle platformdaki kaydını ve kişisel verilerini tamamen kaldırmasını sağlar. Bu işlem geri alınamaz. Güvenlik için giriş yapmış olmak zorunludur.

4. **Müşteri Enstrümanlarını Listeleme**
   - **API Metodu:** `GET /customers/{customerId}/instruments`
   - **Açıklama:** Kullanıcının bakım geçmişini takip etmek amacıyla sisteme önceden kaydettiği tüm gitarlarını ve müzik ekipmanlarını görüntülemesini sağlar. Kullanıcı sadece kendi envanterini görebilir.

5. **Yeni Enstrüman Ekleme**
   - **API Metodu:** `POST /customers/{customerId}/instruments`
   - **Açıklama:** Kullanıcının sahip olduğu yeni bir gitarı veya ekipmanı kendi profiline eklemesini sağlar. Bu sayede o enstrümana özel randevu alınabilir ve bakım takip edilebilir.

6. **Enstrüman Detaylarını Güncelleme**
   - **API Metodu:** `PUT /instruments/{instrumentId}`
   - **Açıklama:** Sisteme kayıtlı bir enstrümanın model, marka veya üretim yılı gibi detaylarının sonradan düzeltilmesini veya değiştirilmesini sağlar.

7. **Enstrüman Kaydını Silme**
   - **API Metodu:** `DELETE /instruments/{instrumentId}`
   - **Açıklama:** Kullanıcının elden çıkardığı, sattığı veya artık sistemde takip etmek istemediği bir enstrümanı kendi profilinden tamamen kaldırmasını sağlar.

8. **Akıllı Donanım Tavsiyesi Alma [YAPAY ZEKA]**
   - **API Metodu:** `POST /instruments/{instrumentId}/recommendations`
   - **Açıklama:** Müşterinin dinlediği/çaldığı müzik tarzına ve profiline eklediği gitarın özelliklerine bakarak; sistemin yapay zeka analizi ile en uygun tel, manyetik veya efekt pedallarını akıllı bir şekilde önermesini sağlar.
