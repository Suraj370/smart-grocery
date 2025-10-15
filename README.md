# 🛒 Smart Grocery — AI-Powered Grocery Management Platform

> _Where smart automation meets daily essentials._  
> Smart Grocery is a **modular full-stack ecosystem** combining **Spring Boot**, **Angular**, and **Express.js (AI layer)** to redefine how users manage grocery lists.  
> It’s built to be **intelligent, scalable, and human-centric** — turning routine grocery tasks into adaptive digital experiences.

---

## 🚀 Vision

Traditional grocery apps just store lists.  
**Smart Grocery** elevates the experience — bringing:

- 🧠 **AI-assisted suggestions**
- 🔒 **Enterprise-grade authentication**
- 🔄 **Dynamic real-time list management**
- 🧩 **Separation of concerns** through a microservice-inspired architecture  

This setup allows scalability, maintainability, and future AI expansion without breaking the core logic.

---

🌍 Why We Built It

* We built Smart Grocery to:

*  Simplify household planning with automation

* Merge AI reasoning with traditional CRUD systems

* Showcase real-world integration of multi-stack technologies (Java, Node, Angular)

* Demonstrate clean separation of concerns in modern enterprise architecture
* 

## 🏗️ System Architecture

Here’s how the ecosystem flows end-to-end 👇

```
                       ┌───────────────────────────┐
                     │        Angular App        │
                     │  (Material UI + Signals)  │
                     └────────────┬──────────────┘
                                  │
                                  │ REST + JSON
                                  ▼
        ┌─────────────────────────────────────────────────────────┐
        │                         Backend                         │
        │─────────────────────────────────────────────────────────│
        │                                                         │
        │     ┌──────────────────────────┐        ┌───────────────────────────┐
        │     │   Spring Boot Service    │        │   Express.js AI Service   │
        │     │ (Auth + Grocery Manager) │        │ (Gemini Integration API)  │
        │     ├──────────────────────────┤        ├───────────────────────────┤
        │     │ • JWT Authentication     │        │ • Receives grocery items  │
        │     │ • CRUD for Lists/Items   │        │ • Calls Gemini API        │
        │     │ • MySQL Persistence │        │ • Returns AI Suggestions  │
        │     └─────────────┬────────────┘        └─────────────┬─────────────┘
        │                   │                                   │
        │                   │                                   │
        │                   ▼                                   ▼
        │          ┌───────────────────┐             ┌───────────────────────┐
        │          │  MySQL DB    │             │  Google Gemini API 🧠 │
        │          │  (Data Storage)   │             │  (AI Model Backend)   │
        │          └───────────────────┘             └───────────────────────┘
        └─────────────────────────────────────────────────────────┘
                                  
```
## 🧰 Tech Stack

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | Angular 18 + Material 3 | Modern UI, signals-based reactivity |
| **Backend Core** | Spring Boot 3 (Java 21) | Auth, CRUD, persistence |
| **Database** | PostgreSQL | Persistent storage via JPA |
| **AI Service** | Express.js (TypeScript) | Handles Gemini integration |
| **AI Engine** | Google Gemini 2.5 Flash | AI-powered grocery recommendations |
| **Validation** | Hibernate Validator + Zod | Data integrity and schema enforcement |
| **Auth** | JWT (Spring Security) | Secure token-based authentication |

---

## ⚙️ Core Features

### 🔐 Authentication
- User registration, login, JWT-based sessions  
- Role-based access control  
- Password encryption (BCrypt)

### 🧾 Grocery Management
- Create, edit, and delete grocery lists  
- Manage items (quantity, units, category)  
- Real-time updates and error handling  

### 🤖 AI Suggestion Engine
- Express.js service connects to **Gemini API**
- Receives existing items → generates contextual suggestions  
- Cleans and validates model output with **Zod schemas**  
- Returns production-safe JSON  

### 🎨 Frontend Highlights
- Angular Material UI  
- Signals for reactive updates  
- AI suggestions displayed as **interactive cards**  
- Seamless state synchronization with backend  

---



