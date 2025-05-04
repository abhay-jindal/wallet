# 💳 e-Wallet – Modern Digital Wallet with Recharge, Transfers & Payment Gateway Integration

![GitHub repo size](https://img.shields.io/github/repo-size/abhay-jindal/wallet)
![GitHub last commit](https://img.shields.io/github/last-commit/abhay-jindal/wallet)
![GitHub stars](https://img.shields.io/github/stars/abhay-jindal/wallet?style=social)
![License](https://img.shields.io/github/license/abhay-jindal/wallet)

**e-Wallet** is a full-featured digital wallet application built using **React**, **Material-UI**, and powered by **Razorpay**, **PayPal**, and **Brevo (Sendinblue)**. It enables **wallet recharges**, **P2P money transfers (just like PayPal)**, email notifications, and a responsive, Apple-inspired interface.

> 🚀 Ideal for developers or businesses wanting to build secure, scalable fintech apps with modern UX.

---


## ✨ Features

- 🔐 **Secure Authentication** – With reCAPTCHA & validations
- 💸 **Recharge Wallet** – Using Razorpay or PayPal
- 👥 **Send Money to Users** – Peer-to-peer transfers like PayPal
- 🧾 **Transaction History** – Filterable, real-time logs
- 📬 **Email Alerts** – Via Brevo (Sendinblue)
- 📱 **Responsive UI** – Apple-style design (SF Pro font)
- ⚙️ **Admin Panel** – Manage users & wallet operations

---

## 🔧 Tech Stack

| Layer         | Tech                                      |
|---------------|-------------------------------------------|
| **Frontend**  | React, Material-UI, React Router DOM       |
| **Validation**| Yup                                        |
| **State Mgmt**| Context API                               |
| **Auth**      | Google reCAPTCHA                          |
| **Email**     | Brevo (Sendinblue)                        |
| **Payments**  | Razorpay, PayPal SDK                      |
| **P2P Logic** | Custom internal API                       |

---

## 🛠️ Environment Setup

Set up all the environment vars in your system:

```env
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_ID_SECRET=your_razorpay_key_secret
MONGODB_URI=your_mongo_uri
BREVO_API_KEY=your_brevo_api_key
JWT_SECRET=jwt_secret
```

---

## 📥 Installation

```bash
git clone https://github.com/abhay-jindal/wallet.git
cd wallet
npm install
npm run build
npm start
```

Runs on: `http://localhost:8080`

---
## 💼 Wallet Features

This e-Wallet application offers a seamless, secure, and global-ready experience with the following capabilities:

- 💳 **Recharge Your Wallet**
  - ✅ **Razorpay**: Supports UPI, Cards, Netbanking, Wallets — ideal for Indian users with fast, secure payments.
  - 🌍 **PayPal**: Global support — perfect for international users.
  - 🔄 On successful recharge:
    - Wallet balance updates instantly
    - Transaction is securely logged
    - Confirmation email is sent via **Brevo**

- 🔁 **Send Money (P2P Transfers like PayPal)**
  - Instantly transfer funds to any other registered user
  - Just enter recipient’s email and amount
  - Wallet balance is updated in real-time for both sender and recipient
  - Both users receive email receipts
  - No third-party gateway fees — direct wallet-to-wallet
  - Email-based confirmations ensure transparency and traceability

- 📬 **Email Notifications (via Brevo)**
  - 📨 Welcome emails on registration
  - 💰 Recharge confirmation emails
  - 🔄 Transfer receipts for P2P payments
  - 🔐 Secure password reset links

All key transactions are instantly recorded and communicated — creating a transparent and trustable digital wallet environment.

---

## 📡 API Endpoints

| **Method** | **Endpoint**         | **Description**                             |
|------------|----------------------|---------------------------------------------|
| POST       | `/api/login`         | Login with email + CAPTCHA                 |
| POST       | `/api/register`      | Register new user                          |
| POST       | `/api/recharge`      | Recharge the wallet                        |
| POST       | `/api/send-money`    | Send money to another user                 |
| GET        | `/api/transactions`  | View transaction history                   |
| GET        | `/api/balance`       | Fetch wallet balance                       |


---

## 👨‍💻 Author

- **Abhay Jindal**
- 📧 Email: [jindal1808@gmail.com](mailto:jindal1808@gmail.com)
- 🌐 GitHub: [@abhay-jindal](https://github.com/abhay-jindal)
