# 👕 Carbon Closet

---

## 🛍️ Overview

**Carbon Closet** is a gamified thrift e-commerce platform that streamlines buying, selling, and donating vintage clothes. It aims to save users time while encouraging sustainable fashion through an engaging token and gacha reward system.

---
Demo Video: https://youtu.be/Rzp-D-KonUo
## 💡 Problem

College students and parents struggle to find sustainable, affordable thrifted clothing easily. We solve this by combining e-commerce with gamification, making second-hand shopping simple and fun.

---

## 🔧 Features

### 🛒 Buying & Selling (Shop)

- **Sell clothes**: Users can list their clothes. We take a small fee and handle logistics.
- **Earn tokens**: Sellers receive tokens as a reward.
- **Curated marketplace**: Buyers enjoy a curated feed of vintage and second-hand items.

### 🎁 Donations

- **Clothing donations**: Users can donate clothes and receive tokens in return.
- **Value assessment**: Items are valued using eBay price data via web scraping.

### 🎲 Gacha System

- **Tiered rewards**: Items are ranked (e.g., *Standard* tier for affordable $20 items).
- **Pack animations**: Gacha spins come with engaging pack-opening visuals.
- **Reroll feature** *(planned)*: Users can reroll for different items.
- **Token-based draws**: Use tokens (earned or purchased) to spin for items.

---
## Technologies Used
- Firebase: Backend-as-a-Service (BaaS) platform from Google that simplifies app development by providing various hosted backend services. It helps developers build and scale web and mobile apps without managing servers, offering features like authentication, databases (Realtime Database, Firestore), storage, hosting, and more.
- Next.js: Frontend framework primarily used for building web applications, particularly those that need to be fast, SEO-friendly, and scalable.
- Flask: Python microframework used for building web applications

## Setup Instructions 

### 1. Clone the Repository

```
git clone https://github.com/uuriah/LeBroncoHacks.git
```
### 2. Install Dependencies

#### Front-End:
```
cd frontend
npm install
```

#### Back-End:
```
cd backend
pip install flask flask-cors firebase-admin bs4 pandas
```

### 3. Start the Application

Open two separate terminal windows:

**Terminal 1 (Back-end):**
Navigate to the back-end directory and run:
```
flask --app app run
```

**Terminal 2 (Front-end):**

Navigate to the front-end directory and run the following command:
```bash
npm run dev
```

### 4. Access the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser.
---
