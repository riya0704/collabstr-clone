import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  Search,
  ArrowLeft,
  Check,
  CheckCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  _id: string;
  content: {
    text: string;
    attachments: Array<{
      type: string;
      url: string;
      filename: string;
    }>;
  };
  sender: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  type: string;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: Array<{
    user: {
      _id: string;
      profile: {
        name: string;
        avatar?: string;
      };
      userType: string;
    };
    lastSeen: string;
  }>;
  lastMessage?: Message;
  service?: {
    _id: string;
    title: string;
  };
  order?: {
    _id: string;
    orderNumber: string;
    status: string;
  };
  updatedAt: string;
}

const Messages: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      const conversation = conversations.find(c => c._id === conversationId);
      setSelectedConversation(conversation || null);
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations/${convId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || sending) return;

    setSending(true);
    try {
      const response = await axios.post(
        `${API_URL}/messages/conversations/${conversationId}/messages`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Update conversation list
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.user._id !== user?.id);
    return otherParticipant?.user.profile.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const isMessageRead = (message: Message) => {
    return message.readBy.some(read => read.user !== user?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No conversations found
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherParticipant = conversation.participants.find(p => p.user._id !== user?.id);
                    const isSelected = conversation._id === conversationId;
                    
                    return (
                      <div
                        key={conversation._id}
                        onClick={() => window.location.href = `/messages/${conversation._id}`}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          isSelected ? 'bg-primary-50 border-primary-200' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                            {otherParticipant?.user.profile.avatar ? (
                              <img
                                src={otherParticipant.user.profile.avatar}
                                alt={otherParticipant.user.profile.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold">
                                {otherParticipant?.user.profile.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {otherParticipant?.user.profile.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.updatedAt)}
                              </span>
                            </div>
                            
                            {conversation.service && (
                              <p className="text-xs text-primary-600 mb-1">
                                Re: {conversation.service.title}
                              </p>
                            )}
                            
                            {conversation.order && (
                              <p className="text-xs text-green-600 mb-1">
                                Order: {conversation.order.orderNumber}
                              </p>
                            )}
                            
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage.content.text}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => window.history.back()}
                          className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        {(() => {
                          const otherParticipant = selectedConversation.participants.find(p => p.user._id !== user?.id);
                          return (
                            <>
                              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                {otherParticipant?.user.profile.avatar ? (
                                  <img
                                    src={otherParticipant.user.profile.avatar}
                                    alt={otherParticipant.user.profile.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-semibold text-sm">
                                    {otherParticipant?.user.profile.name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              
                              <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                  {otherParticipant?.user.profile.name}
                                </h2>
                                <p className="text-sm text-gray-500 capitalize">
                                  {otherParticipant?.user.userType}
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <Video className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {selectedConversation.service && (
                      <div className="mt-3 p-3 bg-primary-50 rounded-lg">
                        <p className="text-sm text-primary-800">
                          <strong>Service:</strong> {selectedConversation.service.title}
                        </p>
                      </div>
                    )}

                    {selectedConversation.order && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Order:</strong> {selectedConversation.order.orderNumber} 
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {selectedConversation.order.status}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender._id === user?.id;
                      
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                            {!isOwn && (
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="w-6 h-6 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-xs">
                                    {message.sender.profile.name.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {message.sender.profile.name}
                                </span>
                              </div>
                            )}
                            
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isOwn
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content.text}</p>
                              
                              {message.content.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.content.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <Paperclip className="w-4 h-4" />
                                      <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm underline"
                                      >
                                        {attachment.filename}
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-gray-500">
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwn && (
                                <div className="text-gray-500">
                                  {isMessageRead(message) ? (
                                    <CheckCheck className="w-4 h-4 text-primary-600" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-white">
                    <form onSubmit={sendMessage} className="flex items-center space-x-3">
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                          disabled={sending}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;