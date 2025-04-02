import { useState } from 'react';
import { AiOutlineUser, AiOutlineBell, AiOutlineLogout, AiOutlineSetting } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Header({ userName = '管理员' }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const notifications = [
    { id: 1, text: '张阿姨的血压监测数据异常', time: '10分钟前', read: false },
    { id: 2, text: '今日有3位老人的健康检查', time: '30分钟前', read: false },
    { id: 3, text: '李爷爷的家属来访', time: '1小时前', read: true },
  ];

  const handleLogout = () => {
    // 清除登录信息
    Cookies.remove('authToken');
    // 跳转到登录页
    router.push('/login');
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  return (
    <header className="bg-headerBg h-16 flex items-center justify-between px-4 shadow-sm">
      <div>
        {/* 标题或面包屑可以在这里 */}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* 通知图标 */}
        <div className="relative">
          <button onClick={toggleNotifications} className="p-2 rounded-full hover:bg-gray-100 relative">
            <AiOutlineBell size={22} />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20">
              <div className="p-3 border-b">
                <h3 className="font-medium">通知</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <p className="text-sm">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center">
                <button className="text-primary text-sm hover:underline">查看全部</button>
              </div>
            </div>
          )}
        </div>
        
        {/* 用户菜单 */}
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              <AiOutlineUser size={18} />
            </div>
            <span>{userName}</span>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <AiOutlineUser className="mr-2" size={16} />
                  个人资料
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <AiOutlineSetting className="mr-2" size={16} />
                  系统设置
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <AiOutlineLogout className="mr-2" size={16} />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}