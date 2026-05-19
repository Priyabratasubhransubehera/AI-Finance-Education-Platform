# WealthNexus AI – Intelligent Finance Education & Investment Platform

> An AI-powered fintech platform combining financial education, intelligent analytics, and real-world investment decision-making.

## 🚀 Overview

WealthNexus AI is a premium SaaS fintech product that acts as a bridge between financial education, intelligent analytics, and smart investing. Built with React, TypeScript, and modern web technologies, it features a beautiful dark theme with glassmorphism, 3D animations, and a Bloomberg/Robinhood-inspired aesthetic.

## ✨ Features

### 🎓 **Finance Learning & Assessment**
- **Structured Courses**: 5+ comprehensive finance courses from Beginner to Advanced
- **Interactive Quizzes**: Test knowledge with immediate feedback
- **XP & Gamification**: Earn experience points for completing lessons
- **Progress Tracking**: Visual progress indicators for each course

### 📊 **AI Stock Prediction Playground**
- **Real-time Stock Data**: Simulated market data with live price updates
- **AI Predictions**: Machine learning-powered price forecasts
- **Confidence Scoring**: See prediction confidence levels (70-100%)
- **Paper Trading**: Practice trading without real money risk
- **Technical Analysis**: Charts with multiple timeframes (1D, 1W, 1M)

### 📰 **Financial News Intelligence**
- **Sentiment Analysis**: AI-powered news sentiment classification
- **Market Impact Assessment**: High/Medium/Low impact ratings
- **Category Filtering**: Filter by Economy, Tech, Earnings, etc.
- **Related Stocks**: See which stocks are affected by each article
- **Market Sentiment Dashboard**: Overall market mood visualization

### 💼 **Portfolio Analyzer**
- **Risk Assessment**: Comprehensive risk scoring (0-100)
- **Diversification Metrics**: Sector allocation analysis
- **Rebalancing Recommendations**: AI-suggested portfolio adjustments
- **Performance Tracking**: Real-time portfolio value and gains
- **Asset Allocation Visualization**: Interactive pie charts

### 🤖 **AI Financial Advisor Chatbot**
- **24/7 Availability**: Ask financial questions anytime
- **Personalized Advice**: Context-aware recommendations
- **Investment Strategies**: Get tailored investment plans
- **Risk Management Tips**: Learn to protect your capital
- **Chat History**: Review past conversations

### 👤 **Profile & Gamification**
- **XP System**: Level up by using the platform
- **Streak Tracking**: Daily login rewards
- **Achievements**: Unlock badges for milestones
- **Leaderboard**: Compete with other users
- **Progress Dashboard**: See your learning journey

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library
- **TypeScript** - Type-safe development
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Motion (Framer Motion)** - Smooth animations
- **Three.js + React Three Fiber** - 3D backgrounds
- **Recharts** - Financial charts and visualizations
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful pre-built components

### Design
- **Glassmorphism**: Frosted glass effect cards
- **Dark Theme**: Premium navy blue and electric blue palette
- **Neon Accents**: Glowing UI elements
- **Responsive Design**: Mobile-first approach
- **3D Elements**: Floating animated spheres

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation with expandable sections
- **Tablet**: Collapsible sidebar with gesture support
- **Mobile**: Bottom navigation bar + hamburger menu
- **Touch Optimized**: Swipe gestures and tap targets

## 🎨 Design System

### Colors
```css
Primary: #00d4ff (Electric Blue)
Secondary: #7c3aed (Purple)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Danger: #ef4444 (Red)
Background: #0a0e27 (Deep Navy)
```

### Typography
- **Headings**: Medium weight (500)
- **Body**: Normal weight (400)
- **System Font Stack**: Optimized for readability

## 🔐 Authentication

- **JWT-based Authentication**: Secure token storage
- **Role-based Access**: User/Admin roles
- **Session Persistence**: LocalStorage for demo
- **Protected Routes**: Automatic redirect to login

## 💾 Data Management

