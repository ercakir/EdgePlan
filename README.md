# ⚡ EdgePlan-AI Reborn — Akıllı Üretim Çizelgeleme Platformu

> **MND Saha Projesi**: Hibrit Yapay Zeka Desteği ile Akıllı Üretim Planlama, Arıza & Bakım Simülasyonu, Makine Yük Dağılımı ve Senaryo Kıyaslama Platformu.

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Deployment-00f2fe?style=for-the-badge&logo=github)](https://ercakir.github.io/EdgePlan/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.x-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌐 Canlı Uygulama / Live Deployment
İncelemek isteyenler için canlı arayüz bağlantısı:
👉 **[EdgePlan-AI Live Deployment (GitHub Pages)](https://ercakir.github.io/EdgePlan/)**

*(Sağ taraftaki GitHub **Deployments** panelinden de tek tıkla canlı uygulamaya erişebilirsiniz).*

---

## 🚀 Öne Çıkan Özellikler (5 Temel Modül)

1. ⏱️ **Üretim Çizelgeleme**: Gantt şeması ve operasyon bazlı zaman çizelgesi.
2. ⚙️ **Makine Yük Dağılımı**: Kapasite kullanım oranları ve yük analizleri.
3. 🛠️ **Arıza & Bakım Simülatörü**: Anlık makine arıza senaryoları ve duruş sürelerinin plana etkisi.
4. 📋 **İş Emri Portföyü**: ERP entegre iş emirleri, sıralama ve öncelik yönetimi.
5. 📊 **Senaryo Kıyaslama (A/B Testing)**: Operasyon-Makine atamalarını yan yana kıyaslama ve PDF raporlama.
6. 🤖 **AI Danışman & Niyet Motoru**: Doğal dil ile üretim sorularına anlık yanıt.

---

## 🛠️ Mimari ve Teknolojiler

- **Frontend**: React 18, Vite, TailwindCSS, Recharts, Lucide Icons, jsPDF
- **Backend**: Java 21, Spring Boot 3.x, RESTful API
- **Deployment**: GitHub Actions & GitHub Pages

---

## 💻 Yerel Kurulum & Çalıştırma

Projeyi çalıştırmak için `run_app.bat` dosyasını kullanabilir veya terminalden manuel başlatabilirsiniz:

```bash
# 1. Backend
cd backend
.\mvnw.cmd spring-boot:run

# 2. Frontend
cd frontend
npm install
npm run dev
```
