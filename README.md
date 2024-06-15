# E-commerce Application 💻

This repository contains the code for an E-commerce application backend, developed using Express.js and Sequelize ORM for PostgreSQL.

## Table of Contents 📜
- [Installation](#installation)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
  - [Reviews](#reviews)
  - [Wishlist](#wishlist)
- [Middleware](#middleware)
- [Database Relationships](#database-relationships)
- [Running the Application](#running-the-application)
- [License](#license)

---

## Installation 🚀

1. **Clone the repository:**
    ```bash
    git clone https://github.com/2003salar/e-commerce.git
    cd e-commerce-app
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**  
   Create a `.env` file in the root directory and add the following:
    ```dotenv
    PG_USER=your_postgres_user
    PG_PASSWORD=your_postgres_password
    PG_HOST=your_postgres_host
    PG_PORT=your_postgres_port
    PG_DATABASE=your_postgres_database
    ```

4. **Run the application:**
    ```bash
    npm start
    ```

---

## Database Models 🗃️

The application uses Sequelize to define the following models:

- Users
- Categories
- Products
- Orders
- OrderItems
- Addresses
- Reviews
- WishlistItems
- Session

The models are defined in `models.js`, including their relationships.

---

## API Endpoints 🌐

### Reviews 🌟

#### Create a Review

- **POST `/reviews/:id`**

Creates a review for a specified product.

- **Request Parameters:**
  - `id` (required): The product ID.

- **Request Body:**
  - `rating` (required): The rating of the product (1 to 5).
  - `comment` (optional): The review comment.

- **Response:**
  - `201 Created` on success
  - `400 Bad Request` if the product ID or rating is invalid
  - `404 Not Found` if the product is not found

---

### Wishlist 🎁

#### Get All Products in the Wishlist

- **GET `/wishlist`**

Retrieves a list of all products in the wishlist.

- **Response:**
  - `200 OK` with the list of products in the wishlist
  - `500 Internal Server Error` on server error

#### Add a Product to the Wishlist

- **POST `/wishlist/:id`**

Adds a product to the wishlist.

- **Request Parameters:**
  - `id` (required): The product ID.

- **Response:**
  - `201 Created` on success
  - `400 Bad Request` if the product ID is invalid or if the item already exists in the wishlist
  - `404 Not Found` if the product is not found

#### Remove a Product from the Wishlist

- **PATCH `/wishlist/:id`**

Removes a product from the wishlist.

- **Request Parameters:**
  - `id` (required): The product ID.

- **Response:**
  - `200 OK` on successful removal
  - `400 Bad Request` if the product ID is invalid
  - `404 Not Found` if the item is not found in the wishlist

---

### Search Products

#### Search Products by Name

- **GET `/search`**

Searches for products by name.

- **Query Parameters:**
  - `name` (required): The name or partial name of the product to search for.

--- 

## Middleware 🛡️

The application uses a custom middleware `isUserAuthenticated` to protect routes that require authentication. This middleware checks if the user is authenticated before allowing access to the route.

---

## Database Relationships 🔄

- Users have many Orders
- Categories have many Products
- Orders have many OrderItems
- Products have many OrderItems
- Users have many Addresses
- Users have many Reviews
- Products have many Reviews
- Users have many WishlistItems
- Products have many WishlistItems

These relationships are defined in the `models.js` file.

---

## Running the Application 🏃‍♂️

1. Start the PostgreSQL database.

2. Run the application:
    ```bash
    npm start
    ```

The application will be available at http://localhost:3000.

---
