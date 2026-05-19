# WealthNexus AI – API Specification

Complete REST API specification for backend implementation.

## Base URL
```
https://api.wealthnexus.ai/v1
```

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "xp": 0,
    "level": 1,
    "streak": 0,
    "createdAt": "2026-02-26T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /auth/me
Get current user profile (protected).

**Response (200 OK):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "xp": 1250,
  "level": 5,
  "streak": 7
}
```

### PUT /auth/profile
Update user profile (protected).

**Request Body:**
```json
{
  "name": "Jane Doe",
  "avatar": "https://..."
}
```

### POST /auth/logout
Logout and invalidate token (protected).

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 📊 Market Data Endpoints

### GET /market/stocks/:symbol
Get real-time stock quote.

**Parameters:**
- `symbol` (string) - Stock symbol (e.g., AAPL)

**Response (200 OK):**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 185.50,
  "change": 2.35,
  "changePercent": 1.28,
  "volume": 54328900,
  "marketCap": "2.85T",
  "pe": 29.5,
  "high": 186.80,
  "low": 183.20,
  "open": 184.00,
  "previousClose": 183.15,
  "timestamp": "2026-02-26T16:00:00Z"
}
```

### GET /market/chart/:symbol
Get historical price data.

**Parameters:**
- `symbol` (string) - Stock symbol
- `timeframe` (query) - "1D" | "1W" | "1M" | "3M" | "1Y"

**Response (200 OK):**
```json
{
  "symbol": "AAPL",
  "timeframe": "1W",
  "data": [
    { "time": "2026-02-20", "value": 180.50 },
    { "time": "2026-02-21", "value": 182.30 },
    // ...
  ]
}
```

### GET /market/trending
Get trending stocks.

**Response (200 OK):**
```json
{
  "stocks": [
    { /* stock data */ },
    // ...
  ]
}
```

### GET /market/search
Search for stocks.

**Parameters:**
- `q` (query) - Search query

**Response (200 OK):**
```json
{
  "results": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "type": "stock",
      "exchange": "NASDAQ"
    },
    // ...
  ]
}
```

---

## 🤖 AI Prediction Endpoints

### GET /ai/predict/:symbol
Get AI price prediction for a stock.

**Parameters:**
- `symbol` (string) - Stock symbol
- `timeframe` (query) - "1D" | "1W" | "1M"

**Response (200 OK):**
```json
{
  "symbol": "AAPL",
  "currentPrice": 185.50,
  "predictedPrice": 192.30,
  "confidence": 78.5,
  "direction": "up",
  "timeframe": "1W",
  "factors": [
    "Strong market momentum",
    "Positive earnings report",
    "Increased institutional buying"
  ],
  "modelVersion": "v2.1.0",
  "generatedAt": "2026-02-26T10:00:00Z"
}
```

### GET /ai/sentiment/:symbol
Get AI sentiment analysis for a stock.

**Response (200 OK):**
```json
{
  "symbol": "AAPL",
  "sentiment": "bullish",
  "score": 82,
  "signals": [
    "Technical indicators positive",
    "Social media sentiment trending bullish",
    "News coverage highly positive"
  ]
}
```

---

## 📰 News Endpoints

### GET /news/latest
Get latest financial news.

**Parameters:**
- `limit` (query, optional) - Number of articles (default: 20)
- `category` (query, optional) - Filter by category

**Response (200 OK):**
```json
{
  "articles": [
    {
      "id": "news_123",
      "title": "Fed Signals Rate Cut",
      "description": "Federal Reserve...",
      "source": "Bloomberg",
      "url": "https://...",
      "publishedAt": "2026-02-26T09:00:00Z",
      "imageUrl": "https://...",
      "sentiment": "positive",
      "sentimentScore": 0.75,
      "impact": "high",
      "relatedStocks": ["SPY", "QQQ"],
      "category": "Economy"
    },
    // ...
  ]
}
```

### GET /news/stock/:symbol
Get news for specific stock.

**Response (200 OK):**
```json
{
  "symbol": "AAPL",
  "articles": [ /* news articles */ ]
}
```

### GET /news/sentiment
Get overall market sentiment.

