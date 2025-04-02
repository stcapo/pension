// 从JSON文件加载数据的工具函数

// 加载老人档案数据
export async function getElderlyProfiles() {
  try {
    const data = await import('../data/elderly-profiles.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading elderly profiles:', error);
    return [];
  }
}

// 加载健康监测数据
export async function getHealthData() {
  try {
    const data = await import('../data/health-data.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading health data:', error);
    return [];
  }
}

// 加载护理服务数据
export async function getCareServices() {
  try {
    const data = await import('../data/care-services.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading care services:', error);
    return [];
  }
}

// 加载药物管理数据
export async function getMedications() {
  try {
    const data = await import('../data/medications.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading medications:', error);
    return [];
  }
}

// 加载活动管理数据
export async function getActivities() {
  try {
    const data = await import('../data/activities.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading activities:', error);
    return [];
  }
}

// 加载营养管理数据
export async function getNutritionPlans() {
  try {
    const data = await import('../data/nutrition-plans.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading nutrition plans:', error);
    return [];
  }
}

// 加载警报信息数据
export async function getAlerts() {
  try {
    const data = await import('../data/alerts.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading alerts:', error);
    return [];
  }
}

// 加载工作人员数据
export async function getStaff() {
  try {
    const data = await import('../data/staff.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading staff data:', error);
    return [];
  }
}

// 加载访客管理数据
export async function getVisitors() {
  try {
    const data = await import('../data/visitors.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading visitors:', error);
    return [];
  }
}

// 加载库存管理数据
export async function getInventory() {
  try {
    const data = await import('../data/inventory.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading inventory:', error);
    return [];
  }
}

// 加载维护管理数据
export async function getMaintenance() {
  try {
    const data = await import('../data/maintenance.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading maintenance data:', error);
    return [];
  }
}

// 加载文档管理数据
export async function getDocuments() {
  try {
    const data = await import('../data/documents.json');
    return data.default || [];
  } catch (error) {
    console.error('Error loading documents:', error);
    return [];
  }
}

// 加载仪表盘摘要数据
export async function getDashboardSummary() {
  try {
    const data = await import('../data/dashboard-summary.json');
    return data.default || {};
  } catch (error) {
    console.error('Error loading dashboard summary:', error);
    return {};
  }
}

// 根据ID获取老人信息
export async function getElderlyById(id) {
  const profiles = await getElderlyProfiles();
  return profiles.find(profile => profile.id === id) || null;
}

// 获取老人的健康数据
export async function getElderlyHealthData(elderlyId) {
  const healthData = await getHealthData();
  return healthData.filter(data => data.elderlyId === elderlyId);
}

// 获取老人的护理服务
export async function getElderlyCareServices(elderlyId) {
  const services = await getCareServices();
  return services.filter(service => service.elderlyId === elderlyId);
}

// 获取老人的药物信息
export async function getElderlyMedications(elderlyId) {
  const medications = await getMedications();
  return medications.filter(med => med.elderlyId === elderlyId);
}

// 获取老人的警报信息
export async function getElderlyAlerts(elderlyId) {
  const alerts = await getAlerts();
  return alerts.filter(alert => alert.elderlyId === elderlyId);
}

// 获取老人的访客记录
export async function getElderlyVisitors(elderlyId) {
  const visitors = await getVisitors();
  return visitors.filter(visitor => visitor.elderlyId === elderlyId);
}

// 获取老人的营养计划
export async function getElderlyNutritionPlan(elderlyId) {
  const plans = await getNutritionPlans();
  return plans.find(plan => plan.elderlyId === elderlyId) || null;
}

// 根据日期范围筛选数据
export function filterDataByDateRange(data, startDate, endDate, dateField = 'date') {
  if (!startDate && !endDate) return data;
  
  const start = startDate ? new Date(startDate) : new Date(0);
  const end = endDate ? new Date(endDate) : new Date();
  
  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= start && itemDate <= end;
  });
}

// 格式化日期显示
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// 格式化日期时间显示
export function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}