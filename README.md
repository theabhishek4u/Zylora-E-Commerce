# 🛒 Zylora — Premium E-Commerce Platform

<p align="center">
  <strong>The Future of Online Shopping</strong><br/>
  A full-featured, production-ready e-commerce web application built with Next.js 16, TypeScript, Prisma, and modern UI libraries.
</p>

---

## ✨ Overview

**Zylora** is a premium e-commerce platform designed for the modern shopping experience. It features a sleek, responsive UI with dark/light mode, real-time cart management, wishlist support, order tracking, coupon system, and a powerful admin dashboard — all built from scratch with cutting-edge technologies.

---

## 🚀 Features

### 🛍️ Shopping Experience
- **Product Catalog** — Browse 31+ products across 6 categories (Electronics, Fashion, Home & Kitchen, Books, Beauty, Sports)
- **Smart Search** — Real-time product search with filters and sorting
- **Product Details** — Rich product pages with images, reviews, ratings, and related products
- **Shopping Cart** — Add/remove items, quantity management, price calculation
- **Wishlist** — Save products for later with one-click add/remove
- **Coupon System** — Apply discount codes at checkout (percentage & flat discounts)

### 👤 User Accounts
- **Authentication** — Register, login, logout with NextAuth.js
- **User Dashboard** — Profile management, order history, recently viewed
- **Address Book** — Manage multiple shipping addresses
- **Order Tracking** — Track order status from placement to delivery

### 💳 Checkout & Payments
- **Multi-step Checkout** — Address → Payment → Review → Confirm
- **Order Management** — Full order lifecycle with status updates
- **Payment Methods** — Support for COD, UPI, Cards, Net Banking

### 📊 Admin Dashboard
- **Product Management** — Create, edit, delete products
- **Order Management** — View and update order statuses
- **User Management** — View and manage registered users
- **Coupon Management** — Create and manage discount coupons

### 🎨 UI/UX
- **Dark / Light Mode** — Toggle between themes seamlessly
- **Responsive Design** — Mobile-first with bottom navigation for mobile
- **Smooth Animations** — Framer Motion powered transitions and interactions
- **Toast Notifications** — Real-time feedback for user actions
- **Glass Morphism** — Premium glass-effect UI elements

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Library** | shadcn/ui (New York style) |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Database** | SQLite (via Prisma ORM) |
| **ORM** | Prisma Client |
| **Auth** | NextAuth.js v4 |
| **State** | Zustand |
| **Server State** | TanStack React Query |
| **Forms** | React Hook Form + Zod |
| **Notifications** | Sonner |
| **Charts** | Recharts |
| **Carousel** | Embla Carousel |
| **Fonts** | Inter + Poppins (Google Fonts) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── addresses/          # Address CRUD
│   │   ├── admin/              # Admin endpoints
│   │   ├── auth/               # NextAuth authentication
│   │   ├── cart/               # Cart operations
│   │   ├── categories/         # Category listing
│   │   ├── checkout/           # Order placement
│   │   ├── coupons/            # Coupon validation
│   │   ├── notifications/      # User notifications
│   │   ├── orders/             # Order management
│   │   ├── products/           # Product CRUD
│   │   ├── reviews/            # Product reviews
│   │   └── wishlist/           # Wishlist operations
│   ├── globals.css             # Global styles & animations
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main application page
│
├── components/
│   ├── shop/                   # E-Commerce Components
│   │   ├── admin-view.tsx      # Admin dashboard
│   │   ├── auth-view.tsx       # Login/Register
│   │   ├── cart-view.tsx       # Shopping cart
│   │   ├── checkout-view.tsx   # Multi-step checkout
│   │   ├── footer.tsx          # Site footer
│   │   ├── header.tsx          # Navigation header
│   │   ├── home-view.tsx       # Homepage with hero & products
│   │   ├── mobile-bottom-nav.tsx # Mobile tab navigation
│   │   ├── order-detail-view.tsx # Order details
│   │   ├── order-success-view.tsx # Order confirmation
│   │   ├── orders-view.tsx     # Order history
│   │   ├── product-card.tsx    # Product card component
│   │   ├── product-detail-view.tsx # Product detail page
│   │   ├── user-dashboard-view.tsx # User profile & settings
│   │   └── wishlist-view.tsx   # Wishlist page
│   └── ui/                     # shadcn/ui Components
│
├── lib/
│   └── db.ts                   # Prisma client instance
│
└── stores/                     # Zustand State Stores
    ├── auth-store.ts           # Authentication state
    ├── cart-store.ts           # Cart state
    ├── wishlist-store.ts       # Wishlist state
    ├── search-store.ts         # Search & filter state
    ├── notification-store.ts   # Notification state
    └── theme-store.ts          # Theme preference state

prisma/
├── schema.prisma               # Database schema (9 models)
└── seed.ts                     # Seed data (31 products, 6 categories)
```

---

## 🗄️ Database Schema

The application uses **9 Prisma models**:

- **User** — Accounts with roles (user/admin)
- **Address** — Shipping addresses
- **Category** — Product categories
- **Product** — Product catalog with images, pricing, ratings
- **Cart / CartItem** — Shopping cart management
- **Order / OrderItem** — Order processing and tracking
- **Review** — Product reviews and ratings
- **WishlistItem** — Saved products
- **RecentlyViewed** — Browsing history
- **Coupon** — Discount code management
- **Notification** — User notifications

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **npm**, **yarn**, or **bun** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/theabhishek4u/E-Commerce.git
cd E-Commerce

# Install dependencies
npm install
# or
bun install

# Setup database
npx prisma db push
# or
bun run db:push

# Seed the database with sample data
npx prisma db seed
# or
bun run db:seed

# Start development server
npm run dev
# or
bun run dev
```

The application will be available at **http://localhost:3000**

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🔑 Demo Accounts

After seeding the database, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@zylora.com | Admin@123 |
| **User** | user@zylora.com | User@123 |

---

## 📱 Mobile Navigation

The app features a mobile-first design with bottom tab navigation:

| Tab | Feature |
|-----|---------|
| 🏠 **Home** | Hero banner, categories, products |
| 🔍 **Search** | Product search with filters |
| 🛒 **Cart** | Shopping cart with checkout |
| ❤️ **Wishlist** | Saved products |
| 👤 **Me** | Profile, orders, settings |

---

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Midnight Blue | `#0F172A` | Header, footer, dark backgrounds |
| Matte Black | `#1E293B` | Dark mode surfaces |
| Pure White | `#FFFFFF` | Light mode backgrounds |
| Electric Blue | `#2563EB` | Primary brand color, CTAs |
| Neon Blue | `#3B82F6` | Hover states, highlights |
| Metallic Silver | `#94A3B8` | Muted text, borders |

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products (with filters) |
| `GET` | `/api/products/[id]` | Get single product |
| `GET` | `/api/categories` | List all categories |
| `GET/POST` | `/api/cart` | Get cart / Add to cart |
| `DELETE` | `/api/cart/[id]` | Remove cart item |
| `GET/POST` | `/api/wishlist` | Get wishlist / Toggle wishlist |
| `POST` | `/api/checkout` | Place an order |
| `GET` | `/api/orders` | List user orders |
| `GET` | `/api/orders/[id]` | Get order details |
| `POST` | `/api/reviews` | Submit a product review |
| `GET/POST` | `/api/coupons` | Validate / Create coupon |
| `GET` | `/api/notifications` | Get user notifications |
| `POST` | `/api/auth/register` | Register new user |
| `GET/POST` | `/api/admin/*` | Admin operations |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/theabhishek4u">Abhishek</a>
</p>
