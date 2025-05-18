import Cookies from 'js-cookie';

// 加载用户数据
export async function getUsers() {
  try {
    const data = await import('../data/user.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading user data:', error);
    return [];
  }
}

// 用户登录验证
export async function loginUser(username, password) {
  const users = await getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // 存储登录信息到cookies
    Cookies.set('authToken', `user-token-${user.id}`, { expires: 1 });
    Cookies.set('userId', user.id.toString(), { expires: 1 });
    Cookies.set('userName', user.name, { expires: 1 });
    Cookies.set('userRole', user.role, { expires: 1 });
    
    return { success: true, user };
  }
  
  return { success: false, message: '用户名或密码错误' };
}

// 检查用户是否已登录
export function isUserLoggedIn() {
  const authToken = Cookies.get('authToken');
  const userRole = Cookies.get('userRole');
  
  return !!authToken && !!userRole;
}

// 检查用户角色
export function getUserRole() {
  return Cookies.get('userRole');
}

// 获取当前登录用户ID
export function getCurrentUserId() {
  return Cookies.get('userId');
}

// 获取当前登录用户名
export function getCurrentUserName() {
  return Cookies.get('userName');
}

// 用户登出
export function logoutUser() {
  Cookies.remove('authToken');
  Cookies.remove('userId');
  Cookies.remove('userName');
  Cookies.remove('userRole');
}
