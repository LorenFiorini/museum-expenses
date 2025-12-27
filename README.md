# Museum Expenses Dashboard

A full-stack web application for visualizing and analyzing museum trustee and director expenses.

## Features

- User authentication (sign up, login)
- Excel file upload and parsing
- Interactive dashboard with charts and data tables
- Expense and gifts/hospitality tracking

## Local Development

### Prerequisites

- Node.js (v18 or later)
- npm

### Setup

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Run the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on http://localhost:4000

4. **Run the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## Deployment to Vercel

This project is configured for deployment on Vercel.

### Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Vercel CLI (optional, for CLI deployment)

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import project to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect the settings from `vercel.json`

3. **Set environment variables:**
   - In your Vercel project settings, go to "Environment Variables"
   - Add `JWT_SECRET` with a secure random string (e.g., generate one using `openssl rand -base64 32`)
   - Optionally set `VITE_API_BASE` if you need to override the API URL

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

4. **Set environment variables:**
   ```bash
   vercel env add JWT_SECRET
   # Enter a secure random string when prompted
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Environment Variables

- `JWT_SECRET` (required): A secret key for JWT token signing. Use a strong, random string in production.
- `VITE_API_BASE` (optional): Override the API base URL. Leave empty for relative paths (recommended for Vercel).

### Project Structure

- `/src` - React frontend application
- `/api` - Vercel serverless functions (Express API)
- `/server` - Original Express server (for local development)
- `/data` - Sample Excel files

### Important Notes

⚠️ **User Storage**: The current implementation uses in-memory storage for users. This means:
- Users are lost when the serverless function restarts
- For production, consider using a database like Vercel Postgres, MongoDB, or similar

⚠️ **File Uploads**: File parsing is done client-side. No server-side file storage is required.

### Troubleshooting

- **API not working**: Ensure `JWT_SECRET` is set in Vercel environment variables
- **Build fails**: Check that all dependencies are in the root `package.json`
- **CORS errors**: The API is configured to allow all origins in production

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Type check TypeScript

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Recharts
- **Backend**: Express.js, JWT, bcryptjs
- **Deployment**: Vercel

