// News Intelligence Service - Simulates NewsAPI with Sentiment Analysis
// In production, this would connect to real news APIs and NLP models

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number; // -1 to 1
  impact: 'high' | 'medium' | 'low';
  relatedStocks: string[];
  category: string;
}

export class NewsService {
  private static readonly MOCK_NEWS: Omit<NewsArticle, 'id' | 'publishedAt'>[] = [
    {
      title: 'Federal Reserve Signals Potential Rate Cut in Q2',
      description: 'Fed officials indicate flexibility on monetary policy as inflation shows signs of cooling.',
      source: 'Bloomberg',
      url: '#',
      sentiment: 'positive',
      sentimentScore: 0.75,
      impact: 'high',
      relatedStocks: ['SPY', 'QQQ', 'DIA'],
      category: 'Economy',
    },
    {
      title: 'Tech Giants Report Strong Q4 Earnings',
      description: 'Major technology companies exceed analyst expectations with robust revenue growth.',
      source: 'CNBC',
      url: '#',
      sentiment: 'positive',
      sentimentScore: 0.85,
      impact: 'high',
      relatedStocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN'],
      category: 'Earnings',
    },
    {
      title: 'AI Chip Demand Surges, NVIDIA Announces New Product Line',
      description: 'NVIDIA unveils next-generation AI chips as demand from data centers reaches record highs.',
      source: 'Reuters',
      url: '#',
      sentiment: 'positive',
      sentimentScore: 0.9,
      impact: 'high',
      relatedStocks: ['NVDA', 'AMD', 'INTC'],
      category: 'Technology',
    },
    {
      title: 'Electric Vehicle Sales Growth Slows in European Market',
      description: 'EV adoption rate decelerates as subsidies wind down and competition intensifies.',
      source: 'Financial Times',
      url: '#',
      sentiment: 'negative',
      sentimentScore: -0.4,
      impact: 'medium',
      relatedStocks: ['TSLA', 'F', 'GM'],
      category: 'Automotive',
    },
    {
      title: 'Cryptocurrency Market Stabilizes After Regulatory Clarity',
      description: 'New SEC guidelines provide framework for digital asset classification.',
      source: 'CoinDesk',
      url: '#',
      sentiment: 'neutral',
      sentimentScore: 0.2,
      impact: 'medium',
      relatedStocks: ['COIN', 'MSTR'],
      category: 'Crypto',
    },
    {
      title: 'Oil Prices Decline on Increased Production Forecasts',
      description: 'Major producers signal capacity increases, pressuring energy sector valuations.',
      source: 'Wall Street Journal',
      url: '#',
      sentiment: 'negative',
      sentimentScore: -0.6,
      impact: 'high',
      relatedStocks: ['XOM', 'CVX', 'USO'],
      category: 'Energy',
    },
  ];

  static async getLatestNews(limit: number = 20): Promise<NewsArticle[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return this.MOCK_NEWS.map((article, index) => ({
      ...article,
      id: `news_${Date.now()}_${index}`,
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      imageUrl: `https://images.unsplash.com/photo-${1611974789696 + index * 100}?w=800&h=400&fit=crop`,
    })).slice(0, limit);
  }

  static async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = this.MOCK_NEWS.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
    
    return filtered.map((article, index) => ({
      ...article,
      id: `news_${Date.now()}_${index}`,
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
    }));
  }

  static async getNewsByStock(symbol: string): Promise<NewsArticle[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = this.MOCK_NEWS.filter(article => 
      article.relatedStocks.includes(symbol)
    );
    
    return filtered.map((article, index) => ({
      ...article,
      id: `news_${Date.now()}_${index}`,
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
    }));
  }

  static async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate NLP sentiment analysis
    const positiveWords = ['growth', 'surge', 'strong', 'exceed', 'bullish', 'gain'];
    const negativeWords = ['decline', 'drop', 'weak', 'concern', 'bearish', 'loss'];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 0.2;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 0.2;
    });
    
    score = Math.max(-1, Math.min(1, score));
    
    return {
      sentiment: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
      score,
      confidence: Math.random() * 0.2 + 0.8,
    };
  }

  static getMarketSentiment(): {
    overall: number;
    distribution: { positive: number; neutral: number; negative: number };
  } {
    const articles = this.MOCK_NEWS;
    const overall = articles.reduce((sum, a) => sum + a.sentimentScore, 0) / articles.length;
    
    const distribution = {
      positive: articles.filter(a => a.sentiment === 'positive').length / articles.length * 100,
      neutral: articles.filter(a => a.sentiment === 'neutral').length / articles.length * 100,
      negative: articles.filter(a => a.sentiment === 'negative').length / articles.length * 100,
    };
    
    return { overall, distribution };
  }
}
