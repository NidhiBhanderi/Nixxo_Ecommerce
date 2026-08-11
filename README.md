# DTF Sticker E-Commerce Website

### React.js + ASP.NET Core Web API + SQL Server

## 1. Project Overview

The **DTF Sticker E-Commerce Website** is a full-stack web application designed to allow users to browse, customize/select, and purchase DTF sticker products online.

The application will have two major modules:

* **User Module** – Allows customers to register, log in, browse products, manage their cart, place orders, and track their orders.
* **Admin Module** – Allows administrators to manage products, categories, users, inventory, and customer orders.

The application will be developed using **React.js** for the frontend, **ASP.NET Core Web API** for the backend, and **SQL Server** for data management.

---

## 2. User Module

### Authentication

* User Registration
* User Login
* User Logout
* JWT-based authentication
* Forgot/Reset Password
* Role-based authorization

### Product Browsing

* View all DTF sticker products
* Search products
* Filter products by category
* Sort products by price, popularity, or latest
* View product details
* View product images and pricing

### Shopping Cart

* Add products to cart
* Update product quantity
* Remove products from cart
* View cart total
* Calculate product subtotal and total amount

### Checkout & Orders

* Select/add delivery address
* Review order before placing
* Place an order
* View order history
* View order details
* Track order status

### User Profile

* View profile
* Update personal information
* Manage addresses
* Change password

---

## 3. Admin Module

### Admin Authentication

* Admin Login
* JWT Authentication
* Role-based access control

### Dashboard

* Total Users
* Total Products
* Total Orders
* Total Sales
* Pending Orders
* Recent Orders

### Product Management

* Add Product
* Update Product
* Delete Product
* View Product
* Upload Product Images
* Manage Product Price
* Manage Product Stock
* Activate/Deactivate Product

### Category Management

* Add Category
* Update Category
* Delete Category
* View Categories
* Activate/Deactivate Category

### User Management

* View Users
* View User Details
* Update User
* Activate/Deactivate User
* Manage User Roles

### Order Management

* View All Orders
* View Order Details
* Update Order Status
* Manage Pending/Confirmed/Shipped/Delivered/Cancelled Orders

### Inventory Management

* View Available Stock
* Update Stock
* Track Product Inventory

---

## 4. Backend – ASP.NET Core Web API

The backend will provide RESTful APIs for communication between the React.js frontend and SQL Server database.

### API Modules

* Authentication API
* User API
* Product API
* Category API
* Cart API
* Order API
* Address API
* Payment API
* Inventory API
* Admin API
* File Upload API

### Security

* JWT Authentication
* Role-based Authorization
* Password Hashing
* API validation
* Global Exception Handling
* Input Validation
* Secure File Upload

---

## 5. Database – SQL Server

### Main Tables

* `Users`
* `Roles`
* `UserRoles`
* `Categories`
* `Products`
* `ProductImages`
* `Cart`
* `CartItems`
* `Orders`
* `OrderItems`
* `Addresses`
* `Payments`
* `Inventory`

### Basic Relationship

```text
Users
  │
  ├── Addresses
  │
  ├── Cart
  │     └── CartItems
  │            └── Products
  │
  └── Orders
         └── OrderItems
                └── Products

Categories
     │
     └── Products
            └── ProductImages
```

---

## 6. Frontend – React.js

### Main Pages

**Public Pages**

* Home
* Products
* Product Details
* Login
* Registration

**User Pages**

* My Profile
* My Cart
* Checkout
* My Orders
* Order Details
* Address Management

**Admin Pages**

* Admin Login
* Dashboard
* Product Management
* Category Management
* User Management
* Order Management
* Inventory Management

### React Structure

```text
src/
│
├── components/
├── pages/
│   ├── auth/
│   ├── user/
│   └── admin/
│
├── services/
│   └── api/
│
├── context/
├── hooks/
├── routes/
├── layouts/
├── utils/
└── assets/
```

---

## 7. Technology Stack

| Layer               | Technology                     |
| ------------------- | ------------------------------ |
| Frontend            | React.js                       |
| UI                  | Bootstrap / Material UI        |
| Routing             | React Router                   |
| HTTP Client         | Axios                          |
| Backend             | ASP.NET Core Web API           |
| ORM/Data Access     | Dapper / Entity Framework Core |
| Authentication      | JWT                            |
| Database            | SQL Server                     |
| Database Management | SSMS                           |
| API Documentation   | Swagger                        |
| API Testing         | Postman                        |
| Version Control     | Git & GitHub                   |

---

## 8. Development Flow

```text
React.js
   ↓
Axios
   ↓
ASP.NET Core Web API
   ↓
Service Layer
   ↓
Repository / Dapper
   ↓
SQL Server
```

For the project, a **layered architecture** can be used:

```text
DTFSticker.Web
       ↓
DTFSticker.API
       ↓
DTFSticker.Business
       ↓
DTFSticker.Repository
       ↓
DTFSticker.Database
```

This structure will make the application **modular, reusable, maintainable, and easier to scale** as new features such as payments, coupons, wishlist, reviews, and custom sticker designs are added later.
