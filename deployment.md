# Deployment

## Live URL
- Frontend URL: https://defence-coffe-brew.vercel.app/
- Backend URL: https://coffe-brewumuzibackend.onrender.com

## Planned Deployment Approach
- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## Environment Variables
Backend requires:
- DATABASE_URL
- NODE_ENV
- FRONTEND_URL
- PORT (provided by Render in production)

Frontend may require:
- VITE_API_BASE_URL
- VITE_API_PROXY_TARGET (local development)

## Deployment Notes and Troubleshooting
1. What was tried
- Created Render backend service with root directory set to backend
- Set build command to install dependencies and run Prisma generation and db sync
- Set start command to npm start
- Deployed frontend to Vercel and connected environment variables

2. Errors seen
- 404 NOT_FOUND when calling /api/setup-db on Vercel domain
- Browser GET request used for an endpoint that expects POST

3. Fix attempts
- Updated frontend API client to use VITE_API_BASE_URL in production
- Kept local Vite proxy for development only
- Added Vite env typing file for TypeScript compatibility
- Verified backend CORS FRONTEND_URL and API URL wiring

4. Final status
- Deployed and reachable:
	- https://defence-coffe-brew.vercel.app/
	- https://coffe-brewumuzibackend.onrender.com
