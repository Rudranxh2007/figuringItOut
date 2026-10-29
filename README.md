# PulseFit — Daily Workout Schedule & Progress Tracker (MERN)

A modern full-stack MERN application for planning weekly workout routines, logging daily workout notes and sets, tracking body weight progression, and viewing Personal Records (PRs).

---

## 🚀 Live Services

- **Frontend (React + Tailwind CSS):** [http://localhost:5173](http://localhost:5173)
- **Backend API (Node.js + Express):** [http://localhost:5000](http://localhost:5000)
- **Database:** MongoDB on `mongodb://127.0.0.1:27017/workout_tracker`

---

## 🌟 Key Features

1. **Dashboard & Consistency Streak**
   - Consecutive daily streak counter (🔥)
   - 7-Day interactive activity strip
   - Total volume lifted (kg/lbs) across all logged sets
   - Quick "Log Today's Body Weight" input card
   - Resume or start today's workout in one click

2. **Daily Workout Note & Logger (`/daily`)**
   - Full date navigator: step through past/future dates or select any day via the calendar
   - Workout Routine title, duration timer, and daily reflection/notes textarea
   - Apply saved routine split with 1 click to auto-load exercise sets
   - Interactive Set tables: Set #, Weight, Reps, and Completed checkbox
   - Search & Add exercise modal with muscle group filter tabs
   - "Mark Workout Completed" celebratory toggle

3. **Routine Splits & Planner (`/planner`)**
   - Create custom workout routines (Push, Pull, Legs, Upper, Lower, Cardio, etc.)
   - Assign days of the week to your splits (Mon, Wed, Fri, etc.)
   - Define target sets and target rep ranges
   - Direct "Log This Routine Today" shortcut

4. **Progress & Analytics (`/progress`)**
   - Interactive Body Weight area chart (Recharts) with net change calculations
   - Personal Records (PR) Hall of Fame automatically computed from your highest successful lifts
   - Logged weight and body fat % history table with deletion controls

5. **Exercise Library (`/exercises`)**
   - 20+ pre-seeded standard exercises across Chest, Back, Legs, Shoulders, Arms, Core, and Cardio
   - Create your own custom exercises with equipment tags and execution notes

---

## 🗄️ MongoDB Compass Inspection

Open **MongoDB Compass** and connect to:
```
mongodb://127.0.0.1:27017
```
Look for the `workout_tracker` database:
- `users`: User profiles with hashed passwords & goal preferences
- `exercises`: Catalog of standard and custom exercises
- `workoutlogs`: Daily workout records with sets, reps, weight, duration, and completion status
- `workoutplans`: Routine templates with assigned days of week
- `bodymetrics`: Daily weight and body fat % records

---

## 🛠️ How to Run

From the root project folder:

```bash
# Run both Backend and Frontend concurrently:
npm run dev

# Or run separately:
npm run server    # Backend on http://localhost:5000
npm run client    # Frontend on http://localhost:5173
```

