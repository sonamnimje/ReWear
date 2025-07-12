import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { chatAPI } from '../services/api';
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle,
  Lightbulb,
  Package,
  RefreshCw,
  TrendingUp,
  HelpCircle,
  Star
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Chat = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: chatHistory } = useQuery(
    ['chat-history'],
    () => chatAPI.getHistory(50),
    {
      staleTime: 30 * 1000, // 30 seconds
    }
  );

  const { data: suggestions } = useQuery(
    ['chat-suggestions'],
    () => chatAPI.getSuggestions(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const sendMessageMutation = useMutation(
    (messageText) => chatAPI.sendMessage(messageText),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chat-history']);
        setIsTyping(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to send message');
        setIsTyping(false);
      },
    }
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageText = message.trim();
    setMessage('');
    setIsTyping(true);

    sendMessageMutation.mutate(messageText);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  const quickActions = [
    {
      icon: Package,
      title: 'How to list an item',
      description: 'Learn how to add your clothing to the platform',
      action: 'How do I list an item for exchange?'
    },
    {
      icon: RefreshCw,
      title: 'Exchange process',
      description: 'Understand how exchanges work',
      action: 'How does the exchange process work?'
    },
    {
      icon: TrendingUp,
      title: 'Earn points',
      description: 'Find out how to earn and use points',
      action: 'How can I earn points?'
    },
    {
      icon: HelpCircle,
      title: 'Get help',
      description: 'Get assistance with any issues',
      action: 'I need help with my account'
    }
  ];

  return (
    <div className="min-h-screen bg-base font-body py-8">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-eco/10 p-3 rounded-full">
              <Bot className="h-8 w-8 text-eco" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold text-eco">SmartChain AI</h1>
              <p className="font-body text-charcoal/80">Your sustainable fashion assistant</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">SmartChain AI</h3>
                    <p className="text-sm text-gray-600">
                      {isTyping ? 'Typing...' : 'Online'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory && chatHistory.length > 0 ? (
                  chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.role === 'assistant' && (
                            <Bot className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          )}
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Start a conversation with SmartChain AI</p>
                  </div>
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-green-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask SmartChain AI anything..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    disabled={sendMessageMutation.isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sendMessageMutation.isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(action.action)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {suggestions && suggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Suggested Questions
                </h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Item recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Exchange guidance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Pricing suggestions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sustainability tips</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Community guidelines</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">💡 Pro Tips</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>• Ask for styling advice for your items</p>
                <p>• Get help with pricing your clothing</p>
                <p>• Learn about sustainable fashion practices</p>
                <p>• Find similar items in the community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 