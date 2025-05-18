import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isUserLoggedIn, getUserRole, getCurrentUserName, logoutUser } from '../../utils/auth-utils';
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineSchedule,
  AiOutlineMessage,
  AiOutlineQuestionCircle,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLogout
} from 'react-icons/ai';

// Navigation items for the user-facing interface
const navItems = [
  { path: '/user', label: '首页', icon: <AiOutlineHome size={20} /> },
  { path: '/user/services', label: '养老服务', icon: <AiOutlineSchedule size={20} /> },
  { path: '/user/health', label: '健康管理', icon: <AiOutlineHeart size={20} /> },
  { path: '/user/appointments', label: '服务预约', icon: <AiOutlineSchedule size={20} /> },
  { path: '/user/family-chat', label: '家人互动', icon: <AiOutlineMessage size={20} /> },
  { path: '/user/consultation', label: '在线咨询', icon: <AiOutlineQuestionCircle size={20} /> },
  { path: '/user/profile', label: '个人中心', icon: <AiOutlineUser size={20} /> },
];

export default function UserLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // 检查用户是否已登录
    if (!isUserLoggedIn()) {
      router.push('/user-login');
      return;
    }

    // 检查用户角色
    const userRole = getUserRole();
    if (userRole === 'admin') {
      router.push('/dashboard');
      return;
    }

    // 获取用户名
    setUserName(getCurrentUserName() || '用户');
  }, [router]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/user-login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/user">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold text-primary">智慧养老</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === item.path
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center ml-4">
                <span className="text-gray-700 mr-2">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <AiOutlineLogout className="mr-1" />
                  退出
                </button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <AiOutlineClose size={24} />
                ) : (
                  <AiOutlineMenu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === item.path
                      ? 'border-primary text-primary bg-primary-50'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              ))}
              <div className="border-t mt-3 pt-3">
                <div className="pl-3 pr-4 py-2 text-sm text-gray-500">
                  当前用户: {userName}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 w-full text-left"
                >
                  <div className="flex items-center">
                    <span className="mr-2"><AiOutlineLogout size={20} /></span>
                    退出登录
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Footer removed */}
    </div>
  );
}
