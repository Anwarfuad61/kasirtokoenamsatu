# 🎣 Kasir Offline Android  
# 🏪 Toko Enam Satu POS System

![Flutter](https://img.shields.io/badge/Flutter-3.x-blue?logo=flutter)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-purple)
![Platform](https://img.shields.io/badge/Platform-Android-green?logo=android)
![Mode](https://img.shields.io/badge/Mode-Offline-success)
![Maintained](https://img.shields.io/badge/Maintained-Yes-brightgreen)

> Modern Offline Point of Sale (POS) System built with Flutter  
> Designed for retail & UMKM businesses with scalable architecture.

---

# 🚀 Overview

**Kasir Toko Enam Satu** adalah aplikasi Android POS (Point of Sale) berbasis Flutter yang dikembangkan dari sistem Web menjadi aplikasi native Android dengan arsitektur profesional.

Dirancang untuk:
- 🏪 Retail Store
- 🎣 Toko alat pancing
- 🛒 UMKM
- 📦 Small Inventory Business

Aplikasi berjalan **100% Offline**, cepat, ringan, dan scalable.

---

# ✨ Core Features

## 🔐 Authentication
- PIN-based Login
- Secure Session
- Logout System

## 📦 Product Management
- Add / Edit / Delete Product
- Image Upload
- Category Filter
- Search Engine
- PDF Catalog Export

## 🛒 Sales Transaction
- Cart System
- Discount (Rp & %)
- Payment Method:
  - Cash
  - QRIS
- Auto Change Calculation
- Receipt Printing (58mm / 80mm)

## 📦 Inventory
- Stock In (Purchase)
- Purchase History
- Auto Stock Update

## 📊 Reporting
- Revenue Summary
- Transaction Counter
- Date Filtering
- Excel Export

---

# 🧠 Architecture (Clean Architecture)

Project ini menggunakan pendekatan **Clean Architecture** agar:

- Maintainable
- Testable
- Scalable
- Modular
- Professional Grade

## 🏗 Layer Structure

lib/
│
├── core/
│ ├── constants/
│ ├── utils/
│
├── data/
│ ├── models/
│ ├── datasources/
│ ├── repositories_impl/
│
├── domain/
│ ├── entities/
│ ├── repositories/
│ ├── usecases/
│
├── presentation/
│ ├── screens/
│ ├── widgets/
│ ├── providers/
│
└── main.dart


---

## 🔄 Data Flow

UI (Presentation)
↓
UseCase (Domain)
↓
Repository Interface
↓
Repository Implementation (Data)
↓
Local Database (Hive / SQLite)


---

# 📊 System Diagram

## 📌 High Level Architecture

┌─────────────────────┐
│ Android App │
│ (Flutter UI Layer) │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Domain Layer │
│ Business Logic │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Data Layer │
│ Repository & Model │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Local Storage │
│ Hive / SQLite │
└─────────────────────┘


---

# 📱 Screenshot Mockup

> Simpan screenshot ke folder: `/screenshots/`

## 🔐 Login Screen
![Login](screenshots/login.png)

## 🛍 Product Catalog
![Catalog](screenshots/catalog.png)

## 🛒 Cart & Transaction
![Cart](screenshots/cart.png)

## 📊 Report Dashboard
![Report](screenshots/report.png)

---

# 🛠 Tech Stack

| Technology | Usage |
|------------|--------|
| Flutter | UI Framework |
| Dart | Programming Language |
| Hive / SQLite | Local Database |
| Provider / Riverpod | State Management |
| PDF Package | Receipt & Export |
| Excel Package | Report Export |
| Image Picker | Product Image |

---

# ⚙️ Installation

### Clone Project

```bash
git clone https://github.com/username/kasir_offline.git
cd kasir_offline
Install Dependencies
flutter pub get
Run App
flutter run
📦 Build Release APK
flutter build apk --release
Output:

build/app/outputs/flutter-apk/app-release.apk
🔒 Offline First Design
✔ No Internet Required
✔ Local Persistent Database
✔ Fast Performance
✔ Stable for Retail Environment

🏆 Portfolio Value
Project ini menunjukkan kemampuan dalam:

Clean Architecture Implementation

Modular Flutter Development

State Management

Local Database Integration

POS Business Logic Design

Report & Export System

UI/UX Structured Layout

Production-Ready App Structure

🔮 Future Roadmap
🔄 Cloud Sync

👥 Multi User Role

📷 Barcode Scanner

🖨 Bluetooth Thermal Printer

☁ Backup & Restore

🌐 Web Admin Dashboard

👨‍💻 Developer
Anwar Fuad
Android & Flutter Developer
© 2026 Toko Enam Satu

📜 License
Private Project – Internal Use Only
