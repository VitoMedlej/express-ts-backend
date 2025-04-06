🚀 Express TypeScript Backend – Scalable eCommerce API
Build · Auth · Role-based Routing · Dashboard API · Product Management · CI/CD Ready

Hey there! 🙌
⭐ Star this repo if you find it helpful or use it in your projects!

🌟 Introduction
Welcome to the Express TypeScript Backend – a production-grade, scalable, and feature-rich API server powering the fullstack eCommerce template. Built on top of express-typescript-2024 by @edwinhern and extended with full dashboard features, robust user authentication, AI-driven endpoints, and public-facing API routes.

💡 Motivation
This backend aims to:

🚀 Power a fully customizable eCommerce experience

📦 Support both public (client) and private (admin) routes

🔐 Handle secure, role-based authentication (Auth0 & JWT)

🛒 Enable product creation, filtering, search, and AI recommendations

🧱 Maintain clean, scalable architecture with type safety and modular design

⚙️ Key Features
🧱 Scalable Architecture: Modular structure separated by features and roles (admin/client)

🔄 Role-Based Routing: Admin (dashboard) and Client (frontend) APIs separated for clarity & control

🔐 Auth0 Integration: Auth middleware, JWT validation, and user access control

🛒 Product APIs: CRUD, filtering, search, and recommendation support

📦 Order & Cart Endpoints: (Optional) Easy to extend with cart/order logic

⚙️ Environment-Driven Config: Centralized and type-safe using Envalid

📃 API Docs: Swagger UI auto-generated from Zod schemas

🧪 Testing: Vitest + Supertest for robust backend test coverage

📊 Logging: Fast logging with pino-http

🛡️ Security: Helmet, CORS, rate limiting

🛠️ CI-Ready: Lint, test, and build hooks for clean pipelines

🐳 Docker Support: Easily deployable container config

✨ Built with TypeScript: Full type-safety across the stack

📁 Folder Structure
pgsql
Copy
Edit
/src
  /routes        // Grouped by domain and role
  /controllers   // Logic per route
  /services      // Business logic layer
  /middlewares   // Auth, rate-limit, etc.
  /schemas       // Zod validation schemas
  /types         // Global TS types
🛠️ Getting Started
Step 1: Clone & Install
bash
Copy
Edit
git clone https://github.com/VitoMedlej/express-ts-backend.git
cd express-ts-backend
npm install
Step 2: Configure Environment
bash
Copy
Edit
cp .env.example .env
# then update with your values
Step 3: Run the Server
bash
Copy
Edit
# Development mode
npm run dev

# Build & Start
npm run build && npm start
Server will run at http://localhost:8080

🌐 Public & Private APIs
// To be documented soon!

🧪 Scripts
bash
Copy
Edit
npm run dev        # Start in dev mode
npm run build      # Build production-ready code
npm run start      # Run built code
npm run test       # Run tests
npm run lint       # Lint using Biome
📝 Environment Variables
env
Copy
Edit
# Basic
NODE_ENV="development"
PORT="8080"
HOST="localhost"
IS_PROD="false"

# CORS
CORS_ORIGIN="http://localhost:*"

# Rate Limit
COMMON_RATE_LIMIT_WINDOW_MS="1000"
COMMON_RATE_LIMIT_MAX_REQUESTS="20"

# Auth
JWT_SECRET="your_jwt_secret"
AUTH0_DOMAIN="your-auth0-domain"
AUTH0_AUDIENCE="your-auth0-audience"

# MongoDB
MONGODB_CONNECTION="mongodb+srv://..."
MONGODB_CONNECTION_READONLY="mongodb+srv://..."
MONGO_DB_NAME="your_db"

# AI / Recommender
RECOMBEE_API_KEY="your_key"
RECOMBEE_DATABASE_ID="your_id"
📜 Attribution
This project is heavily based on the excellent work of @edwinhern’s express-typescript-2024 boilerplate, and scaled/customized into a full eCommerce backend with user roles, dashboard support, and external service integrations.

🙌 Feedback & Contributions
Got a suggestion? Found a bug? Open an issue or PR.
Let’s make backend development better, together.
