# Deployment Environment Setup

## Problem
The frontend and backend are deployed to different platforms (frontend on Vercel, backend on Render), but they're not properly configured to communicate with each other due to missing environment variables and CORS mismatches.

## Solution Required

### 1. Vercel (Frontend Deployment) - REQUIRED ⚠️

Go to your Vercel project settings and add this environment variable:

**Setting Name:** `REACT_APP_API_URL`  
**Value:** `https://resumix-yucj.onrender.com`

Steps:
1. Go to https://vercel.com/dashboard
2. Select your Resumix project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://resumix-yucj.onrender.com`
   - Select environments: **Production** (and Preview/Development if needed)
5. Click **Save**
6. **Redeploy** your frontend (or trigger a new deployment)

**Local Development:**
- Keep `REACT_APP_API_URL=http://localhost:5000` in your `.env` file
- Vercel will override this with the production value for deployed builds

### 2. Render (Backend Deployment) - REQUIRED ⚠️

Go to your Render service settings and add this environment variable:

**Setting Name:** `CLIENT_URL`  
**Value:** `https://resumix-ten.vercel.app`

Steps:
1. Go to https://dashboard.render.com
2. Select your Resumix backend service
3. Go to **Environment**
4. Add a new environment variable:
   - Name: `CLIENT_URL`
   - Value: `https://resumix-ten.vercel.app`
5. Click **Save Changes**
6. The service will automatically redeploy

### 3. Backend CORS Configuration - DONE ✅

The backend (`server.js`) has been updated to:
- Accept requests from both `localhost:3000` and deployed Vercel frontend
- Properly handle CORS headers with credentials
- Allow all necessary HTTP methods and headers

### 4. Verification Checklist

After deploying, test the login flow:
1. Go to https://resumix-ten.vercel.app
2. Try to sign up or log in with email/Google
3. Check browser DevTools → Console and Network tab:
   - **No CORS errors** ✅
   - Network request to `/auth/login` should succeed with status 200 ✅
   - Token should be stored in localStorage ✅
   - Dashboard should load user data ✅

### Common Issues & Solutions

**"Access denied by CORS policy" error in browser console**
- Frontend environment variable `REACT_APP_API_URL` not set on Vercel
- Backend `CLIENT_URL` environment variable not set on Render
- Verify both are set and the deployment has restarted

**"Cannot GET /auth/login" (404 error)**
- Backend is not running or redeployed
- Check Render dashboard to confirm service is active

**Dashboard shows blank/no user data despite successful login**
- Frontend is still using old `localhost:5000` URL
- Verify `.env` variable was set on Vercel AND build was redeployed
- Clear browser cache and localStorage, then refresh

**Old token stored in localStorage prevents login**
- Clear browser storage: DevTools → Application → Storage → Clear All
- Then refresh and try login again
