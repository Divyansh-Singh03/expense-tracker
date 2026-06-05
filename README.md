# 💸 Expense Tracker

A full-stack expense tracking application built with React, Node.js, Express, and MongoDB. Users can log daily expenses across categories, filter by date and category, view spending summaries, and export data as CSV.

## Live Demo

- **Frontend:** https://expense-tracker-chi-five-92.vercel.app
- **Backend:** https://expense-tracker-api-rwcf.onrender.com

> Note: The backend is hosted on Render's free tier and may take 30–50 seconds to wake up on the first request.

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React + Vite | Fast dev server, modern tooling |
| Styling | Plain CSS | Full control, no extra dependencies |
| Charts | Recharts | Simple, composable React chart library |
| HTTP Client | Axios | Clean API, easy error handling |
| Backend | Node.js + Express | Lightweight, familiar REST API setup |
| Database | MongoDB Atlas + Mongoose | Flexible schema, free cloud hosting |
| Deployment | Vercel (frontend) + Render (backend) | Free tier, easy GitHub integration |

## How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free) with a cluster

### 1. Clone the repo
```bash
git clone https://github.com/Divyansh-Singh03/expense-tracker.git
cd expense-tracker
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
MONGO_URI=your_mongodb_connection_string
PORT=5000

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` folder:
VITE_API_URL=http://localhost:5000/api

Start the frontend:
```bash
npm run dev
```

App will be running at `http://localhost:5173`

## API Documentation

Base URL: `https://expense-tracker-api-rwcf.onrender.com/api`

### Get All Expenses
GET /expenses
Query params (optional):
- `category` — filter by category (Food, Transport, Bills, Entertainment, Other)
- `startDate` — filter from date (YYYY-MM-DD)
- `endDate` — filter to date (YYYY-MM-DD)

Response:
```json
[
  {
    "_id": "abc123",
    "amount": 250,
    "category": "Food",
    "date": "2026-06-05T00:00:00.000Z",
    "note": "Lunch",
    "createdAt": "2026-06-05T12:00:00.000Z"
  }
]
```

### Get Monthly Summary
GET /expenses/summary
Response:
```json
{
  "totalThisMonth": 4500,
  "perCategory": {
    "Food": 1200,
    "Transport": 800
  },
  "highest": {
    "amount": 1500,
    "category": "Bills",
    "note": "Electricity"
  }
}
```

### Add Expense
POST /expenses
Request body:
```json
{
  "amount": 250,
  "category": "Food",
  "date": "2026-06-05",
  "note": "Lunch"
}
```

### Update Expense
PUT /expenses/:id
Request body: same as POST (all fields optional)

### Delete Expense
DELETE /expenses/:id
Response:
```json
{ "message": "Expense deleted" }
```

## Project Structure
expense-tracker/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── expenseApi.js     # All API calls (axios)
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx   # Add/edit expense form
│   │   │   ├── ExpenseTable.jsx  # Expenses list + CSV export
│   │   │   ├── FilterBar.jsx     # Category + date filters
│   │   │   ├── SummaryPanel.jsx  # Monthly totals
│   │   │   └── ExpenseChart.jsx  # Pie chart (Recharts)
│   │   ├── App.jsx               # Root component, state management
│   │   └── App.css               # Global styles (dark theme)
│   └── package.json
│
├── server/                   # Node.js backend (Express)
│   ├── db/
│   │   └── connect.js            # MongoDB connection
│   ├── models/
│   │   └── Expense.js            # Mongoose schema
│   ├── routes/
│   │   └── expenses.js           # All REST endpoints
│   ├── index.js                  # Express app entry point
│   └── package.json
│
└── README.md

## Next Steps

- **Authentication** — add user login so multiple users can track expenses separately
- **Budget limits** — set per-category monthly budget with visual warnings when exceeded
- **Recurring expenses** — mark expenses as recurring (monthly bills etc.)
- **Better mobile UI** — bottom navigation, swipe to delete on mobile
- **Tests** — add Jest tests for backend routes (validation, CRUD operations)
- **Search** — search expenses by note/description

## Notes

- AI tools (Claude) were used to assist with boilerplate and debugging. All code has been reviewed and understood.
- Backend on Render free tier sleeps after inactivity — first request may take ~50 seconds.
