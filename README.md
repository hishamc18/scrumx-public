# ScrumX — Smart Project & Team Management Platform
Live:- https://scrumx.vercel.app/

---![1740895004039](https://github.com/user-attachments/assets/73c0cf9d-282f-44e0-b513-33e1e7d0352c)

**ScrumX** is a full-stack, modern project management tool designed to help individuals and teams plan, collaborate, and execute projects seamlessly. From Kanban boards to real-time chat and video calls — ScrumX brings everything into one place.

---

## 🚀 Tech Stack

### 🔷 Frontend
- **Next.js** (with TypeScript)
- **Tailwind CSS** & **ShadCN UI**
- **Redux Toolkit** (state management)
- **Axios** (API interaction)

### 🔷 Backend
- **Express.js**
- **Controller–Service–Route–Middleware** architecture
- **JWT & Cookies** for session management
- **Passport.js** for Google Auth
- **SendGrid** for transactional emails
- **Cloudinary** for image storage
- **Gemini AI** chatbot integration

---

## 🔐 Authentication & Security

- Google authentication with **Passport.js**
- **JWT + Cookie** session management
- **OTP verification** to prevent spam accounts
- Role-based access control: `Admin`, `Lead`, and `Member`

---

## 📦 Features

### 🧑‍💼 Project & Team Management
- Create **individual or group projects**
- **Invite team members via email** (SendGrid)
- Assign **roles** to users in each project
- Role-based permissions and access

### 📊 Kanban Board
- Built using **DND Kit** (Drag & Drop)
- Organize tasks with dynamic statuses
- Assign tasks to project members

### 📝 Sticky Notes
- Create and manage sticky notes with a clean, minimal UI

### 💬 Real-time Chat
- **Individual & group chats** inside each project
- Group chat includes **all members** in a project

### 🎥 Meetings & Calls (Streamlit)
- **Video calling**, **group calling**, and **live meetings**
- **Schedule meetings**, **screen share**, and **chat during calls**
- Streamlit integration for seamless real-time collaboration

### 🤖 Gemini AI Chatbot
- Integrated **Gemini chatbot** for global access
- Users can search or ask anything from within the app


## 🌐 Deployment & Hosting

- **Hosted on AWS EC2**
- **Nginx + Route 53** for routing & SSL
- Domain purchased from **Hostinger**
- **Production-grade deployment** with auto-restart and SSL certification

---

## ⚙️ Backend Highlights

- Modular architecture (Controllers, Services, Routes, Middleware)
- **Global & custom error handling**
- **OTP verification**, **email invites**, and **secure sessions**

---
