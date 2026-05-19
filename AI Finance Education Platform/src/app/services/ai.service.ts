// AI Financial Advisor & Chatbot Service
// Simulates LLM-based financial advice and conversational AI

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FinancialAdvice {
  topic: string;
  recommendation: string;
  reasoning: string[];
  confidence: number;
  relatedArticles?: string[];
}

export class AIService {
  private static readonly CHAT_STORAGE_KEY = 'wealthnexus_chat_history';

  static async sendMessage(message: string): Promise<ChatMessage> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = this.generateResponse(message);
    
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    };
    
    // Save to history
    this.saveChatMessage({
      id: `msg_${Date.now() - 1}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });
    this.saveChatMessage(assistantMessage);
    
    return assistantMessage;
  }

  static getChatHistory(): ChatMessage[] {
    const data = localStorage.getItem(this.CHAT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static clearChatHistory(): void {
    localStorage.removeItem(this.CHAT_STORAGE_KEY);
  }

  private static saveChatMessage(message: ChatMessage): void {
    const history = this.getChatHistory();
    history.push(message);
    
    // Keep only last 100 messages
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    localStorage.setItem(this.CHAT_STORAGE_KEY, JSON.stringify(history));
  }

  private static generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Pattern matching for common queries
    if (lowerMessage.includes('invest') && lowerMessage.includes('beginner')) {
      return `Great question! For beginners, I recommend starting with:

**1. Emergency Fund First** 💰
Build 3-6 months of expenses in a high-yield savings account before investing.

**2. Index Funds** 📊
ETFs like VOO (S&P 500) or VTI (Total Market) offer instant diversification with low fees.

**3. Dollar-Cost Averaging** 📈
Invest a fixed amount regularly (e.g., $500/month) regardless of market conditions. This reduces timing risk.

**4. Start Small** 🎯
Begin with what you're comfortable losing. Even $100/month adds up over time with compound interest.

**Risk Level**: Start with 70% stocks / 30% bonds, then adjust based on your age and goals.

Would you like me to explain any of these concepts in more detail?`;
    }
    
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('diversif')) {
      return `Excellent question about portfolio management! Here's my advice:

**Optimal Diversification Strategy** 🎯

**Asset Allocation:**
- 60% Large-Cap Stocks (S&P 500)
- 20% International Stocks
- 10% Small-Cap Growth
- 10% Bonds/Cash

**Sector Balance:**
Avoid more than 25% in any single sector (Tech, Healthcare, Finance, etc.)

**Risk Management:**
- Rebalance quarterly
- Use stop-losses on individual positions
- Keep 5-10% cash for opportunities

**Pro Tip**: Your portfolio should let you sleep at night. If market swings cause anxiety, you're taking too much risk.

Want me to analyze your current holdings?`;
    }
    
    if (lowerMessage.includes('stock') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
      return `I'll help you think through this decision! 🤔

**Before Buying/Selling, Consider:**

✅ **Fundamental Analysis**
- P/E ratio < 30 (generally)
- Revenue growth > 15% YoY
- Strong balance sheet (low debt-to-equity)

✅ **Technical Signals**
- Price above 50-day & 200-day moving averages (bullish)
- RSI between 30-70 (not overbought/oversold)
- Increasing volume on up days

✅ **Macro Factors**
- Interest rate environment
- Sector trends
- Market sentiment

⚠️ **Red Flags:**
- Negative cash flow
- Declining margins
- High insider selling

Remember: *Never invest money you can't afford to lose.* Always have a plan with clear entry/exit points.

Which stock are you considering? I can provide specific analysis.`;
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('safe')) {
      return `Let's talk about risk management - the most important aspect of investing! 🛡️

**Risk Management Framework:**

**1. Position Sizing** 📊
- No single stock > 5% of portfolio
- Limit sector exposure to 25%
- Keep emergency fund separate

**2. Stop-Loss Strategy** ⛔
- Set stop-losses at 7-10% below entry
- Trailing stops for winners
- Never average down on losers

**3. Diversification** 🌍
- Across sectors
- Across geographies
- Across asset classes

**4. Hedging** 🔒
- Consider protective puts for large positions
- Inverse ETFs for portfolio hedging
- Cash allocation increases in high volatility

**Your Risk Tolerance:**
- Conservative: 40/60 stocks/bonds
- Moderate: 60/40 stocks/bonds
- Aggressive: 80/20 stocks/bonds

The goal is *risk-adjusted* returns, not maximum returns. Would you like me to assess your current risk level?`;
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('prediction') || lowerMessage.includes('forecast')) {
      return `AI in finance is transforming how we invest! Here's what you need to know: 🤖

**How AI Helps Investors:**

**1. Pattern Recognition** 🔍
AI analyzes millions of data points to identify trends humans might miss.

**2. Sentiment Analysis** 💬
NLP processes news, social media, and earnings calls to gauge market sentiment.

**3. Risk Assessment** ⚖️
ML models calculate portfolio risk more accurately than traditional methods.

**4. Prediction Models** 📈
- Time series forecasting (LSTM networks)
- Price movement probability
- Volatility predictions

**⚠️ Important Limitations:**
- AI can't predict black swan events
- Models trained on historical data
- 60-70% accuracy is considered good
- Always use as ONE tool, not the only tool

**Best Practice:** Use AI predictions with traditional analysis + your judgment. No model is perfect!

Want to learn how our prediction engine works?`;
    }
    
    // Default response
    return `I understand you're asking about: "${message}"

As your AI financial advisor, I'm here to help with:
- Investment strategies and portfolio advice
- Market analysis and stock research
- Risk management techniques
- Financial education and learning paths
- Trading strategies and timing

Could you provide more details about what you'd like to know? For example:
- "How should a beginner start investing?"
- "What's a good portfolio allocation?"
- "Should I buy/sell [stock]?"
- "How do I manage risk?"

I'll provide personalized, actionable advice based on your question! 💡`;
  }

  static async getFinancialAdvice(context: {
    portfolio?: any;
    riskTolerance?: string;
    goals?: string[];
  }): Promise<FinancialAdvice> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      topic: 'Portfolio Optimization',
      recommendation: 'Rebalance your portfolio to reduce tech concentration and add defensive positions.',
      reasoning: [
        'Current tech allocation at 65% exceeds recommended 50% maximum',
        'Market volatility indicators suggest increased defensive positioning',
        'Adding healthcare and consumer staples provides downside protection',
        'Maintain 10-15% cash for opportunistic buying',
      ],
      confidence: 82,
      relatedArticles: [
        'Understanding Sector Rotation',
        'Defensive Investing Strategies',
        'Portfolio Rebalancing Guide',
      ],
    };
  }

  static async analyzeStockSentiment(symbol: string): Promise<{
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    signals: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const score = Math.random() * 100;
    const sentiment = score > 60 ? 'bullish' : score < 40 ? 'bearish' : 'neutral';
    
    return {
      sentiment,
      score,
      signals: [
        `Technical indicators ${score > 50 ? 'positive' : 'negative'}`,
        `Social media sentiment trending ${sentiment}`,
        `News coverage ${score > 60 ? 'highly positive' : score < 40 ? 'concerning' : 'neutral'}`,
        `Institutional activity shows ${score > 55 ? 'accumulation' : 'distribution'}`,
      ],
    };
  }
}
