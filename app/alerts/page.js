'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  AiOutlineUser, 
  AiOutlineAlert,
  AiOutlineFilter,
  AiOutlineBell,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineClockCircle,
  AiOutlineEnvironment,
  AiOutlineSetting,
  AiOutlineTeam,
  AiOutlineSound,
  AiOutlineFlag
} from 'react-icons/ai';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import Alert from '../../components/ui/Alert';
import { getAlerts, getElderlyProfiles, getElderlyById, formatDateTime } from '../../utils/data-utils';

// 警报条目组件 - 用于复用
const AlertItem = ({ alert, onClick }) => {
  const alertLevelColors = {
    '紧急': 'bg-red-100 text-red-800 border-red-300',
    '高': 'bg-orange-100 text-orange-800 border-orange-300',
    '中': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    '低': 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const statusColors = {
    '待处理': 'bg-red-100 text-red-800',
    '处理中': 'bg-yellow-100 text-yellow-800',
    '已解决': 'bg-green-100 text-green-800',
    '已关闭': 'bg-gray-100 text-gray-800'
  };

  const alertIcon = {
    '健康异常': <AiOutlineAlert size={18} />,
    '摔倒': <AiOutlineAlert size={18} />,
    '走失': <AiOutlineFlag size={18} />,
    '药物漏服': <AiOutlineBell size={18} />,
    '情绪异常': <AiOutlineAlert size={18} />,
    '饮食异常': <AiOutlineAlert size={18} />,
    '生活设施故障': <AiOutlineSetting size={18} />
  };

  return (
    <div 
      className={`p-3 border-l-4 rounded-md mb-3 hover:shadow-md transition-shadow cursor-pointer ${alertLevelColors[alert.alertLevel] || 'border-gray-300 bg-gray-50'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-3 ${alertLevelColors[alert.alertLevel].split(' ')[0]}`}>
            {alertIcon[alert.alertType] || <AiOutlineAlert size={18} />}
          </div>
          <div>
            <h4 className="font-medium">{alert.elderlyName}</h4>
            <p className="text-sm mt-1">{alert.description}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <AiOutlineClockCircle className="mr-1" />
              <span>{formatDateTime(alert.timestamp)}</span>
              {alert.location && (
                <>
                  <span className="mx-1">|</span>
                  <AiOutlineEnvironment className="mr-1" />
                  <span>{alert.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div>
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[alert.status] || 'bg-gray-100'}`}>
            {alert.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    elderlyId: '',
    alertLevel: '',
    alertType: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  
  const searchParams = useSearchParams();
  const elderlyIdParam = searchParams.get('elderlyId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有警报数据
        const alertsData = await getAlerts();
        setAlerts(alertsData);
        
        // 加载所有老人档案数据
        const profiles = await getElderlyProfiles();
        setElderlyProfiles(profiles);
        
        // 如果URL中有elderlyId参数，则选中对应老人
        if (elderlyIdParam) {
          const elderly = await getElderlyById(parseInt(elderlyIdParam));
          if (elderly) {
            setSelectedElderly(elderly);
            setFilterParams(prev => ({ ...prev, elderlyId: elderly.id }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch alerts data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [elderlyIdParam]);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [alerts, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...alerts];
    
    // 按老人ID筛选
    if (filterParams.elderlyId) {
      result = result.filter(alert => alert.elderlyId === parseInt(filterParams.elderlyId));
    }
    
    // 按警报级别筛选
    if (filterParams.alertLevel) {
      result = result.filter(alert => alert.alertLevel === filterParams.alertLevel);
    }
    
    // 按警报类型筛选
    if (filterParams.alertType) {
      result = result.filter(alert => alert.alertType === filterParams.alertType);
    }
    
    // 按状态筛选
    if (filterParams.status) {
      result = result.filter(alert => alert.status === filterParams.status);
    }
    
    // 按日期范围筛选
    if (filterParams.startDate) {
      const startDate = new Date(filterParams.startDate);
      result = result.filter(alert => new Date(alert.timestamp) >= startDate);
    }
    
    if (filterParams.endDate) {
      const endDate = new Date(filterParams.endDate);
      endDate.setHours(23, 59, 59, 999);  // 设置为当天结束时间
      result = result.filter(alert => new Date(alert.timestamp) <= endDate);
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'emergency') {
      result = result.filter(alert => alert.alertLevel === '紧急');
    } else if (activeTab === 'pending') {
      result = result.filter(alert => alert.status === '待处理');
    } else if (activeTab === 'processing') {
      result = result.filter(alert => alert.status === '处理中');
    } else if (activeTab === 'resolved') {
      result = result.filter(alert => alert.status === '已解决' || alert.status === '已关闭');
    }
    
    // 按时间排序（最新的在前）
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredAlerts(result);
  };

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
    setIsDetailModalOpen(true);
  };

  const handleRespondAlert = (alert) => {
    setSelectedAlert(alert);
    setIsRespondModalOpen(true);
  };

  const handleFilterButtonClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterSubmit = () => {
    applyFilters();
    setIsFilterModalOpen(false);
  };

  const handleElderlySelect = (value) => {
    const id = parseInt(value);
    const elderly = elderlyProfiles.find(p => p.id === id);
    setSelectedElderly(elderly);
    setFilterParams(prev => ({ ...prev, elderlyId: id || '' }));
  };

  const handleResetFilters = () => {
    setFilterParams({
      elderlyId: '',
      alertLevel: '',
      alertType: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setSelectedElderly(null);
  };

  // 获取各级别警报数量
  const getAlertLevelCounts = () => {
    const counts = {
      emergency: alerts.filter(alert => alert.alertLevel === '紧急').length,
      high: alerts.filter(alert => alert.alertLevel === '高').length,
      medium: alerts.filter(alert => alert.alertLevel === '中').length,
      low: alerts.filter(alert => alert.alertLevel === '低').length
    };
    
    return counts;
  };

  // 获取各状态警报数量
  const getAlertStatusCounts = () => {
    const counts = {
      pending: alerts.filter(alert => alert.status === '待处理').length,
      processing: alerts.filter(alert => alert.status === '处理中').length,
      resolved: alerts.filter(alert => alert.status === '已解决').length,
      closed: alerts.filter(alert => alert.status === '已关闭').length
    };
    
    return counts;
  };

  // 获取警报类型和级别的选项
  const getAlertTypeOptions = () => {
    const types = [...new Set(alerts.map(alert => alert.alertType))];
    return [
      { value: '', label: '全部类型' },
      ...types.map(type => ({ value: type, label: type }))
    ];
  };

  const getAlertLevelOptions = () => {
    return [
      { value: '', label: '全部级别' },
      { value: '紧急', label: '紧急' },
      { value: '高', label: '高' },
      { value: '中', label: '中' },
      { value: '低', label: '低' }
    ];
  };

  const getAlertStatusOptions = () => {
    return [
      { value: '', label: '全部状态' },
      { value: '待处理', label: '待处理' },
      { value: '处理中', label: '处理中' },
      { value: '已解决', label: '已解决' },
      { value: '已关闭', label: '已关闭' }
    ];
  };

  // 表格列定义
  const columns = [
    { 
      title: '警报时间', 
      width: '150px',
      render: (record) => (
        <div className="text-sm">
          {formatDateTime(record.timestamp)}
        </div>
      )
    },
    { 
      title: '老人姓名', 
      dataIndex: 'elderlyName',
      width: '120px',
      render: (record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-2">
            <AiOutlineUser />
          </div>
          <span>{record.elderlyName}</span>
        </div>
      )
    },
    { 
      title: '警报类型', 
      dataIndex: 'alertType',
      width: '120px'
    },
    { 
      title: '警报级别', 
      dataIndex: 'alertLevel',
      width: '100px',
      render: (record) => {
        const levelColors = {
          '紧急': 'bg-red-100 text-red-800',
          '高': 'bg-orange-100 text-orange-800',
          '中': 'bg-yellow-100 text-yellow-800',
          '低': 'bg-blue-100 text-blue-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${levelColors[record.alertLevel] || 'bg-gray-100'}`}>
            {record.alertLevel}
          </span>
        );
      }
    },
    { 
      title: '描述', 
      dataIndex: 'description',
      width: '200px',
      render: (record) => (
        <div className="truncate max-w-[200px]" title={record.description}>
          {record.description}
        </div>
      )
    },
    { 
      title: '位置', 
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
      title: '状态', 
      dataIndex: 'status',
      width: '100px',
      render: (record) => {
        const statusColors = {
          '待处理': 'bg-red-100 text-red-800',
          '处理中': 'bg-yellow-100 text-yellow-800',
          '已解决': 'bg-green-100 text-green-800',
          '已关闭': 'bg-gray-100 text-gray-800'
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
      width: '120px',
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewAlert(record)}
          >
            详情
          </Button>
          {(record.status === '待处理' || record.status === '处理中') && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleRespondAlert(record)}
            >
              响应
            </Button>
          )}
        </div>
      )
    }
  ];

  // 渲染警报详情模态框
  const renderDetailModal = () => {
    if (!selectedAlert) return null;
    
    const alertLevelColors = {
      '紧急': 'bg-red-600',
      '高': 'bg-orange-500',
      '中': 'bg-yellow-500',
      '低': 'bg-blue-500'
    };

    const statusColors = {
      '待处理': 'bg-red-100 text-red-800',
      '处理中': 'bg-yellow-100 text-yellow-800',
      '已解决': 'bg-green-100 text-green-800',
      '已关闭': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="警报详情"
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              关闭
            </Button>
            {(selectedAlert.status === '待处理' || selectedAlert.status === '处理中') && (
              <Button
                variant="primary"
                icon={<AiOutlineBell size={16} />}
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleRespondAlert(selectedAlert);
                }}
              >
                响应警报
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 ${alertLevelColors[selectedAlert.alertLevel]} rounded-full flex items-center justify-center text-white mr-3`}>
              <AiOutlineAlert size={24} />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-bold">{selectedAlert.alertType}</h3>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${statusColors[selectedAlert.status]}`}>
                  {selectedAlert.status}
                </span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800`}>
                  {selectedAlert.alertLevel}
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                {formatDateTime(selectedAlert.timestamp)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">老人信息</h4>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-2">
                  <AiOutlineUser size={20} />
                </div>
                <div>
                  <p className="font-medium">{selectedAlert.elderlyName}</p>
                  <p className="text-sm text-gray-500">ID: {selectedAlert.elderlyId}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <AiOutlineEnvironment className="mr-1" />
                <span>位置: {selectedAlert.location}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">警报处理</h4>
              {selectedAlert.respondedBy ? (
                <>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mr-2">
                      <AiOutlineTeam size={20} />
                    </div>
                    <div>
                      <p className="font-medium">处理人: {selectedAlert.respondedBy}</p>
                      <p className="text-sm text-gray-500">响应时间: {selectedAlert.responseTime}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <AiOutlineClockCircle size={32} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-gray-600">尚未处理</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">警报描述</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p>{selectedAlert.description}</p>
            </div>
          </div>
          
          {selectedAlert.notes && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">备注</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p>{selectedAlert.notes}</p>
              </div>
            </div>
          )}
          
          {selectedAlert.status === '待处理' && (
            <Alert
              type="warning"
              title="未处理警报"
              message="此警报尚未处理，请尽快响应"
              className="mt-4"
            />
          )}
          
          {selectedAlert.status === '处理中' && (
            <Alert
              type="info"
              title="处理中"
              message={`处理人: ${selectedAlert.respondedBy || '未指定'}`}
              className="mt-4"
            />
          )}
          
          {selectedAlert.status === '已解决' && (
            <Alert
              type="success"
              title="已解决"
              message={`处理人: ${selectedAlert.respondedBy} | 响应时间: ${selectedAlert.responseTime}`}
              className="mt-4"
            />
          )}
        </div>
      </Modal>
    );
  };

  // 渲染响应警报模态框
  const renderRespondModal = () => {
    if (!selectedAlert) return null;
    
    return (
      <Modal
        isOpen={isRespondModalOpen}
        onClose={() => setIsRespondModalOpen(false)}
        title="响应警报"
        size="md"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsRespondModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="danger"
              icon={<AiOutlineClose size={16} />}
            >
              关闭警报
            </Button>
            <Button
              variant="primary"
              icon={<AiOutlineCheck size={16} />}
            >
              确认处理
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <Alert
            type="warning"
            title={`${selectedAlert.alertLevel}级警报: ${selectedAlert.alertType}`}
            message={selectedAlert.description}
            className="mb-4"
          />
          
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="flex items-center">
              <AiOutlineUser className="text-primary mr-2" />
              <p><span className="font-medium">老人:</span> {selectedAlert.elderlyName}</p>
            </div>
            <div className="flex items-center mt-1">
              <AiOutlineEnvironment className="text-primary mr-2" />
              <p><span className="font-medium">位置:</span> {selectedAlert.location}</p>
            </div>
            <div className="flex items-center mt-1">
              <AiOutlineClockCircle className="text-primary mr-2" />
              <p><span className="font-medium">时间:</span> {formatDateTime(selectedAlert.timestamp)}</p>
            </div>
          </div>
          
          <FormField
            label="处理人"
            name="respondedBy"
            placeholder="请输入您的姓名"
            required
          />
          
          <FormField
            label="响应时间"
            name="responseTime"
            type="select"
            options={[
              { value: '立即', label: '立即' },
              { value: '5分钟内', label: '5分钟内' },
              { value: '10分钟内', label: '10分钟内' },
              { value: '15分钟内', label: '15分钟内' },
              { value: '30分钟内', label: '30分钟内' }
            ]}
            required
          />
          
          <FormField
            label="更新状态"
            name="status"
            type="select"
            options={[
              { value: '处理中', label: '处理中' },
              { value: '已解决', label: '已解决' },
              { value: '已关闭', label: '已关闭' }
            ]}
            required
          />
          
          <FormField
            label="处理备注"
            name="notes"
            type="textarea"
            placeholder="请简述警报处理情况"
          />
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
        title="筛选警报"
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
            label="老人"
            name="elderlyId"
            type="select"
            value={filterParams.elderlyId.toString()}
            onChange={(e) => handleElderlySelect(e.target.value)}
            options={[
              { value: '', label: '全部老人' },
              ...elderlyProfiles.map(profile => ({
                value: profile.id.toString(),
                label: profile.name
              }))
            ]}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="警报级别"
              name="alertLevel"
              type="select"
              value={filterParams.alertLevel}
              onChange={(e) => setFilterParams(prev => ({ ...prev, alertLevel: e.target.value }))}
              options={getAlertLevelOptions()}
            />
            
            <FormField
              label="警报状态"
              name="status"
              type="select"
              value={filterParams.status}
              onChange={(e) => setFilterParams(prev => ({ ...prev, status: e.target.value }))}
              options={getAlertStatusOptions()}
            />
          </div>
          
          <FormField
            label="警报类型"
            name="alertType"
            type="select"
            value={filterParams.alertType}
            onChange={(e) => setFilterParams(prev => ({ ...prev, alertType: e.target.value }))}
            options={getAlertTypeOptions()}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="开始日期"
              name="startDate"
              type="date"
              value={filterParams.startDate}
              onChange={(e) => setFilterParams(prev => ({ ...prev, startDate: e.target.value }))}
            />
            
            <FormField
              label="结束日期"
              name="endDate"
              type="date"
              value={filterParams.endDate}
              onChange={(e) => setFilterParams(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    );
  };

  // 获取警报统计
  const alertLevelCounts = getAlertLevelCounts();
  const alertStatusCounts = getAlertStatusCounts();

  // 获取待处理的紧急警报
  const pendingEmergencyAlerts = alerts.filter(alert => 
    alert.alertLevel === '紧急' && alert.status === '待处理'
  );

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
          <h1 className="text-2xl font-bold text-gray-800">警报信息</h1>
          <p className="text-gray-600 mt-1">
            {selectedElderly ? `${selectedElderly.name}的警报记录` : '管理所有警报信息'}
          </p>
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
            icon={<AiOutlineSound size={16} />}
          >
            测试警报
          </Button>
        </div>
      </div>

      {pendingEmergencyAlerts.length > 0 && (
        <Alert
          type="error"
          title={`有 ${pendingEmergencyAlerts.length} 条紧急警报待处理！`}
          message="请立即处理紧急警报"
          className="mb-6"
        />
      )}

      {selectedElderly && (
        <Card className="mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mr-4">
              <AiOutlineUser size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{selectedElderly.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <div>
                  <p className="text-sm text-gray-500">年龄</p>
                  <p className="font-medium">{selectedElderly.age}岁</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">房间号</p>
                  <p className="font-medium">{selectedElderly.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">健康状态</p>
                  <p className="font-medium">{selectedElderly.healthStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">护理级别</p>
                  <p className="font-medium">{selectedElderly.careLevel}级</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedElderly(null);
                setFilterParams(prev => ({ ...prev, elderlyId: '' }));
              }}
            >
              查看全部
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-red-800">{alertLevelCounts.emergency}</p>
              <p className="text-sm text-red-700">紧急警报</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineAlert size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-orange-50 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-orange-800">{alertLevelCounts.high}</p>
              <p className="text-sm text-orange-700">高级警报</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineAlert size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-800">{alertStatusCounts.pending}</p>
              <p className="text-sm text-yellow-700">待处理警报</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineClockCircle size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-800">{alertStatusCounts.resolved + alertStatusCounts.closed}</p>
              <p className="text-sm text-green-700">已解决警报</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineCheck size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <Card
            title="最新紧急警报"
            icon={<AiOutlineAlert size={18} />}
            headerClassName="bg-red-50 text-red-800"
          >
            <div className="h-[400px] overflow-y-auto p-2">
              {filteredAlerts
                .filter(alert => alert.alertLevel === '紧急')
                .slice(0, 5)
                .map((alert, index) => (
                  <AlertItem
                    key={index}
                    alert={alert}
                    onClick={() => handleViewAlert(alert)}
                  />
                ))}
              
              {filteredAlerts.filter(alert => alert.alertLevel === '紧急').length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <AiOutlineCheck size={48} className="text-green-500 mb-2" />
                  <p>暂无紧急警报</p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="mb-4">
              <Tabs
                tabs={[
                  { key: 'all', label: '全部警报', content: null },
                  { key: 'emergency', label: '紧急警报', content: null },
                  { key: 'pending', label: '待处理', content: null },
                  { key: 'processing', label: '处理中', content: null },
                  { key: 'resolved', label: '已解决', content: null }
                ]}
                defaultActiveKey="all"
                onChange={(key) => setActiveTab(key)}
              />
            </div>

            <Table
              columns={columns}
              data={filteredAlerts}
              emptyMessage="暂无警报数据"
            />
          </Card>
        </div>
      </div>

      {renderDetailModal()}
      {renderRespondModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}