**Response (200 OK):**
```json
{
  "overall": 0.45,
  "distribution": {
    "positive": 55.0,
    "neutral": 30.0,
    "negative": 15.0
  },
  "trending": "bullish"
}
```

---

## 💼 Portfolio Endpoints

### GET /portfolio/holdings
Get user's portfolio holdings (protected).

**Response (200 OK):**
```json
{
  "holdings": [
    {
      "id": "holding_123",
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "shares": 50,
      "avgCost": 150.00,
      "currentPrice": 185.50,
      "totalValue": 9275.00,
      "gain": 1775.00,
      "gainPercent": 23.67,
      "allocation": 30.2
    },
    // ...
  ]
}
```

### POST /portfolio/trade
Execute a trade (protected).

**Request Body:**
```json
{
  "symbol": "AAPL",
  "action": "buy",
  "shares": 10,
  "price": 185.50,
  "type": "paper"
}
```

**Response (201 Created):**
```json
{
  "trade": {
    "id": "trade_123",
    "symbol": "AAPL",
    "action": "buy",
    "shares": 10,
    "price": 185.50,
    "totalCost": 1855.00,
    "timestamp": "2026-02-26T10:00:00Z"
  }
}
```

### GET /portfolio/metrics
Get portfolio performance metrics (protected).

**Response (200 OK):**
```json
{
  "totalValue": 30654.00,
  "totalGain": 5420.00,
  "totalGainPercent": 21.48,
  "dayChange": 345.20,
  "dayChangePercent": 1.14,
  "cashBalance": 5420.50,
  "investedAmount": 25234.00
}
```

### GET /portfolio/risk
Get risk assessment (protected).

**Response (200 OK):**
```json
{
  "score": 65.5,
  "level": "Medium",
  "volatility": 18.5,
  "sharpeRatio": 1.25,
  "beta": 1.15,
  "diversificationScore": 72.0,
  "recommendations": [
    "Consider reducing tech sector exposure",
    "Add defensive stocks for stability"
  ]
}
```

### GET /portfolio/rebalance
Get rebalancing recommendations (protected).

**Response (200 OK):**
```json
{
  "recommendations": [
    {
      "symbol": "AAPL",
      "currentAllocation": 35.2,
      "targetAllocation": 25.0,
      "action": "sell",
      "shares": 8,
      "reasoning": "Overweight - consider taking profits"
    },
    // ...
  ]
}
```

---

## 🎓 Learning Endpoints

### GET /learning/courses
Get all available courses.

**Response (200 OK):**
```json
{
  "courses": [
    {
      "id": "course_123",
      "title": "Investing Fundamentals",
      "description": "Learn the basics...",
      "difficulty": "Beginner",
      "duration": "2 hours",
      "lessons": 8,
      "xpReward": 500,
      "category": "Investing",
      "thumbnail": "https://..."
    },
    // ...
  ]
}
```

### GET /learning/courses/:id
Get course details with lessons.

**Response (200 OK):**
```json
{
  "course": { /* course object */ },
  "lessons": [
    {
      "id": "lesson_123",
      "title": "Understanding Stocks",
      "content": "...",
      "duration": "15 min",
      "order": 1,
      "hasQuiz": true
    },
    // ...
  ]
}
```

### GET /learning/lessons/:id/quiz
Get quiz for a lesson.

**Response (200 OK):**
```json
{
  "quiz": {
    "id": "quiz_123",
    "lessonId": "lesson_123",
    "questions": [
      {
        "id": "q_1",
        "question": "What is diversification?",
        "options": [
          "Investing in only one stock",
          "Spreading investments across different assets",
          "..."
        ],
        "correctAnswer": 1,
        "explanation": "Diversification means..."
      },
      // ...
    ]
  }
}
```

### POST /learning/progress
Update learning progress (protected).

**Request Body:**
```json
{
  "courseId": "course_123",
  "lessonId": "lesson_123",
  "completed": true,
  "quizScore": 85
}
```

**Response (200 OK):**
```json
{
  "xpEarned": 75,
  "newTotalXp": 1325,
  "newLevel": 5,
  "leveledUp": false
}
```

### GET /learning/progress
Get user's learning progress (protected).

