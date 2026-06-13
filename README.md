# ManageCafe - Restaurant POS & Management System

ManageCafe is a modern, full-stack Point of Sale (POS) and Restaurant Management System designed for cafes and restaurants. It features a fully responsive React frontend and a robust Node.js/Express backend.

## 🚀 Features

* **Point of Sale (POS):** Fast, category-filtered product browsing, cart management, and seamless order checkout.
* **Kitchen Display System (KDS):** Real-time order tracking with "To Cook", "Preparing", and "Completed" statuses, complete with live background polling.
* **Orders Management:** Comprehensive view of all draft and paid orders, timeline tracking, and invoice details.
* **Admin Suite:** Full CRUD operations for Products, Categories, Customers, and Promotions (Coupons).
* **Reports & Analytics:** Executive dashboard with dynamic Sales Trend charts, top products, top categories, and CSV data export capabilities.
* **Role-based Access Control:** Strict routing and UI segregation between \`admin\` and \`employee\` roles.

---

## 🛠️ Tech Stack

**Frontend:**
* React 18
* Vite
* Tailwind CSS (Vanilla)
* React Router DOM v6
* Axios
* Recharts
* date-fns
* Lucide React (Icons)

**Backend:**
* Node.js
* Express
* SQLite / PostgreSQL (Depending on environment)
* JSON Web Tokens (JWT) for authentication

---

## 📂 Folder Structure

\`\`\`text
ManageCafe/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── validators/
└── frontend/
    ├── public/
    └── src/
        ├── assets/
        ├── components/
        │   ├── admin/
        │   ├── common/
        │   ├── kds/
        │   ├── layout/
        │   ├── orders/
        │   ├── pos/
        │   ├── reports/
        │   └── ui/
        ├── contexts/
        ├── hooks/
        ├── pages/
        └── services/
\`\`\`

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v18 or higher recommended)
* npm (Node Package Manager)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Jayesh-2007/ManageCafe.git
cd ManageCafe
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install

# Create a .env file based on the environment configuration requirements
# Example:
# PORT=5000
# JWT_SECRET=your_super_secret_key

# Start the backend server
npm run dev
# The backend will run on http://localhost:5000
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install

# The frontend is pre-configured to point to http://localhost:5000/api
# Start the Vite development server
npm run dev
# The frontend will run on http://localhost:5173
\`\`\`

---

## 🔑 Demo Credentials

To access the system, use the following roles:

**Admin Access** (Full Access to POS, KDS, Admin Management, Reports):
* Email: \`admin@cafepos.com\`
* Password: \`password123\` *(or as defined in backend seeder)*

**Employee Access** (Restricted to POS, Orders, KDS):
* Email: \`employee@cafepos.com\`
* Password: \`password123\` *(or as defined in backend seeder)*

---

## 🔒 Security & Architecture Notes
* **JWT Authentication:** Tokens are stored securely in local storage and appended as Bearer tokens via Axios interceptors.
* **Single Source of Truth:** The React frontend purely consumes the backend APIs. No mock data is used in production builds.
* **Error Handling:** Centralized API catch blocks ensure no silent failures, displaying contextual error messages to users.
* **Performance:** Advanced hooks like \`useDebounce\` protect the backend from spam requests during search, and \`Promise.all\` is utilized heavily in dashboards to prevent waterfall loading.

---
*Built with ❤️ for efficient restaurant management.*
