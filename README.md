# Stone._.Craft - Buy Product Platform

E-commerce platform for stone craft kits with admin dashboard.

## Features

- 🛍️ Product shop with cart & wishlist
- 👤 User authentication & account management
- 📦 Order tracking with status timeline
- 👨‍💼 Admin panel for order management
- 💳 Payment integration (Razorpay, Stripe)
- 📧 Email notifications

## Tech Stack

**Frontend:**
- React 19.2.7
- Vite 8.1.1
- Tailwind CSS 4.3.3
- React Router DOM 7.18.3

**Backend:**
- Node.js + Express
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication

## Setup

### Local Development

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd Buy-Product
   npm install
   cd server && npm install
   ```

2. **Environment variables:**
   ```bash
   # Copy .env.example and fill in your credentials
   cp .env.example .env
   cp server/.env.example server/.env
   ```

3. **Start backend (Terminal 1):**
   ```bash
   cd server
   node index.js
   ```

4. **Start frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

Access at `http://localhost:5173`

### Vercel Deployment

#### Frontend Only (Recommended)

1. Push to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import repository
4. **Build Settings:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables:**
   - `VITE_API_URL`: Your backend API URL

6. Deploy!

#### Full Stack (Frontend + Backend)

For backend on Vercel, you need a separate deployment:

**Option A: Deploy backend to Railway/Render/Heroku**
```bash
# Push only server/ folder
# Configure environment variables there
# Update VITE_API_URL in Vercel to point to your backend
```

**Option B: Serverless API Routes (Vercel Functions)**
- Create `api/` folder in root
- Vercel will auto-deploy Node functions
- Requires restructuring backend to serverless format

## Project Structure

```
Buy-Product/
├── src/                    # React frontend
│   ├── Components/         # React components
│   ├── Context/           # Context API
│   ├── assets/            # Images, fonts
│   └── App.jsx
├── server/                # Express backend
│   ├── routes/            # API endpoints
│   ├── models/            # MongoDB schemas
│   ├── services/          # Business logic
│   ├── .env               # Backend env (DO NOT COMMIT)
│   └── index.js           # Server entry
├── public/                # Static files
├── .env                   # Frontend env (DO NOT COMMIT)
├── .env.example           # Template
├── .gitignore            # Git ignore rules
├── vercel.json           # Vercel config
├── vite.config.js        # Vite config
├── tailwind.config.js    # Tailwind config
└── package.json          # Dependencies
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-api-domain.com
```

### Backend (server/.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend-domain.com
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

## Deployment Checklist

- [ ] Push to GitHub
- [ ] Set environment variables in Vercel
- [ ] Verify MongoDB Atlas IP whitelist allows Vercel IPs
- [ ] Test login, checkout, and admin panel
- [ ] Update `VITE_API_URL` after backend deployment
- [ ] Test email notifications

## Admin Access

- Go to `/admin`
- Requires `isAdmin: true` in user account
- Manage orders, update status, add tracking

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
npm run lint     # Run ESLint
```

## Important Notes

⚠️ **DO NOT commit:**
- `.env` files (frontend and backend)
- `node_modules/`
- `.next/`, `dist/`, `build/` folders

✅ **Always commit:**
- `.env.example` (template)
- Source code
- Configuration files

## Support

For issues or questions, check the [Issues](https://github.com) section.

---

Made with ❤️ for Stone._.Craft
