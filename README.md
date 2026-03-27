# Klavye Hız Testi (Typing Speed Test) ⌨️🚀

Modern, şık tasarıma ve özelleştirilebilir özelliklere sahip, **React + TypeScript + Redux Toolkit** ile geliştirilmiş bir klavye hız testi (WPM) uygulamasıdır. Özellikle müşteri temsilcileri ve canlı destek personellerinin pratik yapması, yazma hızlarını (WPM) ve doğruluk oranlarını artırmaları için özel sektör kelimeleriyle dizayn edilmiştir.

![Klavye Hız Testi](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Öne Çıkan Özellikler

- **Glassmorphism Arayüz:** Modern, premium ve göz yormayan şeffaf tasarım (Glassmorphism + TailwindCSS).
- **Zamanlı Test Modları:** İhtiyaca göre seçilebilen **1 Dakika**, **3 Dakika** ve **Süresiz** test sekmeleri.
- **Sektörel Kelime Havuzu:** Oyun, yatırım, bonus ve canlı destek terimleriyle zenginleştirilmiş özel `data.json` kelime asistanı.
- **Daktilo (Typewriter) Akışı:** Yan yana sabit duran kelimeler yerine, biten satırın otomatik yukarı kaybolduğu doğal ve akıcı daktilo efekti.
- **Görsel Sanal Klavye:** Kullanıcının hangi tuşa bastığını anlık olarak yansıtan Q Türkçe görsel klavye tepkileri.
- **Detaylı Sonuç Ekranı:** Anlık WPM (Dakika Başına Kelime), Doğruluk (%) ve Kalan Süre hesaplamaları, test bitince modern bir pop-up ile sunulur.

## 🚀 Kurulum ve Başlatma

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki komutları terminalinizde sırasıyla çalıştırın:

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/cgetiren/klavye-hiz-testi.git
   ```

2. **Dizine geçiş yapın:**
   ```bash
   cd klavye-hiz-testi
   ```

3. **Paketleri kurun:**
   ```bash
   npm install
   ```

4. **Geliştirici (Dev) sunucusunu başlatın:**
   ```bash
   npm run dev
   ```
Uygulamanız varsayılan olarak `http://localhost:5173/` veya terminalde belirtilen port üzerinde yayına girecektir.

## 📁 Proje Yapısı
```bash
src/
├── components/          # React bileşenleri (WordArea, InputArea, VirtualKeyboard, vb.)
├── data/                # data.json (Rastgele çekilen kelime havuzu)
├── store/               # Redux konfigürasyonu (WordSlice.ts ve store.ts)
├── App.tsx              # Ana uygulama iskeleti
└── index.css            # Tailwind eklemeleri ve genel CSS
```

## 👨‍💻 Geliştirici
Bu proje **[cgetiren](https://github.com/cgetiren)** tarafından tasarlanmış ve geliştirilmiştir. Tüm geri bildirimleriniz ve pull request'leriniz için GitHub üzerinden ulaşabilirsiniz.