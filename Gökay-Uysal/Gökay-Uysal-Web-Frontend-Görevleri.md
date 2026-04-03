# Gökay Uysal'ın Web Frontend Görevleri

**Proje Canlı Yayın Adresi (Vercel):** `https://luthierim.vercel.app`
**Görev Test ve Veritabanı Kanıt Videosu:** `https://www.youtube.com/watch?v=qwhCZcHL3V4`

> **Not:** Kendi üzerime düşen 8 adet Frontend gereksiniminin tamamı (%100) eksiksiz olarak geliştirilmiş, Vercel üzerinde canlıya alınmış ve Backend (API) uç noktalarıyla başarılı bir şekilde entegre edilmiştir.

---

## 1. Vitrin (Ana Sayfa - Ürün Listeleme) Sayfası
**Dosya:** `src/pages/Home.jsx`
* **Amacı:** Müşterilerin veritabanında kayıtlı olan tüm luthier (yedek parça/ekipman) ürünlerini liste halinde görüntülemesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Komponent ekrana yüklendiğinde (`useEffect` hook'u ile) `GET /products` API'sine istek atılarak veriler MongoDB'den çekildi.
  * **Durum (State) Yönetimi:** `products` (veriler) ve `loading` (yüklenme durumu) stateleri oluşturuldu. Veriler gelene kadar ekranda "Yükleniyor" bildirimi gösterildi.
  * **Kullanıcı Arayüzü (UI):** Ürünler, mobil uyumlu (Responsive) CSS Grid yapısıyla kartlar halinde tasarlandı. Ürün adı, açıklaması, fiyatı ve stok durumu dinamik olarak karta yazdırıldı.
  * **UX Geliştirmesi:** Stok miktarı sıfır olan ürünlerde stok yazısı kırmızıya çevrildi ve "Sepete Ekle" butonu otomatik olarak devre dışı (disabled) bırakıldı.

## 2. Yapay Zeka ile Görselden Ürün Arama Sayfası (AI Search)
**Dosya:** `src/pages/AiSearch.jsx`
* **Amacı:** Müşterilerin ellerindeki parçanın fotoğrafını yükleyerek, sistemdeki en benzer yedek parçayı Google Gemini yapay zekası ile bulması.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Kullanıcının seçtiği dosya `FormData` nesnesine dönüştürülüp `multipart/form-data` formatında `POST /products/search/image` API'sine gönderildi.
  * **Durum Yönetimi:** `selectedFile`, `preview` (önizleme) ve `results` (gelen AI eşleşmeleri) stateleri yönetildi.
  * **Kullanıcı Arayüzü (UI):** Sürükle/bırak hissi veren, gizli inputlu özel bir dosya seçici tasarlandı. Yüklenen resmin önizlemesi (URL.createObjectURL) anında ekrana yansıtıldı.
  * **UX Geliştirmesi:** İstek süresince buton "Yapay Zeka Analiz Ediyor" state'ine geçirilerek kullanıcıya geri bildirim verildi. Sonuç bulunamazsa özel hata mesajı, bulunursa ürün kartları basıldı.

## 3. Sepete Ürün Ekleme İşlemi
**Dosya:** `Home.jsx` ve `AiSearch.jsx`
* **Amacı:** Müşterilerin beğendikleri/buldukları ürünleri alışveriş sepetine ekleyebilmesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Sepete ekle butonuna tıklandığında `POST /cart/items` uç noktasına `productId` ve `quantity: 1` gövdesiyle (body) JSON isteği atıldı.
  * **Bağımlılık Kontrolü:** Sadece stoğu olan ürünlerin sepete eklenmesine izin verildi.
  * **UX Geliştirmesi:** İşlem başarılı olduğunda tarayıcının standart alert'leri yerine `react-hot-toast` kütüphanesi kullanılarak sağ alttan çıkan modern ve animasyonlu bildirimler gösterildi.

## 4. Alışveriş Sepeti (Cart) Sayfası
**Dosya:** `src/pages/Cart.jsx`
* **Amacı:** Kullanıcının eklediği ürünleri listeleyip toplam ödenecek tutarı görmesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** `GET /cart/items` API'sine istek atılarak kullanıcının sepetindeki ürünler getirildi (Backend'deki `populate` metodu sayesinde ürün detayları da alındı).
  * **Mantıksal İşlem (Logics):** JavaScript `reduce` metodu kullanılarak sepetteki tüm ürünlerin miktarı (quantity) ve fiyatı (price) çarpılıp dinamik "Toplam Tutar" hesaplandı.
  * **UX Geliştirmesi:** Eğer API'den boş dizi dönerse, kullanıcıyı alışverişe teşvik eden özel bir "Sepetiniz boş" illüstrasyonlu ekranı tasarlandı.

