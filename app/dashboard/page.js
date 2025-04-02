'use client';

import { useState, useEffect } from 'react';
import { 
  AiOutlineHome, 
  AiOutlineUser, 
  AiOutlineHeart, 
  AiOutlineAlert,
  AiOutlineBarChart,
  AiOutlineSchedule,
  AiOutlineMedicineBox,
  AiOutlineTeam
} from 'react-icons/ai';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { getDashboardSummary, getAlerts, getElderlyProfiles, getActivities } from '../../utils/data-utils';

export default function Dashboard() {
  const [summary, setSummary] = useState({
    elderlyCount: 0,
    todayAlerts: 0,
    pendingServices: 0,
    healthStatusDistribution: [],
    alertTypeDistribution: [],
    healthAnomalies7Days: [],
    currentOccupancyRate: 0,
    avgCareHoursPerElderly: '',
    medicationCompliance: '',
    residentSatisfaction: '',
    quickStats: {
      activeActivities: 0,
      bedsAvailable: 0,
      staffOnDuty: 0,
      mealsServedToday: 0
    }
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 加载仪表盘摘要数据
        const summaryData = await getDashboardSummary();
        setSummary(summaryData);

        // 加载警报数据
        const alertsData = await getAlerts();
        // 获取最近5个警报
        const recent = alertsData
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5);
        setRecentAlerts(recent);

        // 加载老人档案数据
        const profilesData = await getElderlyProfiles();
        setElderlyProfiles(profilesData);

        // 加载即将到来的活动
        const activitiesData = await getActivities();
        const upcoming = activitiesData
          .filter(activity => activity.status === '未开始')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setUpcomingActivities(upcoming);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 格式化日期显示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 渲染健康状态分布
  const renderHealthStatusChart = () => {
    if (!summary.healthStatusDistribution || summary.healthStatusDistribution.length === 0) {
      return <p className="text-gray-500">暂无数据</p>;
    }

    return (
      <div className="mt-4">
        {summary.healthStatusDistribution.map((item) => (
          <div key={item.status} className="mb-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">{item.status}</span>
              <span className="text-sm text-gray-600">{item.count}人 ({item.percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染最近警报
  const renderRecentAlerts = () => {
    if (recentAlerts.length === 0) {
      return <p className="text-gray-500">暂无最近警报</p>;
    }

    return recentAlerts.map((alert) => (
      <div key={alert.id} className="mb-3 p-3 bg-gray-50 rounded-md">
        <div className="flex items-start">
          <div className={`rounded-full p-2 mr-3 ${
            alert.alertLevel === '紧急' ? 'bg-red-100 text-red-600' : 
            alert.alertLevel === '高' ? 'bg-orange-100 text-orange-600' :
            alert.alertLevel === '中' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <AiOutlineAlert />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{alert.elderlyName}: {alert.alertType}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(alert.timestamp).toLocaleString('zh-CN', { 
                month: 'numeric', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            alert.status === '待处理' ? 'bg-red-100 text-red-600' : 
            alert.status === '处理中' ? 'bg-yellow-100 text-yellow-600' :
            'bg-green-100 text-green-600'
          }`}>
            {alert.status}
          </div>
        </div>
      </div>
    ));
  };

  // 渲染即将到来的活动
  const renderUpcomingActivities = () => {
    if (upcomingActivities.length === 0) {
      return <p className="text-gray-500">暂无即将到来的活动</p>;
    }

    return upcomingActivities.map((activity) => (
      <div key={activity.id} className="mb-3 p-3 bg-gray-50 rounded-md">
        <p className="font-medium">{activity.activityName}</p>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-600">
            {formatDate(activity.date)} {activity.startTime}
          </span>
          <span className="text-gray-600">
            {activity.location} | {activity.currentParticipants}/{activity.maxParticipants}人
          </span>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">欢迎使用智慧养老系统</h1>
        <p className="text-gray-600 mt-1">实时监控养老机构各项指标，提供全面的数据分析</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="入住老人"
          value={summary.elderlyCount}
          icon={<AiOutlineUser size={20} />}
          change={2.5}
          isPositive={true}
          linkTo="/elderly-profiles"
          color="blue"
        />
        <StatCard
          title="今日警报"
          value={summary.todayAlerts}
          icon={<AiOutlineAlert size={20} />}
          change={-5.8}
          isPositive={false}
          linkTo="/alerts"
          color="red"
        />
        <StatCard
          title="待执行服务"
          value={summary.pendingServices}
          icon={<AiOutlineMedicineBox size={20} />}
          linkTo="/care-services"
          color="yellow"
        />
        <StatCard
          title="活跃活动"
          value={summary.quickStats.activeActivities}
          icon={<AiOutlineSchedule size={20} />}
          change={12.3}
          isPositive={true}
          linkTo="/activity-management"
          color="green"
        />
      </div>

      {/* 紧急警报提醒 */}
      {recentAlerts.some(alert => alert.alertLevel === '紧急' && alert.status === '待处理') && (
        <Alert
          type="error"
          title="紧急警报"
          message="有紧急情况需要处理，请立即查看警报详情"
          className="mb-6"
          closable
        />
      )}

      {/* 内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* 左侧内容 */}
        <div className="col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card
              title="入住率"
              headerClassName="bg-blue-50"
              bodyClassName="p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{summary.currentOccupancyRate}%</p>
                  <p className="text-sm text-gray-500">当前入住率</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">{summary.elderlyCount}人</p>
                  <p className="text-sm text-gray-500">总入住人数</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">{summary.quickStats.bedsAvailable}张</p>
                  <p className="text-sm text-gray-500">可用床位</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${summary.currentOccupancyRate}%` }}
                ></div>
              </div>
            </Card>

            <Card
              title="照护数据"
              headerClassName="bg-green-50"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">平均照护时间</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{summary.avgCareHoursPerElderly}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">药物依从率</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{summary.medicationCompliance}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">住户满意度</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{summary.residentSatisfaction}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">今日供餐</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">{summary.quickStats.mealsServedToday}份</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <Card
              title="健康异常趋势 (近7天)"
              headerClassName="bg-red-50"
            >
              <div className="pt-3">
                <div className="flex justify-between mb-2">
                  {summary.healthAnomalies7Days.map((day, index) => (
                    <div key={index} className="text-center flex-1">
                      <div 
                        className="mx-auto bg-red-500 rounded-t-md transition-all duration-500"
                        style={{ 
                          height: `${day.count * 12}px`,
                          width: '24px',
                          minHeight: '4px'
                        }}
                      ></div>
                      <p className="text-xs mt-1 text-gray-500">{formatDate(day.date)}</p>
                      <p className="text-sm font-medium">{day.count}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <Button 
                    size="sm" 
                    variant="outline"
                  >
                    查看详情
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="最近警报"
              icon={<AiOutlineAlert size={18} />}
              headerClassName="bg-red-50"
              footer={
                <div className="text-center">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.location.href = '/alerts'}
                  >
                    查看全部警报
                  </Button>
                </div>
              }
            >
              {renderRecentAlerts()}
            </Card>

            <Card
              title="即将开始的活动"
              icon={<AiOutlineSchedule size={18} />}
              headerClassName="bg-blue-50"
              footer={
                <div className="text-center">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.location.href = '/activity-management'}
                  >
                    查看全部活动
                  </Button>
                </div>
              }
            >
              {renderUpcomingActivities()}
            </Card>
          </div>
        </div>

        {/* 右侧侧边栏 */}
        <div className="col-span-4">
          <Card
            title="健康状态分布"
            icon={<AiOutlineHeart size={18} />}
            headerClassName="bg-green-50"
            className="mb-6"
          >
            {renderHealthStatusChart()}
          </Card>

          <Card
            title="工作人员值班情况"
            icon={<AiOutlineTeam size={18} />}
            headerClassName="bg-yellow-50"
            className="mb-6"
          >
            <div className="text-center py-3">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {summary.quickStats.staffOnDuty}
              </div>
              <p className="text-gray-500">今日在岗人数</p>
              <div className="mt-4 flex justify-center space-x-1">
                {[...Array(Math.min(8, summary.quickStats.staffOnDuty))].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600"
                  >
                    <AiOutlineUser />
                  </div>
                ))}
                {summary.quickStats.staffOnDuty > 8 && (
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                    +{summary.quickStats.staffOnDuty - 8}
                  </div>
                )}
              </div>
              <Button 
                className="mt-4" 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = '/staff'}
              >
                查看详情
              </Button>
            </div>
          </Card>

          <Card
            title="快速导航"
            icon={<AiOutlineHome size={18} />}
            headerClassName="bg-blue-50"
          >
            <div className="grid grid-cols-2 gap-3 p-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/elderly-profiles'}
                className="flex items-center justify-center"
                icon={<AiOutlineUser className="mr-1" />}
              >
                老人档案
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/health-monitoring'}
                className="flex items-center justify-center"
                icon={<AiOutlineHeart className="mr-1" />}
              >
                健康监测
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/care-services'}
                className="flex items-center justify-center"
                icon={<AiOutlineMedicineBox className="mr-1" />}
              >
                护理服务
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/activity-management'}
                className="flex items-center justify-center"
                icon={<AiOutlineSchedule className="mr-1" />}
              >
                活动管理
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/alerts'}
                className="flex items-center justify-center"
                icon={<AiOutlineAlert className="mr-1" />}
              >
                警报信息
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/staff'}
                className="flex items-center justify-center"
                icon={<AiOutlineTeam className="mr-1" />}
              >
                工作人员
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}