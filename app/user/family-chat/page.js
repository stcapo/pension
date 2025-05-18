'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  AiOutlineMessage, 
  AiOutlineSend, 
  AiOutlineUser, 
  AiOutlinePicture,
  AiOutlineSmile,
  AiOutlineInfoCircle,
  AiOutlinePhone,
  AiOutlineVideoCamera
} from 'react-icons/ai';
import { AiOutlineSearch } from 'react-icons/ai';
import UserLayout from '../../../components/layout/UserLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function FamilyChatPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockContacts = [
        {
          id: 1,
          name: '张天硕',
          relationship: '儿子',
          avatar: 'https://img0.baidu.com/it/u=3421563612,2267149094&fm=253&fmt=auto&app=138&f=JPEG?w=276&h=394',
          lastMessage: '今天过得怎么样？',
          lastMessageTime: '10:30',
          unread: 2,
          online: true,
        },
      ];
      
      setContacts(mockContacts);
      setSelectedContact(mockContacts[0]);
      
      const mockMessages = [
        {
          id: 1,
          senderId: 1,
          receiverId: 0, // 0 represents the current user
          content: '早上好，妈妈！今天感觉怎么样？',
          timestamp: '09:15',
          date: '今天',
        },
        {
          id: 2,
          senderId: 0,
          receiverId: 1,
          content: '早上好，小明！我今天感觉很好，刚吃完早饭。',
          timestamp: '09:20',
          date: '今天',
        },
        {
          id: 3,
          senderId: 1,
          receiverId: 0,
          content: '太好了！您记得按时吃药了吗？',
          timestamp: '09:25',
          date: '今天',
        },
        {
          id: 4,
          senderId: 0,
          receiverId: 1,
          content: '记得的，我很注意这个。今天社区有太极拳活动，我准备去参加。',
          timestamp: '09:28',
          date: '今天',
        },
        {
          id: 5,
          senderId: 1,
          receiverId: 0,
          content: '那很好啊！锻炼身体很重要。注意不要太累了。',
          timestamp: '09:30',
          date: '今天',
        },
        {
          id: 6,
          senderId: 1,
          receiverId: 0,
          content: '今天过得怎么样？',
          timestamp: '10:30',
          date: '今天',
        },
      ];
      
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    // Mark messages as read
    setContacts(prev => 
      prev.map(c => 
        c.id === contact.id ? { ...c, unread: 0 } : c
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      senderId: 0, // Current user
      receiverId: selectedContact.id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: '今天',
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // Update last message in contacts
    setContacts(prev => 
      prev.map(c => 
        c.id === selectedContact.id 
          ? { 
              ...c, 
              lastMessage: newMessage, 
              lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            } 
          : c
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">家人互动</h1>
        <p className="text-gray-600 mt-2">
          与家人保持联系，分享您的日常生活
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm h-[600px] animate-pulse"></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px] flex">
          {/* Contacts List */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索联系人..."
                  className="input-field pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineSearch className="text-gray-400" size={20} />
                </div>
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(600px-65px)]">
              {contacts.map(contact => (
                <div
                  key={contact.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-800">{contact.name}</h3>
                        <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                        {contact.unread > 0 && (
                          <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{contact.relationship}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="hidden md:flex md:flex-col md:flex-grow">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">{selectedContact.name}</h3>
                      <p className="text-xs text-gray-500">{selectedContact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <AiOutlinePhone size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <AiOutlineVideoCamera size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <AiOutlineInfoCircle size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === 0;
                    const showDate = index === 0 || messages[index - 1].date !== message.date;
                    
                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                              {message.date}
                            </span>
                          </div>
                        )}
                        <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          {!isCurrentUser && (
                            <img
                              src={selectedContact.avatar}
                              alt={selectedContact.name}
                              className="w-8 h-8 rounded-full object-cover mr-2"
                            />
                          )}
                          <div className={`max-w-[70%]`}>
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isCurrentUser
                                  ? 'bg-primary text-white rounded-tr-none'
                                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                              {message.timestamp}
                            </p>
                          </div>
                          {isCurrentUser && (
                            <img
                              src="https://img0.baidu.com/it/u=3181891204,123474442&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705"
                              alt="You"
                              className="w-8 h-8 rounded-full object-cover ml-2"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center">
                    <button className="p-2 rounded-full hover:bg-gray-100 mr-1">
                      <AiOutlineSmile size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 mr-1">
                      <AiOutlinePicture size={20} className="text-gray-600" />
                    </button>
                    <div className="flex-grow">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="输入消息..."
                        className="input-field resize-none"
                        rows={1}
                      />
                    </div>
                    <button
                      className="ml-2 p-2 bg-primary text-white rounded-full hover:bg-primary-dark"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <AiOutlineSend size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <AiOutlineMessage size={48} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-600">选择一个联系人开始聊天</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile: No Contact Selected */}
          {!selectedContact && (
            <div className="flex-grow flex items-center justify-center md:hidden">
              <div className="text-center">
                <AiOutlineMessage size={48} className="mx-auto text-gray-400" />
                <p className="mt-2 text-gray-600">选择一个联系人开始聊天</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Daily Life Sharing */}
      <div className="mt-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">日常生活分享</h2>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowShareModal(true)}
            >
              分享动态
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start">
                <img
                  src="https://img0.baidu.com/it/u=3181891204,123474442&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705"
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800">我</h3>
                    <span className="text-xs text-gray-500 ml-2">今天 08:30</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    今天参加了社区的太极拳活动，认识了几位新朋友，感觉很开心！
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <img
                      src="https://img0.baidu.com/it/u=3181891204,123474442&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705"
                      alt="Activity"
                      className="rounded-lg w-full h-24 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80"
                      alt="Activity"
                      className="rounded-lg w-full h-24 object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                      alt="Activity"
                      className="rounded-lg w-full h-24 object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center text-gray-500 text-sm">
                    <div className="flex items-center mr-4">
                      <AiOutlineSmile className="mr-1" />
                      <span>3人点赞</span>
                    </div>
                    <div className="flex items-center">
                      <AiOutlineMessage className="mr-1" />
                      <span>2条评论</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-start">
                <img
                  src="https://img0.baidu.com/it/u=3181891204,123474442&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705"
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800">我</h3>
                    <span className="text-xs text-gray-500 ml-2">昨天 15:45</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    今天的午餐很丰盛，营养师特别为我准备的健康餐，味道不错！
                  </p>
                  <div className="mt-3">
                    <img
                      src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                      alt="Meal"
                      className="rounded-lg w-full max-h-64 object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center text-gray-500 text-sm">
                    <div className="flex items-center mr-4">
                      <AiOutlineSmile className="mr-1" />
                      <span>5人点赞</span>
                    </div>
                    <div className="flex items-center">
                      <AiOutlineMessage className="mr-1" />
                      <span>3条评论</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </UserLayout>
  );
}