## 5. Sepetten Ürün Çıkarma ve Checkout İşlemi
**Dosya:** `src/pages/Cart.jsx`
* **Amacı:** Kullanıcının sepetindeki ürünleri silmesi ve alışverişi tamamlaması.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Kırmızı çöp kutusuna tıklandığında `DELETE /cart/items/:itemId` API'sine istek atıldı.
  * **Performans Optimizasyonu:** Silme işlemi backend'de başarılı olduktan sonra `setCartItems(cartItems.filter(...))` fonksiyonu ile sayfa yenilenmeden ürün DOM'dan (ekrandan) anında silindi.
  * **UX Geliştirmesi:** "Alışverişi Tamamla" butonuna basıldığında `SweetAlert2` kütüphanesi kullanılarak ekranın ortasında açılan, arka planı karartan modern bir sipariş onay modülü tetiklendi.

## 6. Luthier Yönetim Paneli - Yeni Ürün Ekleme
**Dosya:** `src/pages/Admin.jsx`
* **Amacı:** Mağaza yetkilisinin (Admin/Luthier) sisteme yeni ürünler tanımlaması.
* **Geliştirme Detayları:**
  * **UI Bileşenleri:** Ürün adı, açıklaması, fiyatı ve stoğunu içeren tek sayfa uygulaması (SPA) form tasarımı yapıldı.
  * **Durum Yönetimi:** Formdaki tüm inputlar tek bir `formData` nesnesi içinde tutularak (Controlled Components) React standartlarına uygun bağlandı.
  * **API Entegrasyonu:** Form gönderildiğinde `POST /products` API'sine veriler aktarıldı.
  * **UX Geliştirmesi:** İşlem başarılı olduğunda form temizlendi (reset) ve vitrin listesini çeken API fonksiyonu tetiklenerek yeni ürün sayfa yenilenmeden listeye eklendi. Toast bildirimi çıkarıldı.

## 7. Yönetim Paneli - Ürün Bilgilerini Güncelleme
**Dosya:** `src/pages/Admin.jsx`
* **Amacı:** Yetkilinin var olan ürünlerin fiyat/stok/isim gibi bilgilerini değiştirmesi.
* **Geliştirme Detayları:**
  * **Mantıksal Akış:** Tablodaki "Düzenle" butonuna basıldığında, o satırdaki ürünün detayları ana formun `formData` state'ine dolduruldu ve form "Güncelleme Moduna" geçirildi.
  * **API Entegrasyonu:** Form "Güncelle" butonuyla gönderildiğinde bu kez PUT işlemi tetiklenerek `PUT /products/:id` uç noktasına istek atıldı.
  * **UX Geliştirmesi:** Güncelleme moduna geçildiğinde formun etrafı turuncu renkle vurgulandı, butonun ismi ve ikonu "Güncelle" olarak dinamik değiştirildi ve bir "İptal" butonu eklendi.

## 8. Yönetim Paneli - Ürün Yayından Kaldırma (Silme)
**Dosya:** `src/pages/Admin.jsx`
* **Amacı:** İstenmeyen veya satışı biten ürünlerin veritabanından kalıcı olarak silinmesi.
* **Geliştirme Detayları:**
  * **API Entegrasyonu:** Kırmızı "Sil" butonuna basıldığında ilgili ürünün ID'si ile `DELETE /products/:id` adresine istek atıldı.
  * **Güvenlik ve UX (SweetAlert2):** Silme işlemi kalıcı ve tehlikeli olduğu için, butona basıldığında doğrudan silmek yerine `SweetAlert2` modülü tetiklendi. "Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz" uyarısı çıkarıldı. Yalnızca kullanıcı onay verirse API isteği çalıştırıldı.