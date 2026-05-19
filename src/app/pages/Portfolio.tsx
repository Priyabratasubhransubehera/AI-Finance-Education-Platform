import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart as PieChartIcon,
  Target,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  PortfolioService,
  PortfolioHolding,
  PortfolioMetrics,
  RiskAssessment,
  RebalancingRecommendation,
} from '../services/portfolio.service';

const COLORS = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b'];

export function Portfolio() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [rebalancing, setRebalancing] = useState<RebalancingRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    setIsLoading(true);
    const [holdingsData, metricsData, riskData, rebalanceData] = await Promise.all([
      PortfolioService.getHoldings(),
      PortfolioService.getMetrics(),
      PortfolioService.getRiskAssessment(),
      PortfolioService.getRebalancingRecommendations(),
    ]);

    setHoldings(holdingsData);
    setMetrics(metricsData);
    setRiskAssessment(riskData);
    setRebalancing(rebalanceData);
    setIsLoading(false);
  };

  const chartData = holdings.map((h) => ({
    name: h.symbol,
    value: h.totalValue,
  }));

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-chart-3';
      case 'Medium':
        return 'text-chart-4';
      case 'High':
        return 'text-destructive';
      case 'Very High':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2">
              <span className="text-gradient">Portfolio Analyzer</span>
            </h1>
            <p className="text-muted-foreground">
              Risk assessment and rebalancing recommendations
            </p>
          </div>
          <Button onClick={loadPortfolioData} variant="outline" className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Value',
                value: `$${metrics.totalValue.toLocaleString()}`,
                change: metrics.dayChangePercent,
                icon: Briefcase,
              },
              {
                label: 'Total Gain',
                value: `$${metrics.totalGain.toLocaleString()}`,
                change: metrics.totalGainPercent,
                icon: TrendingUp,
              },
              {
                label: 'Day Change',
                value: `$${metrics.dayChange.toFixed(2)}`,
                change: metrics.dayChangePercent,
                icon: metrics.dayChange >= 0 ? TrendingUp : TrendingDown,
              },
              {
                label: 'Cash Balance',
                value: `$${metrics.cashBalance.toLocaleString()}`,
                icon: Target,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass p-4">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className="w-5 h-5 text-primary" />
                    {stat.change !== undefined && (
                      <Badge
                        variant={stat.change >= 0 ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {stat.change >= 0 ? '+' : ''}
                        {stat.change.toFixed(2)}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings & Allocation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Holdings Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg mb-4">Holdings</h3>
                <div className="space-y-3">
                  {holdings.map((holding, index) => (
                    <motion.div
                      key={holding.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}
                      >
                        <span className="text-xs" style={{ color: COLORS[index % COLORS.length] }}>
                          {holding.symbol}
                        </span>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium">{holding.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {holding.shares} shares @ ${holding.avgCost.toFixed(2)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm">${holding.totalValue.toLocaleString()}</p>
                        <p
                          className={`text-xs ${
                            holding.gainPercent >= 0 ? 'text-chart-3' : 'text-destructive'
                          }`}
                        >
                          {holding.gainPercent >= 0 ? '+' : ''}
                          {holding.gainPercent.toFixed(2)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Rebalancing Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg mb-4">Rebalancing Recommendations</h3>
                <div className="space-y-3">
                  {rebalancing.map((rec, index) => (
                    <div key={rec.symbol} className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{rec.symbol}</span>
                        <Badge
                          variant={
                            rec.action === 'buy'
                              ? 'default'
                              : rec.action === 'sell'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {rec.action.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <div className="flex justify-between">
                          <span>Current: {rec.currentAllocation.toFixed(1)}%</span>
                          <span>Target: {rec.targetAllocation.toFixed(1)}%</span>
                        </div>
                      </div>
                      <Progress
                        value={(rec.currentAllocation / rec.targetAllocation) * 100}
                        className="h-2 mb-2"
                      />
                      <p className="text-xs text-muted-foreground">{rec.reasoning}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Risk & Allocation */}
          <div className="space-y-6">
            {/* Allocation Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg mb-4">Allocation</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 22, 41, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {chartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {((item.value / metrics!.totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Risk Assessment */}
            {riskAssessment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className={`w-6 h-6 ${getRiskColor(riskAssessment.level)}`} />
                    <div>
                      <h3 className="text-lg">Risk Level</h3>
                      <p className={`text-sm ${getRiskColor(riskAssessment.level)}`}>
                        {riskAssessment.level}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Risk Score</span>
                        <span>{riskAssessment.score.toFixed(0)}/100</span>
                      </div>
                      <Progress value={riskAssessment.score} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Volatility</p>
                        <p>{riskAssessment.volatility.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sharpe Ratio</p>
                        <p>{riskAssessment.sharpeRatio.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Beta</p>
                        <p>{riskAssessment.beta.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Diversification</p>
                        <p>{riskAssessment.diversificationScore.toFixed(0)}/100</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recommendations:</p>
                    {riskAssessment.recommendations.map((rec, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {rec}
                      </p>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
