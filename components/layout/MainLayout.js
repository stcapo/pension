import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // 检查用户是否登录
  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (!authToken && pathname !== '/login') {
      router.push('/login');
    }
  }, [router, pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 如果是登录页，不显示主布局
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header />
        
        <main className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}