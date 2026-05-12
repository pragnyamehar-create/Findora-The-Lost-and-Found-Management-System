# Lost and Found Management System

A premium, full-stack Lost and Found application built with Node.js, Express, MySQL, and Vanilla JS. It features a modern Glassmorphism UI, real-time polling to keep data in sync, and complete CRUD operations.

## Features
- **Modern Glassmorphism UI**: Beautiful, responsive, dark-mode design with vibrant gradients.
- **Authentication**: JWT-based login and registration.
- **Role-Based Access**: Regular users can post and manage their items. Admins get a dashboard and can manage all items.
- **Image Uploads**: Users can upload images when posting a lost or found item.
- **Real-Time Updates**: The frontend automatically polls the backend every 3 seconds, ensuring the UI reflects changes instantly (even if modified directly in MySQL).
- **Search & Filtering**: Easily search items by title/description or filter by category.

## Prerequisites
- Node.js (v14+)
- MySQL Server

## Setup Instructions

1. **Database Setup**:
   - Open MySQL Workbench or your preferred MySQL client.
   - Run the provided `schema.sql` file to create the database and tables.
   - An initial admin user will be created (`username: admin`, `password: admin123`).

2. **Configuration**:
   - Ensure your MySQL server is running.
   - The `.env` file is pre-configured for a local root user with no password. Update `DB_PASSWORD` or `DB_USER` in `.env` if your MySQL configuration differs.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```

5. **Usage**:
   - Open your browser and navigate to `http://localhost:3000`.
   - Login as `admin` (password: `admin123`) to view the dashboard and manage all items.
   - Register a new user to start posting missing or found items.

## Architecture
- **Backend**: Express.js server providing REST APIs (`/api/auth`, `/api/items`) and serving the static frontend files.
- **Database**: MySQL handling user and item data.
- **Frontend**: A custom Single-Page Application (SPA) built with pure Vanilla JavaScript (`app.js`, `ui.js`, `api.js`) to provide a seamless app-like experience without page reloads.

Enjoy!
