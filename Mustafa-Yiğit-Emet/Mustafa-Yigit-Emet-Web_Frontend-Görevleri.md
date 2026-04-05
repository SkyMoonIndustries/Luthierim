# Mustafa Yiğit Emet'in Web Frontend Görevleri

**Proje Canlı Yayın Adresi (Vercel):** `https://luthierim.vercel.app`
**Görev Test ve Veritabanı Kanıt Videosu:** `https://youtu.be/dzXBXGpsbP8`

> **Not:** Kendi üzerime düşen 8 adet Frontend gereksiniminin 7 adetinin hepsini (%100) eksiksiz olarak geliştirilmiş, Vercel üzerinde canlıya alınmış ve Backend (API) uç noktalarıyla başarılı bir şekilde entegre edilmiştir.

---

## 1. Müşteri Hesabı Oluşturma (Kayıt)

**Dosya:** `src/pages/CustomerPanel.jsx`

* **Amacı:** Sisteme yeni katılacak kullanıcıların kişisel bilgilerini (ad, e-posta, şifre) girerek kendi profillerini oluşturmalarını sağlar.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Form gönderildiğinde `POST /v1/customers/register` API'sine istek atılarak MongoDB'ye yeni kayıt düşürüldü.
  * **Durum (State) Yönetimi:** `registerData` nesnesi ile formdaki inputlar (Controlled Components) anlık olarak takip edildi.
  * **UI ve UX Geliştirmesi:** Kullanıcı kayıt olduğunda backend'den dönen Müşteri ID'si yakalanıp `SweetAlert2` kütüphanesi kullanılarak ekranın ortasında şık bir karşılama popup'ı ile gösterildi. Ayrıca ID, sayfanın en üstünde yeşil bir panoda (ID Panosu) sürekli görünür kılınarak kopyalama kolaylığı sağlandı.

---

## 2. Müşteri Bilgilerini Güncelleme

**Dosya:** `src/pages/CustomerPanel.jsx`

* **Amacı:** Kayıtlı kullanıcının ad, e-posta veya şifre gibi kişisel bilgilerini sonradan değiştirmesini sağlar.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** "Güncelle" butonuna tıklandığında `PUT /v1/customers/{customerId}` uç noktasına güncel `registerData` state'i gönderildi.
  * **Mantıksal İşlem:** İşlemin yapılabilmesi için kullanıcının aktif bir Müşteri ID'sine sahip olması zorunlu kılındı. Aksi halde işlem engellendi.
  * **UX Geliştirmesi:** Tarayıcının standart bildirimleri yerine `react-hot-toast` kütüphanesi ile "Hesap bilgileri güncellendi" yazan estetik ve animasyonlu bildirimler (toast) kullanıldı.

---

## 3. Müşteri Hesabını Silme

**Dosya:** `src/pages/CustomerPanel.jsx`

* **Amacı:** Kullanıcının kendi isteğiyle platformdaki kaydını ve verilerini kalıcı olarak silmesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Sil butonuna tıklandığında `DELETE /v1/customers/{customerId}` API uç noktasına istek atıldı.
  * **Güvenlik ve UX (SweetAlert2):** İşlem veritabanında kalıcı olduğu için doğrudan silme işlemi engellendi.
  * **Veri Temizliği:** Hesap silindikten sonra ekranda kalan aktif ID ve listelenen eski enstrümanlar React state'leri boşaltılarak (`setInstruments([])`) anında ekrandan temizlendi.

---

## 4. Müşteri Enstrümanlarını Listeleme

**Dosya:** `src/pages/CustomerPanel.jsx`

* **Amacı:** Kullanıcının sisteme önceden kaydettiği tüm gitarlarını ve müzik ekipmanlarını görüntülemesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** `GET /v1/customers/{customerId}/instruments` API'sine istek atılarak kullanıcının envanteri çekildi.
  * **Hata Kontrolü (Type Checking):** Backend'den gelen verinin yapısına göre (direkt dizi veya object içinde) dinamik bir kontrol mekanizması yazılarak `Array.isArray()` ile hata alınması engellendi.
  * **Kullanıcı Arayüzü (UI):** Çekilen veriler CSS Flexbox yapısıyla şık kartlar halinde tasarlandı. Marka, model ve üretim yılı listeye yazdırıldı.
  * **UX Geliştirmesi:** Enstrüman yoksa veya ID girilmemişse ekranda yönlendirici gri italik bir mesaj ("Henüz eklenmiş enstrüman bulunmuyor") gösterildi.

---

## 5. Yeni Enstrüman Ekleme

**Dosya:** `src/pages/CustomerPanel.jsx`

* **Amacı:** Kullanıcının sahip olduğu yeni bir gitarı kendi profiline envanter olarak eklemesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Müşteri ID'si referans alınarak `POST /v1/customers/{customerId}/instruments` adresine `instrumentData` JSON formatında gönderildi.
  * **Durum Yönetimi:** Form verileri tek bir state'de toplandı ve `required` (zorunlu alan) kontrolleri React üzerinden sağlandı.
  * **Performans ve UX:** Veri başarıyla eklendiğinde form inputları otomatik olarak temizlendi (reset) ve `fetchInstruments()` fonksiyonu tekrar tetiklenerek yeni enstrüman sayfa yenilenmeden canlı olarak DOM'a eklendi.

---

## 6. Enstrüman Detaylarını Güncelleme

**Dosya:** `src/pages/CustomerPanel.jsx`

* **Amacı:** Sisteme kayıtlı bir enstrümanın model veya yıl gibi detaylarının değiştirilmesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** İlgili enstrümanın düzenleme butonuna basıldığında `PUT /v1/instruments/{instrumentId}` adresine güncel form verileriyle istek gönderildi.
  * **Mantıksal Akış:** Düzenlenecek enstrümanın verileri state'e alınarak kullanıcının var olan veriler üzerinden değişiklik yapabilmesi sağlandı.

---

## 7. Enstrüman Kaydını Silme

**Dosya:** `src/pages/CustomerPanel.jsx`

* **Amacı:** Elden çıkarılan veya takip edilmek istenmeyen enstrümanın envanterden silinmesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Enstrüman kartındaki kırmızı çöp kutusu ikonuna basıldığında `DELETE /v1/instruments/{instrumentId}` adresine istek atıldı.
  * **UX Geliştirmesi:** Yanlışlıkla tıklamaları önlemek adına yine `SweetAlert2` ile onay modülü devreye sokuldu. Silme işlemi tamamlandığında API'den güncel liste tekrar çekilerek silinen öğe ekrandan pürüzsüzce kaldırıldı.
