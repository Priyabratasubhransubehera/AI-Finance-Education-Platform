// Market Data Service - Simulates Yahoo Finance / Alpha Vantage APIs
// In production, this would connect to real financial data APIs

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  pe?: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface PredictionData {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  direction: 'up' | 'down';
  timeframe: '1D' | '1W' | '1M';
  factors: string[];
}

export class MarketService {
  private static readonly TRENDING_STOCKS = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'
  ];

  static async getStockQuote(symbol: string): Promise<StockData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const basePrice = Math.random() * 500 + 50;
    const change = (Math.random() - 0.5) * 20;
    
    return {
      symbol,
      name: this.getStockName(symbol),
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: `${(Math.random() * 2000 + 100).toFixed(1)}B`,
      pe: Math.random() * 40 + 10,
      high: basePrice + Math.abs(change),
      low: basePrice - Math.abs(change),
      open: basePrice - change / 2,
      previousClose: basePrice - change,
    };
  }

  static async getChartData(symbol: string, timeframe: string): Promise<ChartDataPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const points = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : 30;
    const basePrice = Math.random() * 500 + 50;
    
    return Array.from({ length: points }, (_, i) => ({
      time: timeframe === '1D' 
        ? `${i}:00` 
        : new Date(Date.now() - (points - i) * 86400000).toLocaleDateString(),
      value: basePrice + (Math.random() - 0.5) * 50,
    }));
  }

  static async getTrendingStocks(): Promise<StockData[]> {
    return Promise.all(
      this.TRENDING_STOCKS.map(symbol => this.getStockQuote(symbol))
    );
  }

  static async getPrediction(symbol: string, timeframe: '1D' | '1W' | '1M'): Promise<PredictionData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentPrice = Math.random() * 500 + 50;
    const changePercent = (Math.random() - 0.3) * 10; // Bias towards up
    const predictedPrice = currentPrice * (1 + changePercent / 100);
    
    return {
      symbol,
      currentPrice,
      predictedPrice,
      confidence: Math.random() * 30 + 70, // 70-100%
      direction: predictedPrice > currentPrice ? 'up' : 'down',
      timeframe,
      factors: [
        'Strong market momentum',
        'Positive earnings report',
        'Increased institutional buying',
        'Technical indicators bullish',
      ].slice(0, Math.floor(Math.random() * 3) + 2),
    };
  }

  static async searchStocks(query: string): Promise<StockData[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const allSymbols = [...this.TRENDING_STOCKS, 'COIN', 'SQ', 'SHOP', 'ROKU'];
    const filtered = allSymbols.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    );
    
    return Promise.all(
      filtered.slice(0, 5).map(symbol => this.getStockQuote(symbol))
    );
  }

  private static getStockName(symbol: string): string {
    const names: Record<string, string> = {
      AAPL: 'Apple Inc.',
      GOOGL: 'Alphabet Inc.',
      MSFT: 'Microsoft Corporation',
      AMZN: 'Amazon.com Inc.',
      TSLA: 'Tesla Inc.',
      NVDA: 'NVIDIA Corporation',
      META: 'Meta Platforms Inc.',
      NFLX: 'Netflix Inc.',
      COIN: 'Coinbase Global Inc.',
      SQ: 'Block Inc.',
      SHOP: 'Shopify Inc.',
      ROKU: 'Roku Inc.',
    };
    return names[symbol] || `${symbol} Company`;
  }
}
