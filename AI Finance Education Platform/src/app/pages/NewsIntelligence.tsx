import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { NewsService, NewsArticle } from '../services/news.service';

const SENTIMENT_COLORS = {
  positive: '#10b981',
  neutral: '#f59e0b',
  negative: '#ef4444',
};

export function NewsIntelligence() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [marketSentiment, setMarketSentiment] = useState<any>(null);

  useEffect(() => {
    loadNews();
    const sentiment = NewsService.getMarketSentiment();
    setMarketSentiment(sentiment);
  }, []);

  const loadNews = async () => {
    const articles = await NewsService.getLatestNews();
    setNews(articles);
  };

  const filteredNews = news.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || article.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sentimentData = marketSentiment
    ? [
        { name: 'Positive', value: marketSentiment.distribution.positive, color: SENTIMENT_COLORS.positive },
        { name: 'Neutral', value: marketSentiment.distribution.neutral, color: SENTIMENT_COLORS.neutral },
        { name: 'Negative', value: marketSentiment.distribution.negative, color: SENTIMENT_COLORS.negative },
      ]
    : [];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
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
            <span className="text-gradient">News Intelligence</span>
          </h1>
          <p className="text-muted-foreground">
            AI-powered sentiment analysis and market insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main News Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary/50"
                    />
                  </div>
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="glass">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="economy">Economy</TabsTrigger>
                      <TabsTrigger value="technology">Tech</TabsTrigger>
                      <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </Card>
            </motion.div>

            {/* News Articles */}
            <div className="space-y-4">
              {filteredNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Card className="glass glass-hover p-6 group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {article.source}
                          </Badge>
                          <Badge
                            variant={
                              article.sentiment === 'positive'
                                ? 'default'
                                : article.sentiment === 'negative'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="text-xs gap-1"
                          >
                            {getSentimentIcon(article.sentiment)}
                            {article.sentiment}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {article.impact} impact
                          </Badge>
                        </div>

                        <h3 className="text-lg mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {article.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          {article.relatedStocks.length > 0 && (
                            <div className="flex items-center gap-1">
                              {article.relatedStocks.slice(0, 3).map((stock) => (
                                <Badge key={stock} variant="outline" className="text-xs">
                                  {stock}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button size="icon" variant="ghost" className="flex-shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Sentiment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg mb-4">Market Sentiment</h3>

                {marketSentiment && (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">
                        {marketSentiment.overall > 0 ? '😊' : marketSentiment.overall < 0 ? '😟' : '😐'}
                      </div>
                      <p className="text-2xl mb-1">
                        {marketSentiment.overall > 0 ? 'Bullish' : marketSentiment.overall < 0 ? 'Bearish' : 'Neutral'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Overall score: {(marketSentiment.overall * 100).toFixed(0)}
                      </p>
                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-2 mt-4">
                      {sentimentData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.value.toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass p-6">
                <h3 className="text-lg mb-4">Trending Topics</h3>
                <div className="space-y-2">
                  {['Fed Interest Rates', 'AI Technology', 'Electric Vehicles', 'Crypto Regulation', 'Earnings Season'].map((topic, index) => (
                    <Button
                      key={topic}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      <span className="text-primary mr-2">#{index + 1}</span>
                      {topic}
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
