// Portfolio Management & Analysis Service
// Includes risk assessment, diversification metrics, and rebalancing suggestions

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  gain: number;
  gainPercent: number;
  allocation: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  cashBalance: number;
  investedAmount: number;
}

export interface RiskAssessment {
  score: number; // 0-100
  level: 'Low' | 'Medium' | 'High' | 'Very High';
  volatility: number;
  sharpeRatio: number;
  beta: number;
  diversificationScore: number;
  recommendations: string[];
}

export interface RebalancingRecommendation {
  symbol: string;
  currentAllocation: number;
  targetAllocation: number;
  action: 'buy' | 'sell' | 'hold';
  shares: number;
  reasoning: string;
}

export class PortfolioService {
  private static readonly STORAGE_KEY = 'wealthnexus_portfolio';

  static async getHoldings(): Promise<PortfolioHolding[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    
    // Initialize with demo holdings
    const demoHoldings: PortfolioHolding[] = [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 50,
        avgCost: 150.00,
        currentPrice: 185.50,
        totalValue: 9275,
        gain: 1775,
        gainPercent: 23.67,
        allocation: 30.2,
      },
      {
        id: '2',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        shares: 15,
        avgCost: 420.00,
        currentPrice: 615.00,
        totalValue: 9225,
        gain: 2925,
        gainPercent: 46.43,
        allocation: 30.0,
      },
      {
        id: '3',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 25,
        avgCost: 330.00,
        currentPrice: 410.00,
        totalValue: 10250,
        gain: 2000,
        gainPercent: 24.24,
        allocation: 33.4,
      },
      {
        id: '4',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        shares: 12,
        avgCost: 125.00,
        currentPrice: 142.00,
        totalValue: 1704,
        gain: 204,
        gainPercent: 13.60,
        allocation: 5.5,
      },
    ];
    
    this.saveHoldings(demoHoldings);
    return demoHoldings;
  }

  static async getMetrics(): Promise<PortfolioMetrics> {
    const holdings = await this.getHoldings();
    const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
    const totalGain = holdings.reduce((sum, h) => sum + h.gain, 0);
    const investedAmount = totalValue - totalGain;
    
    return {
      totalValue,
      totalGain,
      totalGainPercent: (totalGain / investedAmount) * 100,
      dayChange: totalValue * (Math.random() * 0.04 - 0.01), // -1% to +3%
      dayChangePercent: Math.random() * 4 - 1,
      cashBalance: 5420.50,
      investedAmount,
    };
  }

  static async getRiskAssessment(): Promise<RiskAssessment> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const holdings = await this.getHoldings();
    const techAllocation = holdings
      .filter(h => ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META'].includes(h.symbol))
      .reduce((sum, h) => sum + h.allocation, 0);
    
    const diversificationScore = Math.max(0, 100 - techAllocation);
    const volatility = techAllocation * 0.8; // Higher tech = higher volatility
    
    const riskScore = (volatility * 0.5) + ((100 - diversificationScore) * 0.5);
    
    return {
      score: riskScore,
      level: riskScore < 30 ? 'Low' : riskScore < 50 ? 'Medium' : riskScore < 70 ? 'High' : 'Very High',
      volatility,
      sharpeRatio: Math.random() * 1.5 + 0.5,
      beta: Math.random() * 0.5 + 0.8,
      diversificationScore,
      recommendations: [
        techAllocation > 60 ? 'Consider reducing tech sector exposure' : 'Tech allocation is balanced',
        diversificationScore < 70 ? 'Increase sector diversification' : 'Good sector balance',
        'Consider adding defensive stocks for stability',
        'Review allocation quarterly',
      ],
    };
  }

  static async getRebalancingRecommendations(): Promise<RebalancingRecommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const holdings = await this.getHoldings();
    const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
    
    return holdings.map(holding => {
      const currentAllocation = (holding.totalValue / totalValue) * 100;
      const targetAllocation = 25; // Equal weight for simplicity
      const diff = targetAllocation - currentAllocation;
      
      return {
        symbol: holding.symbol,
        currentAllocation,
        targetAllocation,
        action: Math.abs(diff) < 2 ? 'hold' : diff > 0 ? 'buy' : 'sell',
        shares: Math.abs(Math.floor((diff / 100) * totalValue / holding.currentPrice)),
        reasoning: Math.abs(diff) < 2 
          ? 'Position is well-balanced'
          : diff > 0 
            ? 'Underweight - consider buying'
            : 'Overweight - consider taking profits',
      };
    });
  }

  static async addHolding(holding: Omit<PortfolioHolding, 'id' | 'totalValue' | 'gain' | 'gainPercent' | 'allocation'>): Promise<void> {
    const holdings = await this.getHoldings();
    const newHolding: PortfolioHolding = {
      ...holding,
      id: `holding_${Date.now()}`,
      totalValue: holding.shares * holding.currentPrice,
      gain: (holding.currentPrice - holding.avgCost) * holding.shares,
      gainPercent: ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100,
      allocation: 0, // Will be recalculated
    };
    
    holdings.push(newHolding);
    this.recalculateAllocations(holdings);
    this.saveHoldings(holdings);
  }

  static async removeHolding(id: string): Promise<void> {
    const holdings = await this.getHoldings();
    const filtered = holdings.filter(h => h.id !== id);
    this.recalculateAllocations(filtered);
    this.saveHoldings(filtered);
  }

  private static saveHoldings(holdings: PortfolioHolding[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(holdings));
  }

  private static recalculateAllocations(holdings: PortfolioHolding[]): void {
    const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
    holdings.forEach(h => {
      h.allocation = (h.totalValue / totalValue) * 100;
    });
  }
}
