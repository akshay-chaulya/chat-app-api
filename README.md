# Chat App Backend

This is the backend of a chat application built using Express.js, Prisma ORM, and Socket.io for real-time messaging. The app supports user authentication, messaging, and user search functionalities. It includes routes for user signup, login, logout, and chat messaging with JWT-based protection.

## Features

- **User Authentication**: Signup, login, and logout using JWT for secure user sessions.
- **Messaging**: Send and receive real-time messages using Socket.io.
- **User Management**: Search for users and view all registered users.
- **Protected Routes**: Ensure only authenticated users can access certain routes using JWT middleware.

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
