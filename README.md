# Full Stack Developer Entry Exam - E-Commerce Project

## Overview

This project is a simplified e-commerce application that includes frontend development. It features authentication, an admin panel for managing products and categories with drag-and-drop ordering, and a customer-side shopping experience.

## Features

### 1. Authentication

- User registration and login.
- Password handling with BCrypt for encryption.
- JWT-based authentication for enhanced security.

### 2. Admin Panel (Product & Category Management)

- CRUD operations for products (title, description, price) and categories (title, description).
- Drag-and-drop functionality to reorder products and categories.
- Persistent ordering stored in the database.

### 3. Customer Interface

- Displays categories and products after authentication.
- Users can add products to a shopping cart.


## Tech Stack

### **Frontend**

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, Material-UI (MUI)
- **Interactivity:** dnd-kit (for drag-and-drop functionality)


## Setup & Installation

Follow these steps to clone the project and run it locally:

### **Clone the Repository**

```sh
 git clone https://github.com/Firas-safa/exam.git
```

```sh
 cd exam
```



### **Set Up the Frontend**

#### **a. Navigate to the frontend folder**

```sh
 cd frontend
```

#### **b. Install Dependencies**

```sh
 npm install  # or yarn install
```

#### **c. Start the Development Server**

```sh
 npm run dev  # or yarn dev
```

The frontend should now be running on `http://localhost:3000/`.

### **Test Authentication & Features**

- Register a new user.
- Log in and access the product categories.
- Use the admin panel to add, update, delete, and reorder products and categories.
- Try the drag-and-drop functionality and verify that ordering is saved.

## Additional Notes

- If using JWT authentication, ensure the frontend sends authentication tokens in API requests.
- If running the project in production, configure environment variables properly.
- Ensure the database is running before starting the backend server.

## License

This project is for educational and evaluation purposes only. Feel free to modify and improve it.

---

If you have any issues or questions, feel free to reach out!

