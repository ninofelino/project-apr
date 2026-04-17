# UMKM Perikanan - AI-Powered Database Management

A modern, mobile-first web application with **AI Chat assistant**, **Google Tasks integration**, and REST APIs for database management. Built with Next.js, Drizzle ORM, Neon PostgreSQL, and OpenRouter AI.

## ✨ Features

### 🤖 AI Chat
- **Natural language database queries** - Ask questions in plain English/Indonesian
- **Auto intent detection** - Automatically understands table names and actions
- **Conversation history** - Multi-turn chat with context
- **Free AI inference** - Uses OpenRouter free tier models (GPT-OSS 120B)
- **Model selector** - Choose from 8+ free AI models
- **Suggested queries** - Quick-start buttons for common queries

### 📋 Google Tasks
- **Google OAuth 2.0** - Secure sign-in via Google Identity Services
- **Full task management** - Create, complete, delete tasks
- **Multiple task lists** - Switch between Google Tasks lists
- **Due dates & notes** - Add context to your tasks
- **Mobile-first design** - Clean, simple interface

### 📊 Data API
- ✅ Single API endpoint for all database operations
- ✅ Built-in help documentation
- ✅ Automatic schema introspection from Neon database
- ✅ Pagination support with limit and offset
- ✅ Type-safe queries with Drizzle ORM

### 🌐 IoT Sensors
- ✅ Full CRUD API for IoT sensor management
- ✅ Filter by pond, status, sensor type
- ✅ Real-time sensor readings
- ✅ Mobile-friendly management UI

### ⭐ Favorite URLs
- ✅ Full CRUD API for bookmarking endpoints
- ✅ Categories, tags, and metadata storage
- ✅ Mobile-first management UI
- ✅ Click-to-copy API endpoints

### 💬 Prompts API
- ✅ External app access with API key auth
- ✅ Full CRUD for AI and Music prompts
- ✅ Search, filter, pagination
- ✅ Two auth methods: Bearer header or query param

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Database** | Neon (Serverless PostgreSQL) |
| **ORM** | Drizzle ORM |
| **AI** | OpenRouter (free tier: GPT-OSS 120B) |
| **Auth** | Google OAuth 2.0 (GIS) |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install:**
```bash
git clone <repo-url>
cd midleware
npm install
```

2. **Configure environment:**
Environment variables are already set in `.env.local` for local development.

3. **Start development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `/` | API documentation dashboard |
| **AI Chat** | `/chat` | Chat with your database |
| **Google Tasks** | `/google-tasks` | Manage Google Tasks |
| **Prompts** | `/prompts` | Manage AI & music prompts |
| **Prompts Seed** | `/prompts/seed` | Seed sample data |
| **IoT Sensors** | `/iot-sensors` | Manage IoT devices |
| **Favorite URLs** | `/favorite-urls` | Bookmark API endpoints |

## 🤖 AI Chat

Access at: `/chat`

The AI chat allows you to query your database using natural language. Simply ask questions like:
- "List all tables in the database"
- "Show me data from users table"
- "How many sensors are there?"
- "Show schema for iot_sensors"

### Available Free Models

| Model | Provider | Description |
|-------|----------|-------------|
| MiniMax M2.5 | MiniMax | Fast, free tier (Recommended) |
| Gemma 4 26B | Google | Free, Google's model |
| Gemma 4 31B | Google | Free, larger version |
| Nemotron 3 120B | NVIDIA | Free, large model |
| Qwen3 Next 80B | Alibaba | Free, powerful |
| GPT-OSS 120B | OpenAI | Free, open-source |
| GLM 4.5 Air | Zhipu AI | Free, efficient |
| Qwen3 Coder | Alibaba | Free, coding focused |

## 📡 API Documentation

### 1. General Data API

**Base URL:** `/api/data`

#### Show Help
```
GET /api/data?help=true
```

#### List All Tables
```
GET /api/data?action=tables
```

**Response:**
```json
{
  "success": true,
  "tables": ["users", "products", "orders", ...],
  "count": 42
}
```

#### Fetch Data from a Table
```
GET /api/data?action=fetch&table=users
```

**With pagination:**
```
GET /api/data?action=fetch&table=users&limit=10&offset=0
```

**Get by ID:**
```
GET /api/data?action=fetch&table=users&id=1
```

**Response:**
```json
{
  "success": true,
  "table": "users",
  "data": [...],
  "count": 10,
  "pagination": {
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Get Table Schema
```
GET /api/data?action=schema&table=users
```

#### Get Record Count
```
GET /api/data?action=count&table=users
```

### 2. AI Chat API

**Base URL:** `/api/chat`

#### Send Message (POST)
```
POST /api/chat
Content-Type: application/json

