<p align="center">
  <img src="/docs/screenshots/home.png" alt="DermaMind Banner" width="100%">
</p>

<h1 align="center">🧴 DermaMind</h1>

<p align="center">
AI-Powered Skin Analysis & Personalized Skincare Platform
</p>

<p align="center">
DermaMind combines Artificial Intelligence, personalized skin analysis, and skincare e-commerce to help users understand their skin, receive personalized recommendations, and build an effective skincare routine through an intuitive and responsive web application.
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)
![MIT License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

</p>

---

# 🌐 Live Demo

https://your-vercel-link.vercel.app

---

# 🌟 Project Preview

<p align="center">
<img src="/docs/screenshots/home-dark.png" width="100%">
</p>

---

# 📖 About

DermaMind is an AI-powered skincare platform that combines Artificial Intelligence, personalized skin analysis, and skincare e-commerce into one seamless experience.

The platform helps users identify their skin type and concerns through an interactive skin assessment and AI facial analysis, then provides personalized skincare recommendations, suitable products, and customized routines.

Users can also browse skincare products, manage their wishlist and shopping cart, place orders, and interact with an AI skincare assistant.

The application follows a scalable feature-based architecture built with Next.js and TypeScript, focusing on performance, maintainability, and an exceptional user experience.

---

# ✨ Features

## 🧪 Skin Assessment

- Interactive skin questionnaire.
- Determines skin type and concerns.
- Collects user information before AI analysis.
- Improves recommendation accuracy.

---

## 🤖 AI Skin Analysis

- AI-powered facial image analysis.
- Secure image upload.
- Skin type detection.
- Skin concern identification.
- Personalized skin reports.
- Scan history.

---

## 💡 Personalized Recommendations

- Personalized skincare routines.
- AI-generated skincare insights.
- Product recommendations based on analysis results.

---

## 🛍️ E-Commerce

- Browse skincare products.
- Product categories.
- Search products.
- Advanced filtering.
- Product details.
- Wishlist.
- Shopping cart.
- Checkout.
- Order history.

---

## 👤 Authentication

- Sign Up.
- Login.
- Google Authentication.
- Email Verification.
- Forgot Password.
- Reset Password.
- Protected Routes.

---

## 👤 User Dashboard

- Manage profile.
- View scan history.
- View order history.
- Manage wishlist.

---

## 🤖 AI Chatbot

- Interactive skincare assistant.
- Product recommendations.
- Skincare guidance.
- Frequently asked questions.

---

## 📱 Responsive Design

- Desktop.
- Tablet.
- Mobile.
- Light Mode.
- Dark Mode.

---

# 🚀 How It Works

1. Users can browse skincare products without creating an account.
2. AI-powered features require authentication.
3. After signing in, users complete the Skin Assessment.
4. Users upload a facial image.
5. The AI analyzes the skin condition.
6. A personalized skin report is generated.
7. Recommended products and skincare routines are displayed.
8. Products can be added to the wishlist or shopping cart.
9. Users complete checkout and track their orders and scan history.

---

# 📸 Screenshots

## 🏠 Home

| Light | Dark |
|-------|------|
| ![](/docs/screenshots/home.png) | ![](/docs/screenshots/home-dark.png) |

---

## 🧪 Skin Assessment

| Step 1 | Step 2 |
|---------|---------|
| ![](/docs/screenshots/skintest-light-ques.png) | ![](/docs/screenshots/skintest-dark.png) |

|Competion-light | Completion-dark |
|---------|------------|
| ![](/docs/screenshots/skintest-light.png) | ![](/docs/screenshots/skin-test-dark.png) |

---

## 🤖 AI Skin Scan

| Upload | Processing |
|---------|------------|
| ![](/docs/screenshots/analysis-light.png) | ![](/docs/screenshots/analysis2.png) |

---

## 📊 Analysis Result

| Light | Dark |
|---------|---------|
| ![](/docs/screenshots/result-light.png) | ![](/docs/screenshots/result-dark.png) |

---

## 🛍️ Products

| Light | Dark |
|---------|---------|
| ![](/docs/screenshots/shop-light.png) | ![](/docs/screenshots/shop-dark.png) |

---

## ❤️ Wishlist

| Light | Dark |
|---------|---------|
| ![](/docs/screenshots/wishlist-light.png) | ![](/docs/screenshots/wishlist-dark.png) |

---

## 🛒 Shopping Cart

| Light | Dark |
|---------|---------|
| ![](/docs/screenshots/cart-light.png) | ![](/docs/screenshots/cart-dark.png) |

---

## 👤 Profile

| Light | Dark |
|---------|---------|
| ![](/docs/screenshots/profile-light.png) | ![](/docs/screenshots/profile-dark.png) |

---

## 🤖 AI Chatbot

| Light | Dark |
|---------|---------|
| ![](/docs/screenshots/chatbot-light.png) | ![](/docs/screenshots/chatbot-dark.png) |

---

# 🛠 Tech Stack

| Category | Technologies |
|-----------|--------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit |
| Forms | React Hook Form |
| Validation | Zod |
| API Communication | Axios |
| Notifications | React Toastify |
| Animations | AOS |
| Icons | Font Awesome |

---

# 📂 Project Structure

```text
src
│
├── app
├── assets
├── components
├── config
├── features
├── hooks
├── lib
├── server
├── store
├── styles
├── types
├── utils
│
public
```

The project follows a Feature-Based Architecture, making it scalable, maintainable, and easy to extend.

---

# 🏗 Application Architecture

```text
                    User
                      │
                      ▼
              Next.js Application
                      │
        ┌─────────────┴─────────────┐
        │                           │
 React Hook Form             Redux Toolkit
        │                           │
        └─────────────┬─────────────┘
                      ▼
                    Axios
                      │
                      ▼
                 Backend API
```

---

# 🔄 User Flow

```text
                           Home
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
   Browse Products                       AI Features
          │                                     │
          └──────────────────┬──────────────────┘
                             │
                     Login / Register
                             │
                             ▼
                    Skin Assessment
                             │
                             ▼
                    Upload Facial Image
                             │
                             ▼
                     AI Skin Analysis
                             │
                             ▼
                 Personalized Skin Report
                             │
         ┌───────────────────┼────────────────────┐
         ▼                   ▼                    ▼
 Recommended Products   AI Chatbot        Scan History
         │
         ▼
 Product Details
         │
    ┌────┴────┐
    ▼         ▼
 Wishlist    Add to Cart
                │
                ▼
            Checkout
                │
                ▼
          Order History
                │
                ▼
              Profile
```

---

# 📋 Project Status

| Feature | Status |
|----------|--------|
| Authentication | ✅ |
| Google Authentication | ✅ |
| Skin Assessment | ✅ |
| AI Skin Analysis | ✅ |
| Personalized Recommendations | ✅ |
| Product Search | ✅ |
| Product Filtering | ✅ |
| Wishlist | ✅ |
| Shopping Cart | ✅ |
| Checkout | ✅ |
| Orders | ✅ |
| AI Chatbot | ✅ |
| Scan History | ✅ |
| Responsive Design | ✅ |
| Light Mode | ✅ |
| Dark Mode | ✅ |

---

# 🚀 Getting Started

## Prerequisites

- Node.js (Latest LTS)
- npm or Yarn

## Installation

```bash
npm install
```

or

```bash
yarn
```

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

---

# 🚀 Future Improvements

- Online Payment Gateway Integration
- Product Reviews & Ratings
- Push Notifications
- Admin Dashboard
- Multi-language Support
- AI Model Enhancement
- Appointment Booking with Dermatologists

---

# 👩‍💻 Designed & Developed By

### Mariam Hamdy Mohamed

**Faculty of Computers & Information Systems**

Graduation Project • 2026

---

<h2 align="center">
🌿 DermaMind
</h2>

<p align="center">
<b>Where AI Meets Skin Health.</b>
</p>

<p align="center">
Made with ❤️ using Next.js, TypeScript & Tailwind CSS
</p>