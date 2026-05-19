import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  Flame,
  Zap,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PortfolioService } from '../services/portfolio.service';
import { MarketService } from '../services/market.service';
import { AuthService } from '../services/auth.service';

const COLORS = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b'];

export function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [trendingStocks, setTrendingStocks] = useState<any[]>([]);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const [portfolioMetrics, trending, holdings] = await Promise.all([
      PortfolioService.getMetrics(),
      MarketService.getTrendingStocks(),
      PortfolioService.getHoldings(),
    ]);

    setMetrics(portfolioMetrics);
    setTrendingStocks(trending.slice(0, 6));
    
    // Prepare portfolio allocation chart data
    setPortfolioData(
      holdings.map((h) => ({
        name: h.symbol,
        value: h.totalValue,
      }))
    );

    // Generate mock performance data
    setPerformanceData(
      Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        value: 28000 + Math.random() * 4000 + i * 100,
        benchmark: 28000 + Math.random() * 3000 + i * 80,
      }))
    );
  };

  const statCards = [
    {
      title: 'Portfolio Value',
      value: `$${metrics?.totalValue.toLocaleString() || '0'}`,
      change: metrics?.dayChangePercent.toFixed(2) || '0',
      changeValue: `$${metrics?.dayChange.toFixed(2) || '0'}`,
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Gain',
      value: `$${metrics?.totalGain.toLocaleString() || '0'}`,
      change: metrics?.totalGainPercent.toFixed(2) || '0',
      icon: TrendingUp,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      title: 'Cash Balance',
      value: `$${metrics?.cashBalance.toLocaleString() || '0'}`,
      icon: Activity,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      title: 'Invested Amount',
      value: `$${metrics?.investedAmount.toLocaleString() || '0'}`,
      icon: BarChart3,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2">
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground">
              Here's your financial overview for today
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Card className="glass px-4 py-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="text-sm">{user?.streak} days</p>
              </div>
            </Card>
            <Card className="glass px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Level</p>
                <p className="text-sm">{user?.level}</p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass glass-hover p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {stat.change && (
                    <Badge
                      variant={parseFloat(stat.change) >= 0 ? 'default' : 'destructive'}
                      className="gap-1"
                    >
                      {parseFloat(stat.change) >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(parseFloat(stat.change))}%
                    </Badge>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl mb-1">{stat.value}</p>
                  {stat.changeValue && (
                    <p className={`text-sm ${parseFloat(stat.change) >= 0 ? 'text-chart-3' : 'text-destructive'}`}>
                      {parseFloat(stat.change) >= 0 ? '+' : ''}{stat.changeValue} today
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl mb-1">Portfolio Performance</h3>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
                <Badge variant="outline" className="gap-1">
                  <TrendingUp className="w-3 h-3 text-chart-3" />
                  +12.4%
                </Badge>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="#8b92b0"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#8b92b0"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 22, 41, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#e8eaf0',
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Portfolio Allocation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass p-6">
              <h3 className="text-xl mb-4">Asset Allocation</h3>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 22, 41, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 mt-4">
                {portfolioData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${(item.value / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Trending Stocks & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending Stocks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="glass p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Trending Stocks</h3>
                <Link to="/playground">
                  <Button variant="ghost" size="sm" className="gap-2">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {trendingStocks.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary">{stock.symbol}</span>
                      </div>
                      <div>
                        <p className="text-sm">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm">${stock.price.toFixed(2)}</p>
                      <p
                        className={`text-xs ${
                          stock.changePercent >= 0 ? 'text-chart-3' : 'text-destructive'
                        }`}
                      >
                        {stock.changePercent >= 0 ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass p-6">
              <h3 className="text-xl mb-6">Quick Actions</h3>

              <div className="space-y-3">
                <Link to="/learning">
                  <Button className="w-full justify-start gap-3 bg-gradient-to-r from-primary/20 to-chart-2/20 hover:from-primary/30 hover:to-chart-2/30 border border-primary/20">
                    <Target className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-sm">Continue Learning</p>
                      <p className="text-xs text-muted-foreground">3 courses in progress</p>
                    </div>
                  </Button>
                </Link>

                <Link to="/playground">
                  <Button className="w-full justify-start gap-3 bg-gradient-to-r from-chart-3/20 to-chart-4/20 hover:from-chart-3/30 hover:to-chart-4/30 border border-chart-3/20">
                    <Zap className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-sm">AI Predictions</p>
                      <p className="text-xs text-muted-foreground">Get stock insights</p>
                    </div>
                  </Button>
                </Link>

                <Link to="/portfolio">
                  <Button className="w-full justify-start gap-3 bg-gradient-to-r from-chart-2/20 to-primary/20 hover:from-chart-2/30 hover:to-primary/30 border border-chart-2/20">
                    <Award className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-sm">Risk Analysis</p>
                      <p className="text-xs text-muted-foreground">Review portfolio</p>
                    </div>
                  </Button>
                </Link>

                <Link to="/advisor">
                  <Button className="w-full justify-start gap-3 bg-gradient-to-r from-chart-4/20 to-destructive/20 hover:from-chart-4/30 hover:to-destructive/30 border border-chart-4/20">
                    <Sparkles className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-sm">Ask AI Advisor</p>
                      <p className="text-xs text-muted-foreground">Get financial advice</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