{
  "message": "Show me all tables",
  "model": "minimax/minimax-m2.5:free"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Here are the tables in your database...",
  "model": "minimax/minimax-m2.5:free",
  "queriedDatabase": true
}
```

#### Get Available Models (GET)
```
GET /api/chat
```

### 3. IoT Sensors API

**Base URL:** `/api/iot-sensors`

#### GET - Retrieve Sensors
```
GET /api/iot-sensors                    # All sensors
GET /api/iot-sensors?id=1               # By ID
GET /api/iot-sensors?pond_id=1          # Filter by pond
GET /api/iot-sensors?status=active      # Filter by status
GET /api/iot-sensors?sensor_type=temperature  # Filter by type
GET /api/iot-sensors?limit=10&offset=0  # Pagination
```

#### POST - Create Sensor
```
POST /api/iot-sensors
Content-Type: application/json

{
  "pond_id": 1,
  "device_id": "SENSOR_001",
  "sensor_type": "temperature",
  "status": "active",
  "last_reading": 25.5,
  "unit": "°C"
}
```

**Required fields:** `pond_id`, `device_id`, `sensor_type`

#### PUT - Update Sensor
```
PUT /api/iot-sensors?id=1
Content-Type: application/json

{
  "status": "maintenance",
  "last_reading": 26.3
}
```

#### DELETE - Delete Sensor
```
DELETE /api/iot-sensors?id=1
```

### 4. Favorite URLs API

**Base URL:** `/api/favorite-urls`

#### GET - Retrieve Favorites
```
GET /api/favorite-urls                  # All favorites
GET /api/favorite-urls?id=1             # By ID
GET /api/favorite-urls?category=api     # Filter by category
GET /api/favorite-urls?is_api=true      # API endpoints only
GET /api/favorite-urls?limit=10&offset=0  # Pagination
```

#### POST - Create Favorite
```
POST /api/favorite-urls
Content-Type: application/json

{
  "title": "My API Endpoint",
  "url": "https://api.example.com/v1/users",
  "description": "User management API",
  "category": "api",
  "tags": ["users", "crud"],
  "method": "GET",
  "headers": {
    "Authorization": "Bearer YOUR_TOKEN"
  },
  "is_api": true
}
```

**Required fields:** `title`, `url`

#### PUT - Update Favorite
```
PUT /api/favorite-urls?id=1
Content-Type: application/json

{
  "title": "Updated Title",
  "category": "production"
}
```

#### DELETE - Delete Favorite
```
DELETE /api/favorite-urls?id=1
```

## 📋 API Parameters

### General Data API

| Parameter | Required | Description |
|-----------|----------|-------------|
| `action` | Yes | One of: `tables`, `fetch`, `schema`, `count` |
| `table` | For most actions | Name of the database table |
| `limit` | No | Maximum records to return (default: 100) |
| `offset` | No | Records to skip for pagination (default: 0) |
| `id` | No | Get specific record by ID |
| `help` | No | Show help documentation |

### AI Chat API

| Parameter | Required | Description |
|-----------|----------|-------------|
| `message` | Yes | User's message/query |
| `model` | No | AI model to use (defaults to configured model) |
| `conversationHistory` | No | Array of previous messages for context |

### 📋 Google Tasks

Google Tasks uses Google OAuth 2.0 via Google Identity Services (GIS).

**Setup:**
1. Create Google Cloud Project
2. Enable Google Tasks API
3. Create OAuth 2.0 credentials
4. Add authorized origins/redirect URIs
5. Set `GOOGLE_AUTH_CLIENT_ID` env var

**Features:**
- Sign in with Google account
- View all task lists
- Create tasks with title, notes, due dates
- Mark tasks as complete/incomplete
- Delete tasks
- Switch between lists

### Prompts API

**Base URL:** `/api/prompts`

| Method | URL | Auth |
|--------|-----|------|
| GET | `/api/prompts?type=ai` | Public |
| POST | `/api/prompts` | API Key |
| PUT | `/api/prompts?id=1` | API Key |
| DELETE | `/api/prompts?id=1` | API Key |

**Auth Methods:**
- Header: `Authorization: Bearer prompts-api-key-2025`
- Query: `?api_key=prompts-api-key-2025`

**Parameters:**

| Parameter | Method | Description |
|-----------|--------|-------------|
| `type` | GET | `ai` or `music` (default: music) |
| `id` | GET/PUT/DELETE | Prompt ID |
| `category` | GET | Filter by category |
| `search` | GET | Search title/content |
| `limit` | GET | Max records (default: 100) |
| `offset` | GET | Pagination offset (default: 0) |

### IoT Sensors API

| Parameter | Method | Description |
|-----------|--------|-------------|
| `id` | GET/PUT/DELETE | Sensor ID |
| `pond_id` | GET | Filter by pond ID |
| `status` | GET | Filter by status (active/inactive/maintenance) |
| `sensor_type` | GET | Filter by sensor type |
| `limit` | GET | Max records (default: 100) |
| `offset` | GET | Pagination offset (default: 0) |

### Favorite URLs API

| Parameter | Method | Description |
|-----------|--------|-------------|
| `id` | GET/PUT/DELETE | Favorite URL ID |
| `category` | GET | Filter by category |
| `is_api` | GET | Filter by API type (true/false) |
| `limit` | GET | Max records (default: 100) |
| `offset` | GET | Pagination offset (default: 0) |

## 🗄️ Database Schema

The application automatically introspects the Neon database and generates the Drizzle schema. The schema is located in `src/drizzle/schema.ts` and includes all tables from your database.

### Current Tables (43+ total)

- `users` - User accounts
- `fish_products` - Fish products catalog
- `fish_auctions` - Fish auctions
- `auction_bids` - Bids on auctions
- `fish_categories` - Fish categories
- `daily_fish_prices` - Daily fish prices
- `umkm_products` - UMKM products
- `iot_sensors` - IoT sensor devices
- `sensor_readings` - Sensor reading data
- `ponds` - Fish ponds
- `favorite_urls` - Favorite URLs and API endpoints
- And more...

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema to database
npm run db:introspect  # Introspect database schema
npm run db:studio    # Open Drizzle Studio
./test-openrouter.sh # Test OpenRouter AI connection
```

