# Deploy to Railway - Step by Step Guide

This guide will help you deploy your Node.js backend to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. All required environment variables ready (see `RAILWAY_ENV_SETUP.md`)

## Deployment Steps

### Step 1: Create a New Project on Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo" (or GitLab/Bitbucket)
4. Choose your repository: `2021433010-Rahat/Iman`
5. Railway will automatically detect it's a Node.js project

### Step 2: Configure Environment Variables

1. In your Railway project dashboard, click on your service
2. Go to the "Variables" tab
3. Add all the environment variables listed in `RAILWAY_ENV_SETUP.md`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
   - Add others as needed for your specific features

### Step 3: Configure Database (if using MongoDB)

Option A: Use MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Set `MONGODB_URI` in Railway variables

Option B: Use Railway's MongoDB addon
1. In Railway, click "New" → "Database" → "Add MongoDB"
2. Railway will provide connection details
3. Use the provided connection string for `MONGODB_URI`

### Step 4: Deploy

1. Railway will automatically deploy when you push to your main branch
2. You can also manually trigger deployments from the Railway dashboard
3. Monitor the deployment logs in the Railway dashboard

### Step 5: Configure Your Domain

1. Railway provides a default domain like `your-app.up.railway.app`
2. You can add a custom domain in the "Settings" tab if needed
3. Update your frontend to use the Railway domain for API calls

### Step 6: Update Frontend CORS

Make sure your frontend URL is added to the CORS configuration. The backend is already configured to accept:
- `process.env.FRONTEND_URL` (set this in Railway variables)
- `process.env.RAILWAY_STATIC_URL` (automatically provided by Railway)

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify database connection
- [ ] Check authentication flow
- [ ] Test file uploads (if using Cloudinary)
- [ ] Verify email functionality (if applicable)
- [ ] Test Google API integrations (if applicable)

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Environment Variables**: Ensure all required variables are set
3. **Database Connection**: Verify MongoDB URI is correct
4. **CORS Errors**: Make sure frontend URL is in CORS origins
5. **Port Issues**: Railway handles ports automatically, ensure your app uses `process.env.PORT`

### Checking Logs:

1. Go to your Railway project dashboard
2. Click on your service
3. Check the "Deployments" tab for build logs
4. Check the "Observability" tab for runtime logs

## Railway CLI (Optional)

You can also use Railway CLI for more control:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy from terminal
railway up
```

## Automatic Deployments

Railway automatically deploys when you push to your connected branch. To set this up:

1. Go to "Settings" → "Source"
2. Ensure "Auto-Deploy" is enabled
3. Set the branch you want to deploy from (usually `main`)

Your backend is now successfully deployed to Railway! 🚀