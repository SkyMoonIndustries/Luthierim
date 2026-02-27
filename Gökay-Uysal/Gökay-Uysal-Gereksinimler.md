1. **Yeni Ürün Ekleme**
   - **API Metodu:** `POST /products`
   - **Açıklama:** Luthierin satmak istediği yeni donanım veya ekipmanları mağaza vitrinine eklemesini sağlar. Ürünün adı, fiyatı, stok durumu ve açıklaması gibi bilgilerin sisteme kaydedilmesini içerir. Güvenlik için sadece yetkili satıcı (luthier) profiline sahip kullanıcılar tarafından kullanılabilir.

2. **Ürün Bilgilerini Güncelleme**
   - **API Metodu:** `PUT /products/{productId}`
   - **Açıklama:** Mağazadaki mevcut bir ürünün detaylarının değiştirilmesini sağlar. Ürün fiyatı, stok adedi veya özelliklerindeki güncellemeler bu işlemle yapılır. Güvenlik için sadece yetkili satıcı (luthier) tarafından gerçekleştirilebilir.

3. **Ürünü Yayından Kaldırma**
   - **API Metodu:** `DELETE /products/{productId}`
   - **Açıklama:** Satıştan kaldırılmak istenen bir ürünün mağaza vitrininden tamamen silinmesini sağlar. Ürün artık müşteriler tarafından görüntülenemez ve satın alınamaz. Bu işlemi yapabilmek için yetkili satıcı girişi gereklidir.

4. **Satıştaki Ürünleri Listeleme**
   - **API Metodu:** `GET /products`
   - **Açıklama:** Müşterilerin mağazada satışta olan tüm gitar parçalarını ve ekipmanlarını görüntülemesini sağlar. Arama, filtreleme veya kategori bazlı listeleme işlemlerini içerir. Tüm ziyaretçiler ve kayıtlı kullanıcılar tarafından erişilebilir.

5. **Sepete Ürün Ekleme**
   - **API Metodu:** `POST /cart/items`
   - **Açıklama:** Müşterinin satın almaya karar verdiği ürünü alışveriş sepetine atmasını sağlar. Ürün adedi ve seçilen özellikler bu işlemle sepete kaydedilir. İşlemin yapılabilmesi için kullanıcının sisteme giriş yapmış olması gerekir.

6. **Sepetten Ürün Çıkarma**
   - **API Metodu:** `DELETE /cart/items/{itemId}`
   - **Açıklama:** Müşterinin almaktan vazgeçtiği bir ürünü alışveriş sepetinden çıkarmasını sağlar. Seçilen ürün sepet listesinden silinir ve sepet toplamı güncellenir. Kullanıcıların sadece kendi sepetlerindeki ürünleri silme yetkisi vardır.

7. **Sepetteki Ürünleri Listeleme**
   - **API Metodu:** `GET /cart`
   - **Açıklama:** Müşterinin alışverişi tamamlamadan önce sepetine eklediği ürünlerin tamamını, güncel fiyatları ve toplam sepet tutarı ile birlikte görüntülemesini sağlar. Güvenlik için giriş yapmış olmak gerekir ve kullanıcılar yalnızca kendi sepetlerini görüntüleyebilir.

8. **Görselden Yedek Parça Bulma [YAPAY ZEKA]**
   - **API Metodu:** `POST /products/search/image`
   - **Açıklama:** Müşterinin aradığı donanımın fotoğrafını yükleyerek mağazadaki en benzer ürünleri bulmasını sağlar. Görüntü işleme teknolojisi kullanılarak yüklenen fotoğraf analiz edilir ve mağaza envanterindeki eşleşen ürünler listelenir. İşlemin yapılabilmesi için sisteme giriş yapmış olmak gerekir.