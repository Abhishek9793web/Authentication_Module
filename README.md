# 💬 Real-Time Chat Application API

> A feature-rich, real-time chat backend built with **Node.js**, **Express.js**, **MongoDB**, **Socket.IO**, and **JWT authentication**.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![JWT](https://img.shields.io/badge/JWT-authentication-FF5722?logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#-api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Conversation Endpoints](#conversation-endpoints)
  - [Message Endpoints](#message-endpoints)
  - [Notification Endpoints](#notification-endpoints)
- [Real-Time Events (WebSocket)](#-real-time-events-websocket)
- [Project Structure](#-project-structure)
- [Usage Examples](#-usage-examples)
  - [Register a User](#register-a-user)
  - [Login & Get Token](#login--get-token)
  - [Send a Message](#send-a-message)
- [Error Handling](#-error-handling)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

This project is a **production-ready** real-time chat API that powers multi-user conversations with instant messaging and smart notifications. It includes:

- **RESTful APIs** for authentication, conversations, messages, and notifications
- **WebSocket (Socket.IO)** for real-time message delivery and presence tracking
- **JWT-based authentication** securing all protected routes and socket connections
- **Intelligent notifications** — users are only notified when they are **not** actively viewing the conversation

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Register, login, and JWT-protected profile access |
| 💬 **Conversations** | Create group conversations and dynamically add participants |
| 📨 **Real-Time Messaging** | Messages delivered instantly via Socket.IO when a user is connected to a conversation room |
| 🔔 **Smart Notifications** | Database notifications created only for users who are **not** actively viewing the conversation |
| ✅ **Read Receipts** | Mark individual notifications as read |
| 👤 **Active Chat Tracking** | In-memory tracking of which conversation a user is currently viewing |
| 🛡️ **Security** | Passwords hashed with bcrypt, all protected routes verified via JWT |
| 🗂️ **MongoDB Persistence** | All users, messages, conversations, and notifications stored in MongoDB |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org) | JavaScript runtime |
| [Express.js](https://expressjs.com) | Web framework for REST APIs |
| [MongoDB](https://mongodb.com) + [Mongoose](https://mongoosejs.com) | NoSQL database & ODM |
| [Socket.IO](https://socket.io) | Real-time bidirectional communication |
| [JWT (jsonwebtoken)](https://jwt.io) | Stateless authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |

---

## 🧰 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v16 or higher)
- [MongoDB](https://mongodb.com) (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud URI)
- A REST client (e.g., [Postman](https://postman.com), [Insomnia](https://insomnia.rest), or `curl`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start the server
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/your-database-name

# JWT secret key (use a strong, random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Server port (optional, defaults to 3000)
PORT=3000
```

> ⚠️ **Security Note**: Never commit your `.env` file to version control. Add it to `.gitignore`.

---

## 📡 API Documentation

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | ❌ No | Register a new user |
| `POST` | `/api/login` | ❌ No | Login and receive JWT token |
| `GET` | `/api/profile` | ✅ Yes | Get authenticated user's profile |


---

### Conversation Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/conversations` | ✅ Yes | Create a new conversation |
| `GET` | `/api/conversations` | ✅ Yes | Get all conversations for the logged-in user |
| `POST` | `/api/conversations/:conversationId/participants` | ✅ Yes | Add participants to a conversation |
| `POST` | `/api/conversations/:conversationId/active` | ✅ Yes | Mark a conversation as the user's active chat |
| `DELETE` | `/api/conversations/:conversationId/active` | ✅ Yes | Mark active chat as inactive |



## 📁 Project Structure

```
project-root/
│
├── config/
│   └── db.js                     # MongoDB connection setup
│
├── controllers/
│   ├── authController.js         # Register, login, profile
│   ├── conversationController.js # CRUD for conversations
│   ├── messageController.js      # Send & get messages
│   └── notificationController.js # Get & mark notifications
│
├── middleware/
│   └── authMiddleware.js         # JWT verification middleware
│
├── models/
│   ├── User.js                   # User schema (name, email, password)
│   ├── Conversation.js           # Conversation schema (participants)
│   ├── Message.js                # Message schema (conversation, sender, text)
│   └── Notification.js           # Notification schema (sender, receiver, isRead)
│
├── routes/
│   ├── authRoutes.js             # /api/register, /api/login, /api/profile
│   ├── chatRoutes.js             # /api/conversations, /api/messages
│   └── notificationRoutes.js     # /api/notifications
│
├── services/
│   ├── activeChatService.js      # In-memory active chat tracking
│   └── notificationService.js    # Smart notification creation logic
│
├── socket/
│   └── socketHandler.js          # Socket.IO authentication & event handlers
│
├── .env                          # Environment variables (not committed)
├── .gitignore
├── package.json
├── server.js                     # Application entry point
└── README.md                     # This file
```

---



