# 500 Internal Server Error - Debugging Guide

## Error Overview
```
POST https://iman-production.up.railway.app/api/event/68de53e…/generate-registration-form 500 (Internal Server Error)
```

## Root Cause Analysis

The 500 Internal Server Error when calling the `generate-registration-form` endpoint is most likely caused by one of the following issues:

### 1. **Authentication Issues** (Most Common)
   - **Missing JWT Token**: The frontend is not sending the authentication token in cookies
   - **Expired Token**: The user's session has expired
   - **Invalid Token**: The token is malformed or signed with a different secret
   - **CORS Issues**: Cross-origin requests are not sending cookies properly

### 2. **SmythOS API Issues**
   - The SmythOS form generation service might be down or timing out
   - Network connectivity issues between backend and SmythOS

### 3. **Database Issues**
   - Event not found
   - User not found in database

## Fixes Applied

### 1. Enhanced Error Logging in Authentication Middleware (`middlewares/isAuth.js`)
- Added detailed console logging for all authentication steps
- Shows which stage failed (no token, invalid token, expired token, user not found)
- Provides helpful hints in error messages

```javascript
console.log('=== AUTH MIDDLEWARE CALLED ===');
console.log('Request URL:', req.url);
console.log('Cookies present:', Object.keys(req.cookies || {}).length > 0);
```

### 2. Enhanced Error Handling in Event Controller (`controllers/event.controller.js`)
- Added comprehensive error logging in `generateEventRegistrationForm`
- Logs full error stack, error type, and all relevant details
- Returns more descriptive error messages to frontend

```javascript
console.error('=== EVENT REGISTRATION FORM GENERATION ERROR ===');
console.error('Error type:', error.name);
console.error('Error message:', error.message);
console.error('Full error object:', JSON.stringify(error, null, 2));
```

### 3. Added Debug Route (`routes/event.routes.js`)
- New endpoint: `GET /api/event/:eventId/check-auth`
- Use this to test if authentication is working before calling the main endpoint

```javascript
eventRouter.get("/:eventId/check-auth", isAuth, (req, res) => {
  res.json({ 
    success: true, 
    message: "Authentication successful",
    user: { id: req.userId, email: req.user?.email }
  });
});
```

### 4. Global Error Handler (`index.js`)
- Catches all unhandled errors across the application
- Logs detailed error information for debugging
- Returns user-friendly error messages

## How to Debug the Issue

### Step 1: Check Server Logs
```bash
cd "/home/apurbo/Java /Iman/backend"
tail -f server.log
```

Look for:
- `=== AUTH MIDDLEWARE CALLED ===` - Shows if auth middleware is being executed
- `❌ No token found in cookies` - Indicates missing authentication
- `=== EVENT REGISTRATION FORM GENERATION ERROR ===` - Shows actual error details

### Step 2: Test Authentication
Before calling the form generation endpoint, test authentication with the new debug route:

```bash
curl -X GET \
  https://iman-production.up.railway.app/api/event/{eventId}/check-auth \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "id": "user_id_here",
    "email": "user@example.com"
  }
}
```

**Expected Response (Failure):**
```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "hint": "Please login again to get a valid authentication token"
}
```

### Step 3: Check Frontend Cookie Configuration

Make sure the frontend is configured to send cookies with requests:

#### Using Axios:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://iman-production.up.railway.app',
  withCredentials: true  // CRITICAL: This sends cookies
});
```

#### Using Fetch:
```javascript
fetch('https://iman-production.up.railway.app/api/event/...', {
  method: 'POST',
  credentials: 'include',  // CRITICAL: This sends cookies
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

### Step 4: Verify User is Logged In

Before calling the form generation endpoint, ensure:
1. User has successfully logged in
2. JWT token is stored in cookies (check browser DevTools → Application → Cookies)
3. Token has not expired

## Common Solutions

### Solution 1: User Needs to Login Again
If the token is missing or expired:
```javascript
// Frontend: Redirect to login
window.location.href = '/login';
```

### Solution 2: Enable Credentials in API Calls
Update all API calls to include credentials:
```javascript
// In your API service file
axios.defaults.withCredentials = true;
```

### Solution 3: Check CORS Configuration
Ensure the frontend URL is in the CORS allowed origins list in `backend/index.js`:
```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-domain.com",
  // Add your frontend URL here
];
```

### Solution 4: Verify SmythOS Service
Test the SmythOS endpoint directly:
```bash
curl -X POST https://cmfw5qbmfxvnkjxgtpjoabofw.agent.a.smyth.ai/api/generate_google_form \
  -H "Content-Type: application/json" \
  -d '{
    "formTitle": "Test Form",
    "formDescription": "Test Description",
    "editorEmail": "test@example.com"
  }'
```

## Expected Error Messages by Issue Type

| Issue | HTTP Status | Error Message | Solution |
|-------|-------------|---------------|----------|
| No Token | 401 | "Access denied. No token provided." | Login again |
| Invalid Token | 401 | "Invalid token." | Login again |
| Expired Token | 401 | "Token expired." | Login again |
| User Not Found | 401 | "Access denied. User not found." | Check database |
| SmythOS Timeout | 408 | "Form generation timed out..." | Retry request |
| SmythOS Down | 503 | "Unable to connect to form generation service..." | Check SmythOS status |
| Event Not Found | 404 | "Event not found" | Verify event ID |

## Testing Checklist

- [ ] Server logs show authentication middleware is called
- [ ] JWT token is present in browser cookies
- [ ] Token is not expired (check JWT payload)
- [ ] User exists in database
- [ ] Event exists in database
- [ ] SmythOS service is accessible
- [ ] Frontend sends `withCredentials: true` or `credentials: 'include'`
- [ ] CORS is properly configured

## Next Steps

1. **Monitor server logs** when the error occurs to see exact failure point
2. **Test the debug endpoint** to verify authentication works
3. **Check browser DevTools** for cookie issues
4. **Verify frontend configuration** for credential sending
5. **Contact SmythOS support** if the service is down

## Additional Resources

- JWT Token Decoder: https://jwt.io
- Cookie Debugging: Chrome DevTools → Application → Cookies
- Network Tab: Check if cookies are sent with requests
- Server Logs: `tail -f backend/server.log`

---

**Date**: 2025-10-02  
**Status**: Debugging improvements applied, awaiting testing
