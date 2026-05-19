import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Target,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MarketService, StockData, PredictionData } from '../services/market.service';
import { toast } from 'sonner';

export function StockPlayground() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1W');
  const [trendingStocks, setTrendingStocks] = useState<StockData[]>([]);
  const [paperTrades, setPaperTrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTrendingStocks();
    loadPaperTrades();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      loadStockData(selectedStock.symbol);
    }
  }, [selectedStock, timeframe]);

  const loadTrendingStocks = async () => {
    const stocks = await MarketService.getTrendingStocks();
    setTrendingStocks(stocks);
  };

  const loadPaperTrades = () => {
    const trades = JSON.parse(localStorage.getItem('wealthnexus_paper_trades') || '[]');
    setPaperTrades(trades);
  };

  const loadStockData = async (symbol: string) => {
    setIsLoading(true);
    try {
      const [chart, pred] = await Promise.all([
        MarketService.getChartData(symbol, timeframe),
        MarketService.getPrediction(symbol, timeframe),
      ]);

      setChartData(chart);
      setPrediction(pred);
    } catch (error) {
      toast.error('Failed to load stock data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const stocks = await MarketService.searchStocks(searchQuery);
    if (stocks.length > 0) {
      setSelectedStock(stocks[0]);
    } else {
      toast.error('Stock not found');
    }
  };

  const handlePaperTrade = (action: 'buy' | 'sell') => {
    if (!selectedStock || !prediction) return;

    const trade = {
      id: Date.now().toString(),
      symbol: selectedStock.symbol,
      action,
      price: selectedStock.price,
      predictedPrice: prediction.predictedPrice,
      confidence: prediction.confidence,
      timestamp: new Date().toISOString(),
    };

    const trades = [...paperTrades, trade];
    setPaperTrades(trades);
    localStorage.setItem('wealthnexus_paper_trades', JSON.stringify(trades));

    toast.success(`Paper trade executed: ${action.toUpperCase()} ${selectedStock.symbol}`);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl mb-2">
            <span className="text-gradient">AI Stock Predictor</span>
          </h1>
          <p className="text-muted-foreground">
            Paper trade with AI-powered predictions and insights
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search stocks (e.g., AAPL, GOOGL)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <Button onClick={handleSearch} className="gap-2">
                <Zap className="w-4 h-4" />
                Analyze
              </Button>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart & Prediction */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStock ? (
              <>
                {/* Stock Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="glass p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl mb-1">{selectedStock.symbol}</h2>
                        <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
                      </div>
                      <Badge
                        variant={selectedStock.changePercent >= 0 ? 'default' : 'destructive'}
                        className="gap-1"
                      >
                        {selectedStock.changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(selectedStock.changePercent).toFixed(2)}%
                      </Badge>
                    </div>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl">${selectedStock.price.toFixed(2)}</span>
                      <span
                        className={`text-lg ${
                          selectedStock.change >= 0 ? 'text-chart-3' : 'text-destructive'
                        }`}
                      >
                        {selectedStock.change >= 0 ? '+' : ''}
                        {selectedStock.change.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Open</p>
                        <p>${selectedStock.open.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">High</p>
                        <p className="text-chart-3">${selectedStock.high.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Low</p>
                        <p className="text-destructive">${selectedStock.low.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Volume</p>
                        <p>{(selectedStock.volume / 1000000).toFixed(2)}M</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="glass p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg">Price Chart</h3>
                      <Tabs value={timeframe} onValueChange={(v: any) => setTimeframe(v)}>
                        <TabsList className="glass">
                          <TabsTrigger value="1D">1D</TabsTrigger>
                          <TabsTrigger value="1W">1W</TabsTrigger>
                          <TabsTrigger value="1M">1M</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                          dataKey="time"
                          stroke="#8b92b0"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#8b92b0"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 22, 41, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#00d4ff"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>

                {/* AI Prediction */}
                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="glass p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />

                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Brain className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg">AI Prediction</h3>
                          <p className="text-sm text-muted-foreground">{timeframe} forecast</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                          <p className="text-2xl">${prediction.currentPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Predicted Price</p>
                          <p className={`text-2xl ${prediction.direction === 'up' ? 'text-chart-3' : 'text-destructive'}`}>
                            ${prediction.predictedPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="text-primary">{prediction.confidence.toFixed(0)}%</span>
                        </div>
                        <Progress value={prediction.confidence} className="h-2" />
                      </div>

                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-muted-foreground">Key Factors:</p>
                        {prediction.factors.map((factor, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <ChevronRight className="w-4 h-4 text-primary" />
                            {factor}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handlePaperTrade('buy')}
                          className="flex-1 bg-chart-3 hover:bg-chart-3/90"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Paper Buy
                        </Button>
                        <Button
                          onClick={() => handlePaperTrade('sell')}
                          variant="destructive"
                          className="flex-1"
                        >
                          <TrendingDown className="w-4 h-4 mr-2" />
                          Paper Sell
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:col-span-2"
              >
                <Card className="glass p-12 text-center">
                  <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl mb-2">Search for a stock to begin</h3>
                  <p className="text-muted-foreground">
                    Enter a stock symbol above to see AI predictions and analysis
                  </p>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Stocks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg mb-4">Trending Stocks</h3>
                <div className="space-y-3">
                  {trendingStocks.slice(0, 8).map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => setSelectedStock(stock)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">${stock.price.toFixed(2)}</p>
                      </div>
                      <Badge
                        variant={stock.changePercent >= 0 ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {stock.changePercent >= 0 ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Paper Trades */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg mb-4">Recent Paper Trades</h3>
                {paperTrades.length > 0 ? (
                  <div className="space-y-3">
                    {paperTrades.slice(-5).reverse().map((trade) => (
                      <div
                        key={trade.id}
                        className="p-3 rounded-lg bg-secondary/50 border border-border/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{trade.symbol}</span>
                          <Badge
                            variant={trade.action === 'buy' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {trade.action.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p>Price: ${trade.price.toFixed(2)}</p>
                          <p>AI Confidence: {trade.confidence.toFixed(0)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No paper trades yet
                  </p>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
