import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  AiOutlineDashboard, 
  AiOutlineUser, 
  AiOutlineHeart, 
  AiOutlineMedicineBox,
  AiOutlineSchedule,
  AiOutlineAlert,
  AiOutlineTeam,
  AiOutlineUserSwitch,
  AiOutlineDatabase,
  AiOutlineTool,
  AiOutlineFile,
  AiOutlineMenu,
  AiOutlineApple
} from 'react-icons/ai';

const menuItems = [
  { path: '/dashboard', label: '仪表盘', icon: <AiOutlineDashboard size={20} /> },
  { path: '/elderly-profiles', label: '老年人档案', icon: <AiOutlineUser size={20} /> },
  { path: '/health-monitoring', label: '健康监测', icon: <AiOutlineHeart size={20} /> },
  { path: '/care-services', label: '护理服务', icon: <AiOutlineMedicineBox size={20} /> },
  { path: '/medication-management', label: '药物管理', icon: <AiOutlineMedicineBox size={20} /> },
  { path: '/activity-management', label: '活动管理', icon: <AiOutlineSchedule size={20} /> },
  { path: '/nutrition-management', label: '营养管理', icon: <AiOutlineApple size={20} /> },
  { path: '/alerts', label: '警报信息', icon: <AiOutlineAlert size={20} /> },
  { path: '/staff', label: '工作人员', icon: <AiOutlineTeam size={20} /> },
  { path: '/visitor-management', label: '访客管理', icon: <AiOutlineUserSwitch size={20} /> },
  { path: '/inventory-management', label: '库存管理', icon: <AiOutlineDatabase size={20} /> },
  { path: '/maintenance', label: '维护管理', icon: <AiOutlineTool size={20} /> },
  { path: '/document-management', label: '文档管理', icon: <AiOutlineFile size={20} /> },
];

export default function Sidebar({ collapsed, toggleSidebar }) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    // 设置当前活动项目
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <div className={`bg-sidebarBg h-screen ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 shadow-md fixed left-0 top-0 z-10`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h1 className="text-lg font-bold text-primary">智慧养老系统</h1>}
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-gray-200">
          <AiOutlineMenu size={20} />
        </button>
      </div>
      
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div className={`sidebar-item ${activeItem === item.path ? 'active' : ''}`}>
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}