'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai';
import Alert from '../../components/ui/Alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 简单的登录验证，任何用户名密码都可登录
    setTimeout(() => {
      if (username && password) {
        // 存储登录信息到cookies
        Cookies.set('authToken', 'simulated-auth-token', { expires: 1 });
        Cookies.set('userName', username, { expires: 1 });
        
        // 重定向到仪表盘
        router.push('/dashboard');
      } else {
        setError('请输入用户名和密码');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-primary py-6 px-6">
          <h2 className="text-2xl font-bold text-white text-center">智慧养老系统</h2>
          <p className="text-blue-100 text-center mt-1">综合管理平台</p>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-800 mb-6 text-center">用户登录</h3>
          
          {error && (
            <Alert 
              type="error" 
              message={error} 
              className="mb-4" 
              closable 
              onClose={() => setError('')}
            />
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="请输入用户名"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="请输入密码"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  记住我
                </label>
              </div>
              
              <a className="text-sm text-primary hover:underline" href="#">
                忘记密码?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>本系统仅限授权人员使用</p>
          </div>
        </div>
      </div>
    </div>
  );
}