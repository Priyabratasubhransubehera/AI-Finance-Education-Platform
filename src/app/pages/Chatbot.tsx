import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, User, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { AIService, ChatMessage } from '../services/ai.service';
import { AuthService } from '../services/auth.service';
import { toast } from 'sonner';

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = () => {
    const history = AIService.getChatHistory();
    if (history.length === 0) {
      // Welcome message
      setMessages([
        {
          id: '0',
          role: 'assistant',
          content: `Hello ${user?.name}! 👋 I'm your AI Financial Advisor. I can help you with:

• Investment strategies and portfolio advice
• Stock analysis and market insights
• Risk management techniques
• Financial education and learning paths
• Trading strategies and timing

What would you like to know about today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages(history);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await AIService.sendMessage(input);
      setMessages((prev) => [...prev, response]);

      // Award XP for engagement
      AuthService.addXP(5);
    } catch (error) {
      toast.error('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    AIService.clearChatHistory();
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: `Chat history cleared! How can I help you today?`,
        timestamp: new Date().toISOString(),
      },
    ]);
    toast.success('Chat history cleared');
  };

  const suggestedQuestions = [
    'How should a beginner start investing?',
    'What\'s a good portfolio allocation?',
    'Explain diversification to me',
    'How do I manage risk?',
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2">
              <span className="text-gradient">AI Financial Advisor</span>
            </h1>
            <p className="text-muted-foreground">
              Get personalized financial advice powered by AI
            </p>
          </div>
          <Button onClick={handleClearHistory} variant="outline" size="sm" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Clear History
          </Button>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass overflow-hidden">
            {/* Messages */}
            <ScrollArea className="h-[60vh] p-6" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar
                      className={`w-8 h-8 flex-shrink-0 ${
                        message.role === 'assistant'
                          ? 'bg-primary/20 border-2 border-primary/50'
                          : 'bg-secondary'
                      }`}
                    >
                      <AvatarFallback>
                        {message.role === 'assistant' ? (
                          <Bot className="w-4 h-4 text-primary" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`flex-1 max-w-[80%] ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 border border-border/50'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <Avatar className="w-8 h-8 bg-primary/20 border-2 border-primary/50">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 p-4 rounded-2xl bg-secondary/50 border border-border/50">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="px-6 py-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-3">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question}
                      onClick={() => setInput(question)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-6 border-t border-border/50 bg-background/50">
              <div className="flex gap-3">
                <Input
                  placeholder="Ask me anything about investing..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                  className="bg-secondary/50"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Earn +5 XP for each message sent!
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Sparkles,
              title: 'Smart Insights',
              description: 'Get AI-powered investment recommendations',
            },
            {
              icon: Bot,
              title: '24/7 Available',
              description: 'Ask financial questions anytime',
            },
            {
              icon: User,
              title: 'Personalized',
              description: 'Advice tailored to your portfolio',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="glass p-4 text-center">
                <feature.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
