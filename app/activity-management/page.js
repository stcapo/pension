'use client';

import { useState, useEffect } from 'react';
import { 
  AiOutlinePlus, 
  AiOutlineUser, 
  AiOutlineCalendar, 
  AiOutlineClockCircle,
  AiOutlineEnvironment,
  AiOutlineTeam,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineFilter,
  AiOutlineSchedule,
  AiOutlineSound,
  AiOutlineCheck
} from 'react-icons/ai';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import Alert from '../../components/ui/Alert';
import { getActivities, getElderlyProfiles, formatDate } from '../../utils/data-utils';

export default function ActivityManagement() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    activityName: '',
    location: '',
    dateRange: 'all' // all, upcoming, past
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有活动数据
        const activityData = await getActivities();
        setActivities(activityData);
        
        // 加载所有老人档案数据（用于添加活动时选择参与者）
        const profiles = await getElderlyProfiles();
        setElderlyProfiles(profiles);
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [activities, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...activities];
    
    // 按活动名称筛选
    if (filterParams.activityName) {
      result = result.filter(activity => 
        activity.activityName.includes(filterParams.activityName)
      );
    }
    
    // 按地点筛选
    if (filterParams.location) {
      result = result.filter(activity => 
        activity.location.includes(filterParams.location)
      );
    }
    
    // 按日期范围筛选
    const today = new Date().toISOString().split('T')[0];
    if (filterParams.dateRange === 'upcoming') {
      result = result.filter(activity => activity.date >= today);
    } else if (filterParams.dateRange === 'past') {
      result = result.filter(activity => activity.date < today);
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'upcoming') {
      result = result.filter(activity => activity.date >= today && activity.status === '未开始');
    } else if (activeTab === 'ongoing') {
      result = result.filter(activity => activity.status === '进行中');
    } else if (activeTab === 'completed') {
      result = result.filter(activity => activity.status === '已结束');
    }
    
    // 按日期排序
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setFilteredActivities(result);
  };

  const handleAddActivity = () => {
    setIsAddModalOpen(true);
  };

  const handleViewActivity = (activity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const handleFilterButtonClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterSubmit = () => {
    applyFilters();
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setFilterParams({
      activityName: '',
      location: '',
      dateRange: 'all'
    });
  };

  // 获取今天的活动
  const getTodayActivities = () => {
    const today = new Date().toISOString().split('T')[0];
    return activities.filter(activity => activity.date === today);
  };

  // 表格列定义
  const columns = [
    { 
      title: '活动名称', 
      dataIndex: 'activityName',
      width: '150px',
      render: (record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
            <AiOutlineSchedule />
          </div>
          <span className="font-medium">{record.activityName}</span>
        </div>
      )
    },
    { 
      title: '日期', 
      dataIndex: 'date',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineCalendar className="text-gray-500 mr-1" />
          <span>{record.date}</span>
        </div>
      )
    },
    { 
      title: '时间', 
      width: '120px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineClockCircle className="text-gray-500 mr-1" />
          <span>{record.startTime} - {record.endTime}</span>
        </div>
      )
    },
    { 
      title: '地点', 
      dataIndex: 'location',
      width: '120px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineEnvironment className="text-gray-500 mr-1" />
          <span>{record.location}</span>
        </div>
      )
    },
    { 
      title: '参与人数', 
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineTeam className="text-gray-500 mr-1" />
          <span>{record.currentParticipants}/{record.maxParticipants}</span>
        </div>
      )
    },
    { 
      title: '组织者', 
      dataIndex: 'organizer',
      width: '100px'
    },
    { 
      title: '状态', 
      dataIndex: 'status',
      width: '100px',
      render: (record) => {
        const statusColors = {
          '未开始': 'bg-blue-100 text-blue-800',
          '进行中': 'bg-green-100 text-green-800',
          '已结束': 'bg-gray-100 text-gray-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[record.status] || 'bg-gray-100'}`}>
            {record.status}
          </span>
        );
      }
    },
    {
      title: '操作',
      width: '100px',
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewActivity(record)}
          >
            详情
          </Button>
        </div>
      )
    }
  ];

  // 渲染添加活动模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加活动"
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
            >
              保存
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="活动名称"
            name="activityName"
            placeholder="请输入活动名称"
            required
          />
          <FormField
            label="活动类型"
            name="activityType"
            type="select"
            options={[
              { value: '棋牌活动', label: '棋牌活动' },
              { value: '文艺表演', label: '文艺表演' },
              { value: '健康讲座', label: '健康讲座' },
              { value: '手工制作', label: '手工制作' },
              { value: '户外散步', label: '户外散步' },
              { value: '园艺活动', label: '园艺活动' },
              { value: '太极拳', label: '太极拳' },
              { value: '歌唱活动', label: '歌唱活动' },
              { value: '舞蹈活动', label: '舞蹈活动' },
              { value: '书法活动', label: '书法活动' }
            ]}
            required
          />
          <FormField
            label="活动日期"
            name="date"
            type="date"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="开始时间"
              name="startTime"
              type="time"
              required
            />
            <FormField
              label="结束时间"
              name="endTime"
              type="time"
              required
            />
          </div>
          <FormField
            label="活动地点"
            name="location"
            type="select"
            options={[
              { value: '活动室', label: '活动室' },
              { value: '花园', label: '花园' },
              { value: '多功能厅', label: '多功能厅' },
              { value: '康复中心', label: '康复中心' },
              { value: '户外场地', label: '户外场地' },
              { value: '阅览室', label: '阅览室' }
            ]}
            required
          />
          <FormField
            label="组织者"
            name="organizer"
            placeholder="组织者姓名"
            required
          />
          <FormField
            label="最大参与人数"
            name="maxParticipants"
            type="number"
            min="1"
            required
          />
          <FormField
            label="当前参与人数"
            name="currentParticipants"
            type="number"
            min="0"
            required
          />
          <FormField
            label="状态"
            name="status"
            type="select"
            options={[
              { value: '未开始', label: '未开始' },
              { value: '进行中', label: '进行中' },
              { value: '已结束', label: '已结束' }
            ]}
            required
          />
          <div className="col-span-2">
            <FormField
              label="活动描述"
              name="description"
              type="textarea"
              placeholder="请描述活动内容"
              required
            />
          </div>
          <FormField
            label="所需设备"
            name="equipmentNeeded"
            placeholder="所需设备和物品"
          />
          <div className="col-span-2">
            <FormField
              label="备注"
              name="notes"
              type="textarea"
              placeholder="其他说明或注意事项"
            />
          </div>
        </div>
      </Modal>
    );
  };

  // 渲染活动详情模态框
  const renderDetailModal = () => {
    if (!selectedActivity) return null;
    
    // 确定当前日期，用于判断活动状态
    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedActivity.date === today;
    const isPast = selectedActivity.date < today;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="活动详情"
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              关闭
            </Button>
            {!isPast && selectedActivity.status !== '已结束' && (
              <Button
                variant="primary"
                icon={<AiOutlineEdit size={16} />}
              >
                编辑
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
              <AiOutlineSchedule size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{selectedActivity.activityName}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <AiOutlineCalendar className="mr-1" />
                <span>{selectedActivity.date}</span>
                <span className="mx-2">|</span>
                <AiOutlineClockCircle className="mr-1" />
                <span>{selectedActivity.startTime} - {selectedActivity.endTime}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-700">地点</p>
                <p className="font-medium flex items-center mt-1">
                  <AiOutlineEnvironment className="mr-1" />
                  {selectedActivity.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">参与人数</p>
                <p className="font-medium flex items-center mt-1">
                  <AiOutlineTeam className="mr-1" />
                  {selectedActivity.currentParticipants}/{selectedActivity.maxParticipants}人
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">状态</p>
                <p className="font-medium mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedActivity.status === '未开始' ? 'bg-blue-100 text-blue-800' :
                    selectedActivity.status === '进行中' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedActivity.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">活动描述</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p>{selectedActivity.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-2">组织信息</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="mb-2">
                  <span className="text-gray-600">组织者:</span> {selectedActivity.organizer}
                </p>
                <p>
                  <span className="text-gray-600">所需设备:</span> {selectedActivity.equipmentNeeded || '无特殊要求'}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">参与信息</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="mb-2">
                  <span className="text-gray-600">当前人数:</span> {selectedActivity.currentParticipants}人
                </p>
                <p>
                  <span className="text-gray-600">空余名额:</span> {selectedActivity.maxParticipants - selectedActivity.currentParticipants}人
                </p>
              </div>
            </div>
          </div>
          
          {selectedActivity.notes && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">备注</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p>{selectedActivity.notes}</p>
              </div>
            </div>
          )}
          
          {isToday && selectedActivity.status !== '已结束' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="primary"
                icon={<AiOutlineSound size={16} />}
                className="bg-green-600 hover:bg-green-700"
              >
                广播提醒参与者
              </Button>
              <Button
                variant="primary"
                icon={<AiOutlineCheck size={16} />}
                className="bg-blue-600 hover:bg-blue-700"
              >
                标记为已完成
              </Button>
            </div>
          )}
          
          {!isToday && !isPast && (
            <div>
              <Button
                variant="primary"
                icon={<AiOutlineTeam size={16} />}
                fullWidth
              >
                管理参与人员
              </Button>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // 渲染筛选模态框
  const renderFilterModal = () => {
    return (
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="筛选活动"
        size="md"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleResetFilters}
            >
              重置
            </Button>
            <Button
              variant="primary"
              onClick={handleFilterSubmit}
            >
              应用筛选
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            label="活动名称"
            name="activityName"
            placeholder="输入活动名称搜索"
            value={filterParams.activityName}
            onChange={(e) => setFilterParams(prev => ({ ...prev, activityName: e.target.value }))}
          />
          
          <FormField
            label="地点"
            name="location"
            placeholder="输入地点搜索"
            value={filterParams.location}
            onChange={(e) => setFilterParams(prev => ({ ...prev, location: e.target.value }))}
          />
          
          <FormField
            label="日期范围"
            name="dateRange"
            type="select"
            value={filterParams.dateRange}
            onChange={(e) => setFilterParams(prev => ({ ...prev, dateRange: e.target.value }))}
            options={[
              { value: 'all', label: '所有日期' },
              { value: 'upcoming', label: '即将到来' },
              { value: 'past', label: '已过期' }
            ]}
          />
        </div>
      </Modal>
    );
  };

  // 获取今日活动和即将到来的活动
  const todayActivities = getTodayActivities();
  
  // 获取未来7天的活动
  const getUpcomingActivities = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= today && activityDate <= nextWeek && activity.status !== '已结束';
    });
  };
  
  const upcomingActivities = getUpcomingActivities();

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
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">活动管理</h1>
          <p className="text-gray-600 mt-1">管理老人娱乐、文化和社交活动</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button 
            variant="outline" 
            icon={<AiOutlineFilter size={16} />}
            onClick={handleFilterButtonClick}
          >
            筛选
          </Button>
          <Button 
            variant="primary" 
            icon={<AiOutlinePlus size={16} />}
            onClick={handleAddActivity}
          >
            添加活动
          </Button>
        </div>
      </div>

      {/* 今日活动卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card
          title="今日活动"
          icon={<AiOutlineSchedule size={18} />}
          headerClassName="bg-blue-50"
        >
          {todayActivities.length > 0 ? (
            <div className="space-y-3">
              {todayActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="bg-gray-50 p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleViewActivity(activity)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{activity.activityName}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activity.status === '未开始' ? 'bg-blue-100 text-blue-800' :
                      activity.status === '进行中' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <AiOutlineClockCircle className="mr-1" />
                    <span>{activity.startTime} - {activity.endTime}</span>
                    <span className="mx-2">|</span>
                    <AiOutlineEnvironment className="mr-1" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">
                      组织者: {activity.organizer}
                    </span>
                    <span className="text-gray-600 flex items-center">
                      <AiOutlineTeam className="mr-1" />
                      {activity.currentParticipants}/{activity.maxParticipants}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">
              <AiOutlineSchedule size={48} className="mx-auto text-gray-300 mb-2" />
              <p>今日暂无活动安排</p>
            </div>
          )}
        </Card>
        
        <Card
          title="即将到来的活动"
          icon={<AiOutlineCalendar size={18} />}
          headerClassName="bg-green-50"
        >
          {upcomingActivities.length > 0 ? (
            <div className="space-y-3">
              {upcomingActivities.slice(0, 3).map((activity) => (
                <div 
                  key={activity.id} 
                  className="bg-gray-50 p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleViewActivity(activity)}
                >
                  <div className="flex justify-between">
                    <div className="font-medium">{activity.activityName}</div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {activity.date}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <AiOutlineClockCircle className="mr-1" />
                    <span>{activity.startTime} - {activity.endTime}</span>
                    <span className="mx-2">|</span>
                    <AiOutlineEnvironment className="mr-1" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">
                      组织者: {activity.organizer}
                    </span>
                    <span className="text-gray-600 flex items-center">
                      <AiOutlineTeam className="mr-1" />
                      {activity.currentParticipants}/{activity.maxParticipants}
                    </span>
                  </div>
                </div>
              ))}
              
              {upcomingActivities.length > 3 && (
                <div className="text-center pt-2">
                  <Button 
                    variant="text" 
                    size="sm"
                    onClick={() => setActiveTab('upcoming')}
                  >
                    查看更多 ({upcomingActivities.length - 3})
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">
              <AiOutlineCalendar size={48} className="mx-auto text-gray-300 mb-2" />
              <p>未来7天内暂无活动安排</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="mb-6">
        <div className="mb-4">
          <Tabs
            tabs={[
              { key: 'all', label: '全部活动', content: null },
              { key: 'upcoming', label: '即将到来', content: null },
              { key: 'ongoing', label: '进行中', content: null },
              { key: 'completed', label: '已结束', content: null }
            ]}
            defaultActiveKey="all"
            onChange={(key) => setActiveTab(key)}
          />
        </div>

        <Table
          columns={columns}
          data={filteredActivities}
          emptyMessage="暂无活动数据"
        />
      </Card>

      {renderAddModal()}
      {renderDetailModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}