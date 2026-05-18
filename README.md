# 🛒 Grand Bazaar - Full-Stack MERN E-Commerce Platform

Grand Bazaar is a production-grade, multi-role MERN stack e-commerce ecosystem designed to coordinate interactions between buyers, shop administrators, delivery riders, and platform supervisors. Built with a highly animated and fully responsive interface, the system features a robust, permission-based approval workflow. Store administrators manage inventory, pricing, and category structures under the direct supervision of a platform Super Admin. Customers browse products, place orders using Stripe or Cash on Delivery (COD), and track shipments in real time. Once a rider arrives, buyers and delivery personnel can coordinate handoffs using an integrated real-time chat module, culminating in a mandatory post-delivery product and service feedback loop.

---

## 👥 Multi-Role Ecosystem & Core Features

Grand Bazaar separates access into four discrete, highly tailored user types:

### 1. 👑 Super Admin
* **System Credentials:** `superadmingmail.com` | `sueradmin123`
* **Performance Analytics:** High-level dashboard displays aggregate sales graphs, total profits, top buyers, and active user metrics.
* **Gatekeeping & Moderation:** Complete control over platform integrity, including the power to disable/block users, admins, and specific products.
* **Approval Pipeline:** Approves or rejects new Administrator registration requests and newly submitted product listings before they go live on the platform.

### 2. 🏪 Store Admin
* **Approval-Based Onboarding:** Signups require manual verification and approval by the Super Admin before dashboard access is unlocked.
* **Administrative Console:** Real-time summary metrics tracking ongoing orders, total products, top-selling items, top buyers, and rider ratings.
* **Inventory Management:** Full CRUD control over products (specifying custom options like colors, sizes, costs, delivery charges, and retail prices) and dynamic category structures. Product additions queue in a pending state until approved.
* **Fulfillment & Logistics:** Approves Rider registration requests, monitors rider metrics, and assigns pending customer orders to delivery staff.

### 3. 🚴 Delivery Rider
* **Logistics Hub:** Separate portal allowing approved delivery riders to view their assigned tasks, delivery locations, and order details.
* **Real-Time Communication:** Direct WebSocket-powered chat window with the customer, activated as soon as the rider updates their status to "Arrived".
* **Feedback Tracking:** Dedicated dashboard to view performance ratings and reviews submitted by customers upon order completion.

### 4. 🛍️ Customer (Buyer)
* **Authentication Options:** Supports both standard email-password signups and seamless Google OAuth 2.0 logins.
* **Curated Browsing:** Restricts sensitive product details and purchase actions to authenticated users, while allowing guest users to view general catalogs and categories.
* **Interactive Cart:** Live-updated navbar shopping cart with dynamic item quantity adjustments, size/color selectors, and an inline editing suite.
* **Flexible Checkout:** Support for secure credit card processing via Stripe as well as Cash on Delivery (COD).
* **Live Order Tracking:** Post-checkout dashboard displaying order status transitions, integrated real-time chat with the rider, and mandatory feedback prompts upon successful delivery.

---

## 🛠️ Technology Stack

* **Frontend:** React, Vanilla CSS / Tailwind CSS, Axios, React Router, Socket.IO Client, Stripe SDK.
* **Backend:** Node.js, Express.js, Mongoose ODM.
* **Database:** MongoDB (Atlas).
* **Real-time Engine:** Socket.IO for two-way client-server live chatting and order status updates.
* **Security:** JSON Web Tokens (JWT) for session management, bcryptjs for password hashing, and Google OAuth 2.0.

---

## 📂 Project Architecture

```
Grand Bazaar/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers (auth, products, orders, chat, categories)
│   │   ├── models/        # Mongoose data schemas (User, Product, Order, Chat, Review)
│   │   ├── middleware/    # Token validators, role verifiers (auth, admin, superAdmin)
│   │   └── routes/        # Express API endpoints
│   ├── .env               # Private backend variables (JWT Secrets, Stripe Key, Port)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI elements (Navbar, Footer, Modals)
│   │   ├── pages/         # Page components (Home, Products, Dashboards, Auth)
│   │   ├── context/       # State management (AuthContext, CartContext)
│   │   └── main.jsx
│   ├── .env               # Frontend environment endpoints
│   └── package.json
│
├── .gitignore             # Global gitignore ignoring system files, secrets, and modules
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v16.x or higher) and **npm** installed on your system.

### 2. Environment Setup

#### Backend configuration
Create a file named `.env` in the `/backend` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/grand_bazaar
JWT_SECRET=your_jwt_signature_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

#### Frontend configuration
Create a file named `.env` in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_public_key
```

### 3. Installation & Local Development

To run the application locally:

#### Step A: Run the Backend
```bash
cd backend
npm install
npm run dev
```

#### Step B: Run the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
"# Grand-Bazaar-E-Commerce-Web-Application-" 
