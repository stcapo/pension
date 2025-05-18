'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isUserLoggedIn, getUserRole } from '../utils/auth-utils';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已登录
    if (isUserLoggedIn()) {
      const userRole = getUserRole();
      // 根据用户角色重定向到不同页面
      if (userRole === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/user');
      }
    } else {
      // 未登录则重定向到用户登录页
      router.push('/user-login');
    }
  }, [router]);

  return null;
}