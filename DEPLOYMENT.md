# Deployment Guide

This guide will help you deploy the BookMySlot application to Vercel (frontend) and Render (backend).

## Backend Deployment (Render)

### Step 1: Deploy Backend to Render

1. **Sign up/Login to Render**: Go to [render.com](https://render.com) and create an account

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `BookMySlot` repository

3. **Configure the Service**:
   - **Name**: `bookmyslot-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**:
   - Go to "Environment" tab
   - Add the following variables:
     - `PYTHON_VERSION`: `3.9.18`

5. **Create PostgreSQL Database**:
   - Go to "New +" → "PostgreSQL"
   - Name it `bookmyslot-db`
   - Copy the connection string

6. **Link Database to Web Service**:
   - In your web service settings
   - Add environment variable:
     - `DATABASE_URL`: (paste the PostgreSQL connection string)

7. **Deploy**: Click "Create Web Service"

### Step 2: Get Backend URL

After deployment, note your backend URL (e.g., `https://bookmyslot-backend.onrender.com`)

## Frontend Deployment (Vercel)

### Step 1: Deploy Frontend to Vercel

1. **Sign up/Login to Vercel**: Go to [vercel.com](https://vercel.com) and create an account

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Select the `bookmyslot-frontend` directory

3. **Configure Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add:
     - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com`
     (Replace with your actual Render backend URL)

4. **Deploy**: Click "Deploy"

### Step 2: Update CORS (if needed)

If you get CORS errors, update the backend CORS configuration in `main.py` to include your Vercel domain:

```python
allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://your-app-name.vercel.app",  # Add your Vercel URL
    "https://*.vercel.app",
],
```

## Testing the Deployment

1. **Test Backend**: Visit your Render backend URL + `/docs` (e.g., `https://bookmyslot-backend.onrender.com/docs`)

2. **Test Frontend**: Visit your Vercel frontend URL and try creating an event

## Database Information

**Current Setup**: SQLAlchemy with SQLite (local) / PostgreSQL (production)
- **Local Development**: Uses SQLite database (`bookmyslot.db`)
- **Production**: Uses PostgreSQL database on Render
- **Models**: Event, TimeSlot, Booking (SQLAlchemy ORM)

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend CORS configuration includes your Vercel domain
2. **Database Connection**: Ensure the PostgreSQL connection string is correct
3. **Environment Variables**: Double-check that `REACT_APP_API_URL` is set correctly in Vercel

### Logs:
- **Render**: Check the "Logs" tab in your web service
- **Vercel**: Check the "Functions" tab for any build errors

## Local Development

For local development, the frontend will automatically use `http://127.0.0.1:8000` as the API URL. 