### Client-Side Storage (Demo Mode)
- **LocalStorage**: User data, portfolio, learning progress
- **Session Management**: JWT tokens
- **Chat History**: AI advisor conversation logs
- **Paper Trades**: Simulated trade history

### Backend Integration Ready
All services are designed with clean separation:
- `auth.service.ts` - Ready for REST API integration
- `market.service.ts` - Prepared for Yahoo Finance/Alpha Vantage
- `news.service.ts` - Structured for NewsAPI
- `portfolio.service.ts` - Database-ready schemas
- `ai.service.ts` - LLM integration interface

## 📦 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── ui/
│   │   │   └── [shadcn components]
│   │   └── Background3D.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Learning.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── StockPlayground.tsx
│   │   ├── NewsIntelligence.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Chatbot.tsx
│   │   ├── Profile.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── market.service.ts
│   │   ├── news.service.ts
│   │   ├── portfolio.service.ts
│   │   ├── learning.service.ts
│   │   └── ai.service.ts
│   ├── App.tsx
│   └── routes.tsx
├── styles/
│   ├── theme.css
│   ├── tailwind.css
│   └── fonts.css
└── ...
```

## 🚀 Getting Started

### Demo Usage

1. **Sign Up / Login**
   - Use any email/password (demo mode)
   - Creates instant user account

2. **Explore Dashboard**
   - View portfolio overview
   - Check trending stocks
   - See quick action cards

3. **Start Learning**
   - Browse 5 courses
   - Complete lessons for XP
   - Take quizzes to test knowledge

4. **Try AI Predictions**
   - Search for stocks (AAPL, GOOGL, etc.)
   - View AI-powered forecasts
   - Execute paper trades

5. **Read News**
   - Browse financial news
   - See sentiment analysis
   - Filter by category

6. **Analyze Portfolio**
   - Review risk assessment
   - Get rebalancing tips
   - Track performance

7. **Ask AI Advisor**
   - Chat with AI financial expert
   - Get investment advice
   - Learn strategies

## 🎯 Key Interactions

### Gamification
- **+50 XP** - Complete a lesson
- **+25 XP** - Pass a quiz (70%+)
- **+5 XP** - Send a message to AI
- **+200 XP** - Maintain 7-day streak
- **Level Up** - Every 500 XP

### Paper Trading
- Search and analyze stocks
- View AI predictions with confidence scores
- Execute virtual buy/sell trades
- Track trade history

### Learning Path
1. Start with Beginner courses
2. Complete lessons sequentially
3. Pass quizzes (70% minimum)
4. Unlock Intermediate courses
5. Progress to Advanced topics

## 🔮 Future Backend Integration

### API Endpoints Needed
```
POST   /auth/login
POST   /auth/signup
GET    /auth/me

GET    /market/stocks/:symbol
GET    /market/chart/:symbol
GET    /market/predict/:symbol

GET    /news/latest
GET    /news/sentiment/:symbol

GET    /portfolio/holdings
POST   /portfolio/trade
GET    /portfolio/risk

GET    /learning/courses
GET    /learning/courses/:id/lessons
POST   /learning/progress

POST   /ai/chat
GET    /ai/advice
```

### Database Schema
- **users**: id, email, name, password_hash, xp, level, streak
- **portfolios**: user_id, stock_symbol, shares, avg_cost
- **learning_progress**: user_id, course_id, completed_lessons
- **chat_history**: user_id, role, message, timestamp
- **achievements**: user_id, achievement_id, unlocked_at

## 🎨 Customization

### Theme
Modify `/src/styles/theme.css` to change:
- Color palette
- Border radius
- Spacing scale
- Typography

### Features
Each module is independent:
- Disable modules in routes
- Customize XP rewards
- Adjust prediction algorithms
- Modify risk calculations

## 📄 License

This is a demo project showcasing modern fintech UI/UX patterns.

## 🙏 Acknowledgments

- **Design Inspiration**: Bloomberg Terminal, Robinhood, Webull
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **3D Graphics**: Three.js, React Three Fiber
- **Icons**: Lucide React

---

Built with ❤️ for intelligent investing and financial education.
