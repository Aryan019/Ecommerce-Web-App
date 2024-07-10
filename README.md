# Product Management System

Welcome to Product Management System, a product management system built with Node.js, Express, and MongoDB. 
This application allows you to manage products, with features for adding, editing, deleting, and sorting products by price.
 It also includes user authentication for secure access to product management functionalities.

## 🚀 Features

- **Product Management**: CRUD operations for managing products including name, price, rating, and company.
- **User Authentication**: Secure login and registration system for user access.
- **Sorting**: Sort products by price categories such as over 1000, under 1000, and featured items.
- **Featured Products**: Display and manage featured products separately.
- **Data Management**: Utility scripts for seeding initial data and clearing product data.

## 📂 Project Structure

- **index.js**: Main entry point for the Node.js server.
- **seeds.js**: Seed script to populate initial products into MongoDB.
- **dataClear.js**: Utility script to clear all product data from MongoDB.
- **views/**: Contains EJS templates for rendering HTML views.
- **models/**: Mongoose models for defining Product and User schemas.

## 🔧 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (mongoose ORM)
- **Frontend Templating**: EJS (Embedded JavaScript)
- **Authentication**: Express session, bcrypt for password hashing
- **Deployment**: Local server (port 3000)

## 🚀 Getting Started

To run the project locally:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Define `DB_URL` for MongoDB connection
4. Seed initial data (optional): `node seeds.js`
5. Start the server: `node index.js`
6. Open your browser and go to `http://localhost:3000`

## 🌐 API Endpoints

- **GET `/allProducts`**: Retrieve all products.
- **GET `/products/new`**: Form to add a new product.
- **POST `/productsNew`**: Add a new product.
- **GET `/products/:id/edit`**: Edit form for a specific product.
- **PUT `/products/:id`**: Update a specific product.
- **DELETE `/products/:id`**: Delete a specific product.
- **GET `/featuredProducts`**: Retrieve all featured products.
- **GET `/products/:sort`**: Sort products by price categories.
- **GET `/login`**: Login form for user authentication.
- **POST `/login`**: Handle user login authentication.
- **GET `/register`**: Registration form for new users.
- **POST `/register`**: Handle user registration.

## 📝 Additional Notes

- Ensure MongoDB is running locally or update `DB_URL` for remote databases.
- Handle authentication securely in production environments.
- Customize views and styles in `views/` for frontend UI enhancements.

---

- Developed by Aryan Vyas
- Contact me on email - aryan19v@gmail.com 
- Enjoy managing your products efficiently🚀