**Response (200 OK):**
```json
{
  "courses": [
    {
      "courseId": "course_123",
      "completedLessons": 5,
      "totalLessons": 8,
      "progress": 62.5,
      "xpEarned": 250,
      "lastAccessed": "2026-02-25T14:30:00Z"
    },
    // ...
  ]
}
```

---

## 💬 AI Chat Endpoints

### POST /ai/chat
Send message to AI advisor (protected).

**Request Body:**
```json
{
  "message": "How should I diversify my portfolio?"
}
```

**Response (200 OK):**
```json
{
  "id": "msg_123",
  "role": "assistant",
  "content": "Great question! For diversification...",
  "timestamp": "2026-02-26T10:00:00Z"
}
```

### GET /ai/chat/history
Get chat history (protected).

**Parameters:**
- `limit` (query, optional) - Number of messages (default: 50)

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": "msg_123",
      "role": "user",
      "content": "How should I invest?",
      "timestamp": "2026-02-26T10:00:00Z"
    },
    {
      "id": "msg_124",
      "role": "assistant",
      "content": "Here's my advice...",
      "timestamp": "2026-02-26T10:00:05Z"
    },
    // ...
  ]
}
```

### DELETE /ai/chat/history
Clear chat history (protected).

**Response (200 OK):**
```json
{
  "message": "Chat history cleared"
}
```

---

## 🏆 Gamification Endpoints

### POST /gamification/xp
Award XP to user (protected).

**Request Body:**
```json
{
  "amount": 50,
  "reason": "Completed lesson"
}
```

**Response (200 OK):**
```json
{
  "newXp": 1300,
  "newLevel": 5,
  "leveledUp": false,
  "xpToNextLevel": 200
}
```

### GET /gamification/achievements
Get user achievements (protected).

**Response (200 OK):**
```json
{
  "achievements": [
    {
      "id": "ach_123",
      "title": "First Login",
      "description": "Welcome!",
      "icon": "target",
      "unlocked": true,
      "unlockedAt": "2026-02-20T10:00:00Z",
      "xpReward": 50
    },
    // ...
  ]
}
```

### GET /gamification/leaderboard
Get global leaderboard.

**Parameters:**
- `limit` (query, optional) - Number of users (default: 100)

**Response (200 OK):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_456",
      "name": "Alex Johnson",
      "xp": 12500,
      "level": 25
    },
    // ...
  ],
  "userRank": {
    "rank": 42,
    "xp": 1250,
    "level": 5
  }
}
```

---

## 📊 Analytics Endpoints

### POST /analytics/event
Track user event (protected).

**Request Body:**
```json
{
  "event": "page_view",
  "page": "/dashboard",
  "metadata": {
    "referrer": "https://..."
  }
}
```

**Response (204 No Content)**

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "requestId": "req_123"
}
```

---

## 🔄 WebSocket Events

### Connection
```
wss://api.wealthnexus.ai/v1/ws?token=<jwt_token>
```

### Stock Price Updates
**Server → Client:**
```json
{
  "type": "PRICE_UPDATE",
  "data": {
    "symbol": "AAPL",
    "price": 185.50,
    "change": 2.35,
    "changePercent": 1.28,
    "timestamp": "2026-02-26T10:00:00Z"
  }
}
```

### News Alerts
**Server → Client:**
```json
{
  "type": "NEWS_ALERT",
  "data": {
    "title": "Breaking: Fed announces...",
    "impact": "high",
    "relatedStocks": ["SPY", "QQQ"]
  }
}
```

### Portfolio Updates
**Server → Client:**
```json
{
  "type": "PORTFOLIO_UPDATE",
  "data": {
    "totalValue": 30654.00,
    "dayChange": 345.20
  }
}
```

---

## 📝 Rate Limits

- **Public endpoints**: 100 requests / 15 minutes per IP
- **Authenticated endpoints**: 1000 requests / hour per user
- **AI Chat**: 20 messages / hour per user
- **WebSocket**: 1 connection per user

---

## 🔒 Security Headers

All responses include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

---

## 📦 Pagination

For endpoints returning lists:

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

This specification provides a complete API contract for implementing the WealthNexus AI backend.
