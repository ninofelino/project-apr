# POS System (Point of Sale)

A modern, fast, and responsive Point of Sale application built with Next.js, Drizzle ORM, and PostgreSQL. Designed for small to medium enterprises (UMKM), this system provides essential tools for managing sales, inventory, and transaction history.

## 🚀 Features

### 🛒 Cashier Interface
- **Product Search:** Quickly find products by name or SKU.
- **Category Filtering:** Browse products by category.
- **Cart Management:** Easily add, remove, and adjust quantities of items.
- **Multi-Payment Methods:** Supports Cash, Credit Card, E-Wallet, and QRIS.
- **Discounts:** Apply flat discounts to transactions.
- **Digital Receipts:** Generate and print formatted receipts for customers.

### 📦 Inventory Management
- **Product Tracking:** Manage product details including SKU, price, and stock levels.
- **Stock Control:** Monitor inventory in real-time.
- **Categorization:** Organize products into logical groups.

### 📜 Transaction History
- **Sales Logging:** View all completed transactions.
- **Detail View:** Inspect individual items and payment details for any past sale.
- **Real-time Updates:** Stay updated with the latest sales data.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** PostgreSQL with [Neon](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks (useState, useMemo)

## 🚦 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- PostgreSQL Database (or Neon account)

### Environment Setup
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL=your_postgresql_connection_string

# App
NEXT_PUBLIC_APP_NAME="POS System"
```

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run database migrations:
   ```bash
   npx drizzle-kit push
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema
The system uses tables prefixed with `sales_` to maintain modularity:
- `sales_categories`: Product categories.
- `sales_products`: Main product list with pricing and stock.
- `sales_transactions`: High-level transaction records.
- `sales_transaction_items`: Line items for each transaction.

## 📝 License
MIT
