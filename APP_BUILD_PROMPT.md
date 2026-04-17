# Application Build Prompt

## Project: UMKM Perikanan - AI-Powered Database Management

Create a modern, mobile-first web application that allows users to query a PostgreSQL database using natural language through an AI chat interface. The app should provide RESTful APIs for data access, IoT sensor management, and URL bookmarking.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Database** | Neon (Serverless PostgreSQL) |
| **ORM** | Drizzle ORM |
| **AI Provider** | OpenRouter (free tier models) |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel |

---

## Core Features

### 1. AI Chat Interface (`/chat`)
- Natural language database querying
- Auto intent detection (tables, actions, queries)
- Multi-turn conversation with history
- Free AI models via OpenRouter (`:free` suffix models)
- Model selector dropdown with 8+ free models
- Suggested starter queries on empty chat
- Typing indicator animation
- Enter-to-send, mobile-optimized input

### 2. General Data API (`/api/data`)
- Single endpoint for all database operations
- Actions: `tables`, `fetch`, `schema`, `count`
- Pagination support (limit, offset)
- Record lookup by ID
- Dynamic schema introspection from database
- JSON responses with consistent format

### 3. IoT Sensors CRUD (`/api/iot-sensors` + `/iot-sensors`)
- Full REST API: GET, POST, PUT, DELETE
- Filter by: pond_id, status, sensor_type
- Pagination support
- Mobile-first management UI
- Form validation

### 4. Favorite URLs CRUD (`/api/favorite-urls` + `/favorite-urls`)
- Full REST API: GET, POST, PUT, DELETE
- Categories, tags, metadata storage
- Filter by: category, is_api
- Mobile-first management UI
- Click-to-copy endpoint URLs

### 5. Home Dashboard (`/`)
- API documentation overview
- Clickable API endpoint links
- Copy-to-clipboard buttons
- Quick stats (tables count, etc.)
- Mobile-first responsive design

---

## Project Structure

```
midleware/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts          # AI Chat API
│   │   │   ├── data/
│   │   │   │   └── route.ts          # General data API
│   │   │   ├── iot-sensors/
│   │   │   │   └── route.ts          # IoT sensors CRUD
│   │   │   └── favorite-urls/
│   │   │       └── route.ts          # Favorite URLs CRUD
│   │   ├── chat/
│   │   │   └── page.tsx              # AI Chat UI
│   │   ├── iot-sensors/
│   │   │   └── page.tsx              # IoT Sensors UI
│   │   ├── favorite-urls/
│   │   │   └── page.tsx              # Favorite URLs UI
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Home dashboard
│   ├── db/
│   │   ├── index.ts                  # Database connection
│   │   └── simple.ts                 # Simple db export
│   ├── lib/
│   │   ├── db-query-tool.ts          # Query executor for AI
│   │   └── schema-summary.ts         # Schema summarizer
│   └── drizzle/
│       └── schema.ts                 # Auto-generated schema
├── scripts/
│   ├── migrate-and-seed.sh
│   └── seed-favorites.sql
├── .env.local
├── .env.production
├── test-openrouter.sh
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://owner:password@host/dbname?sslmode=require

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=minimax/minimax-m2.5:free

# App Config
NEXT_PUBLIC_APP_NAME=UMKM Perikanan
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
FIREBASE_API_KEY=...
JWT_SECRET=...
DISCORD_WEBHOOK_URL=...
```

---

## AI Chat API Implementation (`/api/chat/route.ts`)

### Key Components:

1. **System Prompt Generator**
   - Injects live database schema
   - Defines AI behavior and available actions
   - Sets response formatting rules

2. **Query Intent Parser**
   - Extracts table names from natural language
   - Detects actions: tables, fetch, schema, count
   - Parses parameters: id, limit, offset
   - Falls back to keyword matching

3. **Database Query Executor**
   - Executes parsed queries via Drizzle ORM
   - Returns structured results
   - Handles errors gracefully

4. **OpenRouter Integration**
   - Endpoint: `https://openrouter.ai/api/v1/chat/completions`
   - Headers: Authorization, HTTP-Referer, X-Title
   - Message format: OpenAI-compatible (system/user/assistant)
   - Free models use `:free` suffix (e.g., `minimax/minimax-m2.5:free`)

5. **Response Handler**
   - Returns AI reply with model info
   - Includes database query flag
   - Error handling with proper status codes