## 📁 Project Structure

```
midleware/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts          # AI Chat API (OpenRouter)
│   │   │   ├── data/
│   │   │   │   └── route.ts          # General data API
│   │   │   ├── iot-sensors/
│   │   │   │   └── route.ts          # IoT sensors CRUD API
│   │   │   └── favorite-urls/
│   │   │       └── route.ts          # Favorite URLs CRUD API
│   │   ├── chat/
│   │   │   └── page.tsx              # AI Chat UI
│   │   ├── iot-sensors/
│   │   │   └── page.tsx              # IoT Sensors UI
│   │   ├── favorite-urls/
│   │   │   └── page.tsx              # Favorite URLs UI
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Home page (API docs)
│   ├── db/
│   │   ├── index.ts                  # Database connection
│   │   └── simple.ts                 # Simple db export
│   ├── lib/
│   │   ├── db-query-tool.ts          # Database query executor for AI
│   │   └── schema-summary.ts         # Schema summarizer for AI
│   └── drizzle/
│       └── schema.ts                 # Auto-generated schema
├── scripts/
│   ├── migrate-and-seed.sh           # DB migration script
│   └── seed-favorites.sql            # Seed data
├── .env.local                        # Local environment variables
├── .env.production                   # Production environment variables
├── test-openrouter.sh                # OpenRouter API test script
├── test-gemini.sh                    # Legacy Gemini test script
├── drizzle-studio.sh                 # Drizzle Studio launcher
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── README.md
```

## 🌍 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://...` |
| `OPENROUTER_API_KEY` | OpenRouter AI API key | `sk-or-v1-...` |
| `OPENROUTER_MODEL` | Default AI model | `openai/gpt-oss-120b:free` |
| `GOOGLE_AUTH_CLIENT_ID` | Google OAuth client ID | `xxxxx.apps.googleusercontent.com` |
| `PROMPTS_API_KEY` | API key for prompts API | `prompts-api-key-2025` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | App name for headers | `UMKM Perikanan` |
| `NEXT_PUBLIC_APP_URL` | App URL for headers | `http://localhost:3000` |
| Firebase vars | Firebase configuration | (configured) |
| `JWT_SECRET` | JWT signing secret | (configured) |
| `DISCORD_WEBHOOK_URL` | Discord notifications | (configured) |

## 🚨 Error Handling

All API responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

### Quick Fixes

**AI Chat not working:**
```bash
./test-openrouter.sh  # Test API connection
```

**Server not starting:**
```bash
rm -rf node_modules && npm install
npm run dev
```

**Database connection issues:**
- Verify `DATABASE_URL` in `.env.local`
- Check Neon dashboard for connection status

## 📝 Notes

- Default limit is 100 records to prevent overloading
- Table names are case-sensitive
- Use offset for pagination
- All responses are in JSON format
- Mobile-first minimalist design
- Click-to-copy buttons on all API endpoints
- AI chat uses free tier models (no credits required)

## 📄 License

MIT
