# PLSP Repository Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Free)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Connect GitHub repo
4. Deploy automatically

### Option 2: Render (Free Tier)
1. Push code to GitHub  
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repo

### Option 3: Netlify + Railway
- **Frontend**: Deploy to Netlify (free)
- **Backend**: Deploy to Railway (free)

## Environment Variables for Production

```env
# Server (.env)
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend-url.com
```

## Pre-Deployment Checklist

- [ ] Change default admin password
- [ ] Set up email credentials
- [ ] Update FRONTEND_URL in .env
- [ ] Test all functionality locally
- [ ] Push to GitHub

## Domain Setup (Optional)

1. Buy domain (Namecheap, GoDaddy)
2. Point to deployment URL
3. Update FRONTEND_URL

## Database

- SQLite database auto-creates on first run
- No additional database setup needed
- Data persists between deployments

## File Uploads

- Images/PDFs stored in `/uploads` folder
- Persists on most hosting platforms
- For production: consider cloud storage (AWS S3)

## Security Notes

- Change JWT_SECRET for production
- Use strong admin password
- Enable HTTPS (automatic on most platforms)
- Set up proper email credentials
