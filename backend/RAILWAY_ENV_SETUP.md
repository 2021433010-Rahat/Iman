# Environment Variables for Railway Deployment

This document lists all the environment variables that need to be configured in Railway for the backend to work properly.

## Required Environment Variables

Set these in Railway Dashboard → Project → Variables:

### Database Configuration
- `MONGODB_URL` - MongoDB connection string (your current Atlas connection)
  - Example: `mongodb+srv://username:password@cluster0.asovgxf.mongodb.net/enentManagement`

### Authentication & Security
- `JWT_SECRET` - Secret key for JWT token generation (recommend using a stronger secret in production)

### Frontend Configuration
- `FRONTEND_URL` - Your frontend application URL (e.g., your Vercel app URL)

### Cloudinary Configuration (for image uploads)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key  
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

### Google Services Configuration
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### AI/Gemini Configuration
- `GEMINI_API_KEY` - Google Gemini API key
- `GEMINI_API_URL` - Gemini API endpoint URL

### Smythos Agent Configuration
- `SMYTHOS_AGENT_URL` - Smythos agent base URL
- `SMYTHOS_GOOGLE_FORM_URL` - Smythos Google Form API endpoint
- `SMYTHOS_GOOGLE_MEET_URL` - Smythos Google Meet API endpoint

### Feature Flags
- `USE_MOCK_FORMS` - Set to "false" for production

### Node Environment
- `NODE_ENV` - Set to "production" for production deployment

## Optional Variables

Railway automatically provides:
- `PORT` - Railway will automatically set this (your app uses process.env.PORT || 8000)
- `RAILWAY_STATIC_URL` - Railway's generated domain (already configured in CORS)

## Security Notes

1. Never commit environment variables to your repository
2. Use strong, unique values for JWT_SECRET
3. Ensure all API keys are kept secure
4. Regularly rotate sensitive credentials