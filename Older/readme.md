# 🚀 CSI Render 4.0 – Official Website

A modern, high-performance event website built for **CSI AKGEC Render 4.0**.

Built using **React 19 + Vite + Tailwind CSS v4**, featuring smooth animations, mobile-first design, and premium UI interactions.

---

## ✨ Features

* 🎨 Apple-style smooth UI
* 📱 Fully responsive (Mobile + Desktop)
* 🎠 Premium mobile carousel (Swiper.js – centered mode)
* ⚡ Smooth animations (Framer Motion)
* 🔄 Auto-slide + drag momentum
* 🧭 React Router based navigation
* 📜 Privacy, Refund & Terms pages
* 📝 Registration form section with smooth scroll
* 🌈 Glassmorphism + Gradient UI
* 🚀 Optimized build using Vite

---

## 🛠 Tech Stack

| Technology              | Purpose                   |
| ----------------------- | ------------------------- |
| **React 19**            | Frontend framework        |
| **Vite 7**              | Fast bundler & dev server |
| **Tailwind CSS v4**     | Utility-first styling     |
| **Framer Motion**       | Animations                |
| **Swiper.js**           | Mobile premium carousel   |
| **React Router DOM v7** | Routing                   |
| **Axios**               | API requests              |
| **React Icons**         | Icon library              |
| **ESLint**              | Code quality              |

---

## 📂 Project Structure

```
frontend/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CardCarousel.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── RefundPolicy.jsx
│   │   ├── TermsAndConditions.jsx
│   │   └── ThreeDLogo.jsx
│   │
│   ├── Pages/
│   │   ├── Hero.jsx
│   │   ├── InfoSection.jsx
│   │   ├── RegistrationForm.jsx
│   │   └── ContactUs.jsx
│   │
│   ├── App.jsx
│   ├── AppRoutes.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

## 🧑‍💻 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd frontend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Start Development Server

```bash
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

### 4️⃣ Build for Production

```bash
npm run build
```

---

### 5️⃣ Preview Production Build

```bash
npm run preview
```

---

## 🧭 Routing Structure

| Route             | Page               |
| ----------------- | ------------------ |
| `/`               | Landing Page       |
| `/privacy-policy` | Privacy Policy     |
| `/refund-policy`  | Refund Policy      |
| `/terms`          | Terms & Conditions |
| `/contact-us`     | Contact Page       |

---

## 🎠 Carousel Implementation

Mobile carousel is built using **Swiper.js v12** with:

* `centeredSlides`
* `loop`
* `autoplay`
* `grabCursor`
* Momentum drag
* Active slide scaling
* Partial side slide visibility

Desktop uses a custom advanced animated layout.

---

## 🎨 UI Highlights

* Glassmorphism cards
* Gradient glow effects
* Radial background lighting
* Sticky animated navbar
* Smooth scroll to registration section
* Scroll-based navbar background transition

---

## 📦 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Run ESLint
```

---

## 🛡 Code Quality

* ESLint configured
* React Hooks rules enforced
* Vite optimized bundling
* Modern ES Modules

---

## 🌍 Deployment

This project can be deployed easily on:

* Vercel
* Netlify
* Firebase Hosting
* Render

If deploying on Vercel/Netlify, ensure SPA fallback is enabled.

---

## 👨‍💻 Developed By

**CSI AKGEC Tech Team**

Made with 💙 by CSI Members.

---

## 📄 License

This project is private and intended for CSI AKGEC internal use.


