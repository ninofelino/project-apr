# Application Build Prompt: POS System

This document contains the prompt structure and technical requirements used to generate the Point of Sale (POS) application.

## Core Objective
Build a comprehensive POS (Point of Sale) system using Next.js 15, Drizzle ORM, and PostgreSQL. The application must support retail operations, inventory tracking, and sales reporting.

## Technical Specifications

### 1. Database Schema (Drizzle ORM)
- **Modularity:** All tables must be prefixed with `sales_`.
- **Tables:**
  - `sales_categories`: id, name, description, timestamps.
  - `sales_products`: id, category_id (FK), sku (unique), name, price (numeric), stock (int), image_url, timestamps.
  - `sales_transactions`: id, transaction_number (unique), subtotal, discount, total, payment_method, payment_status, notes, timestamps.
  - `sales_transaction_items`: id, transaction_id (FK), product_id (FK), quantity, unit_price, subtotal.

### 2. Frontend Features (Next.js App Router)
- **Cashier Dashboard (`/`):**
  - Searchable product grid with category filters.
  - Interactive sidebar shopping cart.
  - Checkout modal with payment method selection (Cash, Card, QRIS).
  - Receipt generation logic with print support.
- **Inventory Management (`/inventory`):**
  - Table view of all products.
  - Real-time stock visibility.
- **Transaction History (`/history`):**
  - List of past sales with date and total amount.
  - Expandable details for each transaction.

### 3. Business Logic
- **Stock Integrity:** Every transaction must decrement the product stock in the database.
- **Transaction Numbers:** Implement a standard format (e.g., `TRX-YYYYMMDD-XXXX`).
- **Server Actions:** Use Next.js Server Actions for processing checkouts and database mutations.

### 4. UI/UX Requirements
- **Styling:** Clean, modern interface using Tailwind CSS.
- **Responsiveness:** Optimized for both desktop and tablet (common in POS hardware).
- **Icons:** Lucide React for intuitive navigation and actions.

## Prompt Usage
"Act as a Senior Full Stack Engineer. Build a POS system using Next.js 15 and Drizzle. First, define the schema in `src/drizzle/schema.ts` using the `sales_` prefix. Then, create a server action in `src/lib/sales-actions.ts` to handle checkouts which updates both `sales_transactions` and `sales_products` (stock) in a single transaction. Finally, implement the Cashier UI with a cart system, inventory listing, and sales history page using Tailwind CSS for a professional look."
