# Blockchain-Based Voting System (Educational Prototype)

A BCA-level web app demonstrating:
- Voter registration/login with hashed passwords (bcrypt) + JWT auth
- One-voter-one-vote enforcement (backend-atomic, not just frontend)
- Identity/ballot-choice separation (Vote records never store *who* voted)
- Daily vote aggregation → sealed into a custom SHA-256 hash-linked blockchain block
- Admin dashboard: election/candidate management, blockchain explorer, tamper-detection demo

**This is not a real election system.** It's a teaching tool for how hash-linking makes
tampering *detectable*, not how to run a legally binding election.

---

## 1. Requirements

- Node.js 18+
- MongoDB running locally (`mongod`) or a free MongoDB Atlas cluster

---

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set:
- `MONGO_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string
- `ADMIN_VOTER_ID` / `ADMIN_PASSWORD` — credentials for the first admin account

Create the admin account (run once):

```bash
node utils/createAdmin.js
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` — you should see `{"status":"ok"}`.

---

## 3. Frontend Setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 4. Demo Flow (matches the college presentation script)

1. Go to `/admin/login`, log in with the admin credentials from `.env`.
2. **Election Management** → create an election with today as start date.
3. Set its status to `ACTIVE` (dropdown next to the election).
4. **Candidate Management** → select that election → add 2-3 candidates.
5. Open an incognito window (or log out) → **Register** 2-3 demo voter accounts.
6. Log in as a voter → **Vote** → pick a candidate → submit.
7. Try voting again as the same voter → you'll get "You have already voted."
8. Back in the admin dashboard, watch **Total Votes** and the results bars update.
9. Click **Create Daily Block** — this aggregates today's votes into Block #1 and shows its hash.
10. Vote with another demo account, then **Create Daily Block** again (this creates a *new* day's block if you want to simulate day 2, or just show a second block for the same day for demo purposes).
11. Open **Blockchain Explorer** → see blocks stacked with `Previous Hash` visibly linking to the block above.
12. Click **Verify Blockchain** → should show ✅ Valid.
13. Scroll to **Tamper Demo** → enter an existing block's index, a candidate name from that block, and a fake vote count → submit.
14. Click **Verify Blockchain** again → 🚨 should now flag that block's hash as inconsistent.

---

## 5. Key Architectural Notes (for your project report / viva)

- **Why aggregate daily instead of one block per vote?** The spec calls for `1 Day = 1 Blockchain Block`. Individual votes stay in MongoDB (`Vote` collection); only the day's *totals* get sealed into a block. This keeps the chain small and mirrors how a real tally-certification system might batch results.
- **Why no `voterId` on the `Vote` model?** To logically separate identity from ballot choice. The `Voter` collection only tracks *whether* someone voted (`hasVoted`), never *what* they chose.
- **Why `findOneAndUpdate({ hasVoted: false }, { hasVoted: true })` instead of "check then update"?** A plain "read hasVoted, then if false write true" has a race condition: two simultaneous requests could both read `false` before either writes. Doing the check-and-set as a single atomic MongoDB operation closes that gap.
- **Why sort object keys before hashing?** `JSON.stringify` on an object doesn't guarantee key order is preserved identically across all engines/runs. Sorting keys first ensures the *same data* always produces the *same hash*, which is essential for verification to work correctly.
- **Blockchain limitation to state explicitly in your report:** hash-linking makes tampering *detectable after the fact*, not *impossible*. A real decentralized blockchain would need multiple independent nodes and a consensus mechanism, which this single-server prototype does not implement.

---

## 6. Project Structure

```
blockchain-voting-system/
├── backend/     (Node/Express/MongoDB API + custom blockchain module)
└── frontend/    (React/Vite/Tailwind UI)
```

See inline comments in `backend/blockchain/Block.js` and `backend/blockchain/Blockchain.js`
for the core hashing/verification logic — that's the heart of the "blockchain" part of this project.