### Available Free Models:
```
minimax/minimax-m2.5:free          (default)
google/gemma-4-26b-a4b-it:free
google/gemma-4-31b-it:free
nvidia/nemotron-3-super-120b-a12b:free
qwen/qwen3-next-80b-a3b-instruct:free
openai/gpt-oss-120b:free
z-ai/glm-4.5-air:free
qwen/qwen3-coder:free
```

---

## UI Design Principles

### Mobile-First Minimalist
- Design for mobile first, scale up for desktop
- Clean, simple, no clutter
- White space is your friend
- Simple color palettes
- Functional over decorative

### Key UI Components

1. **Message Bubbles**
   - User messages: Right-aligned, blue gradient
   - AI responses: Left-aligned, gray background
   - Markdown rendering for data tables
   - Timestamp on each message

2. **Model Selector**
   - Dropdown at top of chat
   - Shows current model name
   - Lists all available free models

3. **Suggested Queries**
   - Displayed when chat is empty
   - 5 clickable starter queries
   - Click to auto-send query

4. **Loading States**
   - Typing indicator (bouncing dots)
   - Disabled input while loading
   - Error messages in red

---

## API Response Format

### Success
```json
{
  "success": true,
  "data": {...},
  "count": 10
}
```

### Error
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Chat Response
```json
{
  "success": true,
  "reply": "AI response text...",
  "model": "minimax/minimax-m2.5:free",
  "queriedDatabase": true
}
```

---

## Database Schema

The app uses Drizzle ORM with automatic introspection. Key tables:

- `users` - User accounts
- `iot_sensors` - IoT sensor devices
- `sensor_readings` - Sensor data
- `ponds` - Fish ponds
- `fish_products` - Product catalog
- `favorite_urls` - Bookmarked endpoints
- 37+ more tables

All queries use parameterized SQL to prevent injection.

---

## Build & Deploy

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
```bash
# Push to GitHub
git add -A && git commit -m "message"
git push origin master

# Deploy to Vercel
vercel deploy --prod --yes

# Set environment variables
vercel env add OPENROUTER_API_KEY production
vercel env add OPENROUTER_MODEL production
```

---

## Testing

### Test AI Connection
```bash
./test-openrouter.sh
```

Expected: `✅ OpenRouter API test successful!`

### Manual API Tests
```bash
# Data API
curl http://localhost:3000/api/data?help=true

# Chat API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "List all tables"}'

# IoT Sensors
curl http://localhost:3000/api/iot-sensors

# Favorite URLs
curl http://localhost:3000/api/favorite-urls
```

---

## Error Handling

1. **API Level**
   - 400 for bad requests
   - 404 for not found
   - 500 for server errors
   - Consistent JSON error format

2. **Client Level**
   - Error display in chat UI
   - Form validation feedback
   - Network error handling
   - User-friendly messages

3. **Database Level**
   - Table existence checks
   - SQL error catching
   - Connection pool management
   - Graceful degradation

---

## Key Implementation Details

### Chat Flow
1. User sends message → `/api/chat`
2. `parseQueryIntent()` extracts intent
3. `queryDatabase()` executes SQL query
4. Results + schema sent to OpenRouter API
5. AI response returned to client
6. Client displays response with markdown

### Query Intent Detection
- Keyword matching for common actions
- Regex patterns for table extraction
- Parameter parsing (id, limit, offset)
- Fallback to table name database

### Security Considerations
- Parameterized SQL queries
- Input sanitization
- Rate limiting (Vercel built-in)
- No secrets in client code
- Environment variable validation

---

## Performance Optimizations

- Server Components for static content
- Dynamic imports for heavy components
- Database connection pooling
- Response caching where appropriate
- Minimal client-side JavaScript
- Optimized Tailwind CSS builds

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `openrouter/free is not valid` | Use `:free` suffix models like `minimax/minimax-m2.5:free` |
| Server won't start | `rm -rf node_modules && npm install` |
| DB connection failed | Verify `DATABASE_URL` in `.env.local` |
| AI returns 404 | Check model ID is valid free model |
| Port 3000 in use | `lsof -ti:3000 | xargs kill -9` |

---

## Future Enhancements

- [ ] Streaming AI responses
- [ ] Image/file upload support
- [ ] WebSocket real-time updates
- [ ] User authentication system
- [ ] Query history & bookmarks
- [ ] Export data (CSV, JSON)
- [ ] Dashboard with charts
- [ ] Multi-database support
- [ ] Custom AI prompts per user
- [ ] API rate limiting dashboard
