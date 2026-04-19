# ReviewPlus — AI-Powered Google Review Generator

ReviewPlus helps local businesses (restaurants, salons, auto shops, etc.) collect more 5-star Google reviews automatically. Customers scan a QR code, rate their visit, and Gemini AI writes a polished review for them to post on Google — in seconds.

---

## Features

- **AI-Generated Reviews** — Gemini AI converts casual customer feedback into authentic, polished Google reviews
- **QR Code Campaigns** — Generate QR codes to place on receipts, tables, or packaging
- **Smart Routing** — Happy customers (4–5 stars) are guided to Google; unhappy ones leave private feedback only you see
- **Dashboard** — Manage campaigns, track reviews, monitor conversion stats
- **Framer Motion UI** — Smooth, premium animations throughout the landing page
- **JWT Auth** — Secure signup/login with token-based authentication

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini AI (`@google/generative-ai`) |
| Auth | JWT + bcryptjs |
| QR Codes | `qrcode` npm package |

---

## Project Structure

```
ReviewPlus/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios client with auth interceptor
│   │   ├── components/      # Navbar
│   │   ├── context/         # AuthContext (JWT state)
│   │   └── pages/
│   │       ├── Landing.jsx  # Public marketing page
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       ├── Dashboard.jsx
│   │       ├── CampaignCreate.jsx
│   │       ├── CampaignDetail.jsx
│   │       └── ReviewFlow.jsx  # Customer-facing review page
│   └── package.json
│
├── server/                  # Node/Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── middleware/auth.js   # JWT middleware
│   ├── models/              # Mongoose models (User, Campaign, Review)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── campaigns.js
│   │   ├── reviews.js
│   │   └── ai.js            # Gemini AI integration
│   ├── server.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API key — [aistudio.google.com](https://aistudio.google.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/amitdabe013/ReviewPlus.git
cd ReviewPlus
```

---

### 2. Set up the Server

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GOOGLE_API_KEY=your_google_ai_studio_key
CLIENT_URL=http://localhost:5173
```

> **GOOGLE_API_KEY** — Get it from [aistudio.google.com](https://aistudio.google.com) → Get API Key → Create API key in new project

Start the server:

```bash
npm run dev
```

Server runs on `http://localhost:5001`

---

### 3. Set up the Client

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`

---

### 4. How it Works

1. **Business owner** signs up and creates a campaign (business name + Google review link)
2. **QR code** is generated — print it on receipts, menus, or display it at the counter
3. **Customer scans** the QR code on their phone
4. They pick a star rating (1–5)
5. **4–5 stars** → Gemini AI generates 4 review options → customer picks one → copied to clipboard → redirected to Google Reviews
6. **1–3 stars** → Private thank-you message, feedback stays internal

---

## Environment Variables Reference

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Express server (default: 5001) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GOOGLE_API_KEY` | Google AI Studio API key |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) |

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register a new business account |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user info |

### Campaigns
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Create a new campaign |
| GET | `/api/campaigns/:id` | Get campaign details |
| PATCH | `/api/campaigns/:id` | Update campaign (pause/activate) |
| DELETE | `/api/campaigns/:id` | Delete a campaign |

### Reviews
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/reviews/campaign/:id/public` | Public campaign info (for ReviewFlow) |
| POST | `/api/reviews/:campaignId` | Submit a customer review |

### AI
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/generate` | Generate review options via Gemini AI |

---

## Deployment

### Client (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

Set environment variable on the hosting platform:
```
VITE_API_URL=https://your-backend-url.com
```

### Server (Render / Railway / Fly.io)
Set all variables from `server/.env` in your hosting dashboard.

---

## Contact

Interested in using ReviewPlus for your business?

[![WhatsApp](https://img.shields.io/badge/WhatsApp-Chat-25D366?logo=whatsapp&logoColor=white)](https://wa.me/918552948957?text=I%20would%20like%20to%20try%20ReviewPlus)

---

## License

MIT
