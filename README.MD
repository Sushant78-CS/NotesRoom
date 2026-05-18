# NotesRoom

A modern collaborative notes and file sharing application built with React Native, Expo, and Spring Boot.

---

## Features

- JWT Authentication
- Access Token & Refresh Token Flow
- Persistent Login using SecureStore
- Protected Routes
- Create and Join Groups
- Invite Code Based Group Joining
- Group Member Management
- Admin Controls
- Upload and Share Files
- Download Shared Files
- Delete Shared Files
- Dark & Light Theme Support
- Modern Mobile UI
- Axios Interceptors
- Refresh Token Handling
- Zustand State Management

---

# Tech Stack

## Frontend

- React Native
- Expo
- Expo Router
- TypeScript
- Zustand
- Axios
- Expo SecureStore

## Backend

- Spring Boot
- Spring Security
- JWT Authentication
- PostgreSQL
- Hibernate / JPA
- Cloudinary

---

# Folder Structure

```txt
app/
 ├── (auth)
 ├── (tabs)
 ├── group

components/
api/
store/
hook/
```

---

# Authentication

- JWT based authentication
- Secure token storage
- Automatic token refresh
- Persistent sessions
- Protected navigation

---

# Main Functionalities

## Authentication

- Login
- Signup
- Logout
- Persistent Login

## Groups

- Create Group
- Join Group
- Leave Group
- Delete Group
- Invite Code System
- View Group Members

## File Sharing

- Upload Files
- Download Files
- Share Files
- Delete Files
- View Shared Files

## UI Features

- Dark Mode
- Responsive UI
- Smooth Loading States
- Modern Card Design
- Modal Based Actions

---

# Backend Configuration

Create:

```txt
src/main/resources/application.properties
```

Example:

```properties
spring.application.name=
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=
spring.jpa.show-sql=
spring.jpa.properties.hibernate.dialect=

jwt.secretKey=
jwt.refresh-ttl=

cloudinary.cloud_name=
cloudinary.api_key=
cloudinary.api_secret=

Admin_Password=

spring.servlet.multipart.enabled=
spring.servlet.multipart.max-file-size=
spring.servlet.multipart.max-request-size=

spring.datasource.hikari.maximum-pool-size=
spring.datasource.hikari.minimum-idle=
spring.datasource.hikari.idle-timeout=
spring.datasource.hikari.max-lifetime=
spring.datasource.hikari.connection-timeout=
spring.datasource.hikari.keepalive-time=

server.address=
```

---

# Frontend Setup

## Install Dependencies

```bash
npm install
```

or

```bash
bun install
```

---

# Start Expo App

```bash
npx expo start
```

or

```bash
bunx expo start
```

---

# Start Backend

## Linux / Mac

```bash
./mvnw spring-boot:run
```

## Windows

```bash
mvnw.cmd spring-boot:run
```

---

# API Features

- JWT Authentication
- Refresh Token Rotation
- Group APIs
- File Upload APIs
- Member Management APIs

---

# Screens

- Login Screen
- Signup Screen
- Home Screen
- Group Screen
- Members Screen
- Profile Screen
- File Sharing Screen

---

# Future Improvements

- Real-time Chat
- Push Notifications
- Group Avatars
- File Preview
- Search & Filtering

---

# Author

Sushant Sonkamble

GitHub:
https://github.com/Sushant78-CS
