'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  AiOutlinePlus, 
  AiOutlineUser, 
  AiOutlineCalendar, 
  AiOutlineClockCircle,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineFilter
} from 'react-icons/ai';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import Alert from '../../components/ui/Alert';
import { getCareServices, getElderlyProfiles, getElderlyById, filterDataByDateRange, formatDate } from '../../utils/data-utils';

export default function CareServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    elderlyId: '',
    startDate: '',
    endDate: '',
    serviceType: '',
    status: ''
  });
  
  const searchParams = useSearchParams();
  const elderlyIdParam = searchParams.get('elderlyId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有护理服务数据
        const serviceData = await getCareServices();
        setServices(serviceData);
        
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
        console.error('Failed to fetch care services data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [elderlyIdParam]);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [services, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...services];
    
    // 按老人ID筛选
    if (filterParams.elderlyId) {
      result = result.filter(service => service.elderlyId === parseInt(filterParams.elderlyId));
    }
    
    // 按日期范围筛选
    if (filterParams.startDate || filterParams.endDate) {
      result = filterDataByDateRange(
        result, 
        filterParams.startDate, 
        filterParams.endDate,
        'serviceDate'
      );
    }
    
    // 按服务类型筛选
    if (filterParams.serviceType) {
      result = result.filter(service => service.serviceType === filterParams.serviceType);
    }
    
    // 按状态筛选
    if (filterParams.status) {
      result = result.filter(service => service.status === filterParams.status);
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(service => service.serviceDate === today);
    } else if (activeTab === 'pending') {
      result = result.filter(service => service.status === '待执行');
    } else if (activeTab === 'completed') {
      result = result.filter(service => service.status === '已完成');
    }
    
    // 按日期降序排序
    result.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
    
    setFilteredServices(result);
  };

  const handleAddService = () => {
    setIsAddModalOpen(true);
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
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
      startDate: '',
      endDate: '',
      serviceType: '',
      status: ''
    });
    setSelectedElderly(null);
  };

  // 表格列定义
  const columns = [
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
      title: '服务日期', 
      dataIndex: 'serviceDate',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineCalendar className="text-gray-500 mr-1" />
          <span>{record.serviceDate}</span>
        </div>
      )
    },
    { 
      title: '服务时间', 
      dataIndex: 'startTime',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineClockCircle className="text-gray-500 mr-1" />
          <span>{record.startTime}</span>
        </div>
      )
    },
    { 
      title: '服务类型', 
      dataIndex: 'serviceType',
      width: '120px',
      render: (record) => {
        const serviceTypeColors = {
          '日常照护': 'bg-blue-100 text-blue-800',
          '药物管理': 'bg-green-100 text-green-800',
          '健康检查': 'bg-purple-100 text-purple-800',
          '康复训练': 'bg-orange-100 text-orange-800',
          '心理辅导': 'bg-pink-100 text-pink-800',
          '陪同就医': 'bg-red-100 text-red-800',
          '个人卫生': 'bg-indigo-100 text-indigo-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${serviceTypeColors[record.serviceType] || 'bg-gray-100'}`}>
            {record.serviceType}
          </span>
        );
      }
    },
    { 
      title: '服务人员', 
      dataIndex: 'staffName',
      width: '100px'
    },
    { 
      title: '服务时长', 
      dataIndex: 'duration',
      width: '80px'
    },
    { 
      title: '状态', 
      dataIndex: 'status',
      width: '100px',
      render: (record) => {
        const statusColors = {
          '已完成': 'bg-green-100 text-green-800',
          '待执行': 'bg-yellow-100 text-yellow-800',
          '已取消': 'bg-gray-100 text-gray-800'
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
            onClick={() => handleViewService(record)}
          >
            详情
          </Button>
          {record.status === '待执行' && (
            <Button
              size="sm"
              variant="primary"
              icon={<AiOutlineCheck size={16} />}
            >
              完成
            </Button>
          )}
        </div>
      )
    }
  ];

  // 渲染添加服务模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加护理服务"
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
            label="老人"
            name="elderlyId"
            type="select"
            value={filterParams.elderlyId.toString()}
            onChange={(e) => handleElderlySelect(e.target.value)}
            options={elderlyProfiles.map(profile => ({
              value: profile.id.toString(),
              label: profile.name
            }))}
            required
          />
          <FormField
            label="服务类型"
            name="serviceType"
            type="select"
            options={[
              { value: '日常照护', label: '日常照护' },
              { value: '药物管理', label: '药物管理' },
              { value: '健康检查', label: '健康检查' },
              { value: '康复训练', label: '康复训练' },
              { value: '心理辅导', label: '心理辅导' },
              { value: '陪同就医', label: '陪同就医' },
              { value: '个人卫生', label: '个人卫生' }
            ]}
            required
          />
          <FormField
            label="服务日期"
            name="serviceDate"
            type="date"
            value={new Date().toISOString().split('T')[0]}
            required
          />
          <FormField
            label="开始时间"
            name="startTime"
            type="time"
            required
          />
          <FormField
            label="服务时长"
            name="duration"
            placeholder="例如：30分钟"
            required
          />
          <FormField
            label="服务人员"
            name="staffName"
            placeholder="服务人员姓名"
            required
          />
          <FormField
            label="人员角色"
            name="staffRole"
            type="select"
            options={[
              { value: '医生', label: '医生' },
              { value: '护士', label: '护士' },
              { value: '护工', label: '护工' },
              { value: '理疗师', label: '理疗师' },
              { value: '营养师', label: '营养师' },
              { value: '心理咨询师', label: '心理咨询师' },
              { value: '社工', label: '社工' }
            ]}
            required
          />
          <FormField
            label="服务状态"
            name="status"
            type="select"
            options={[
              { value: '已完成', label: '已完成' },
              { value: '待执行', label: '待执行' },
              { value: '已取消', label: '已取消' }
            ]}
            required
          />
          <div className="col-span-2">
            <FormField
              label="服务内容"
              name="serviceContent"
              type="textarea"
              placeholder="请描述服务内容"
            />
          </div>
          <div className="col-span-2">
            <FormField
              label="备注"
              name="notes"
              type="textarea"
              placeholder="请输入备注信息"
            />
          </div>
        </div>
      </Modal>
    );
  };

  // 渲染服务详情模态框
  const renderDetailModal = () => {
    if (!selectedService) return null;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="护理服务详情"
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              关闭
            </Button>
            {selectedService.status === '待执行' && (
              <>
                <Button
                  variant="danger"
                  icon={<AiOutlineClose size={16} />}
                >
                  取消服务
                </Button>
                <Button
                  variant="primary"
                  icon={<AiOutlineCheck size={16} />}
                >
                  完成服务
                </Button>
              </>
            )}
            {selectedService.status === '已完成' && (
              <Button
                variant="primary"
                icon={<AiOutlineEdit size={16} />}
              >
                编辑记录
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mr-3">
              <AiOutlineUser size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{selectedService.elderlyName}</h3>
              <p className="text-gray-600">
                服务日期: {selectedService.serviceDate} {selectedService.startTime}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-sm text-gray-500">服务类型</p>
              <p className="text-lg font-medium mt-1">{selectedService.serviceType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">服务时长</p>
              <p className="text-lg font-medium mt-1">{selectedService.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">服务人员</p>
              <p className="text-lg font-medium mt-1">{selectedService.staffName} ({selectedService.staffRole})</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">服务状态</p>
              <p className="text-lg font-medium mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedService.status === '已完成' ? 'bg-green-100 text-green-800' :
                  selectedService.status === '待执行' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedService.status}
                </span>
              </p>
            </div>
          </div>
          
          {selectedService.notes && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">备注</h4>
              <div className="bg-gray-100 p-3 rounded-md">
                <p>{selectedService.notes}</p>
              </div>
            </div>
          )}
          
          {selectedService.status === '已完成' && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-green-700">服务完成记录</h4>
              <p className="text-gray-700">服务已于 {selectedService.serviceDate} {selectedService.startTime} 完成</p>
              {selectedService.notes && <p className="mt-2 text-gray-700">服务反馈: {selectedService.notes}</p>}
            </div>
          )}
          
          {selectedService.status === '待执行' && (
            <Alert
              type="warning"
              title="待执行服务"
              message="此服务尚未执行，请在完成服务后及时更新状态"
              className="mt-6"
            />
          )}
          
          {selectedService.status === '已取消' && (
            <Alert
              type="error"
              title="已取消服务"
              message="此服务已被取消"
              className="mt-6"
            />
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
        title="筛选护理服务"
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
          
          <FormField
            label="服务类型"
            name="serviceType"
            type="select"
            value={filterParams.serviceType}
            onChange={(e) => setFilterParams(prev => ({ ...prev, serviceType: e.target.value }))}
            options={[
              { value: '', label: '全部类型' },
              { value: '日常照护', label: '日常照护' },
              { value: '药物管理', label: '药物管理' },
              { value: '健康检查', label: '健康检查' },
              { value: '康复训练', label: '康复训练' },
              { value: '心理辅导', label: '心理辅导' },
              { value: '陪同就医', label: '陪同就医' },
              { value: '个人卫生', label: '个人卫生' }
            ]}
          />
          
          <FormField
            label="服务状态"
            name="status"
            type="select"
            value={filterParams.status}
            onChange={(e) => setFilterParams(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: '', label: '全部状态' },
              { value: '已完成', label: '已完成' },
              { value: '待执行', label: '待执行' },
              { value: '已取消', label: '已取消' }
            ]}
          />
        </div>
      </Modal>
    );
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
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">护理服务管理</h1>
          <p className="text-gray-600 mt-1">
            {selectedElderly ? `${selectedElderly.name}的护理服务记录` : '管理所有老人的护理服务'}
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
            icon={<AiOutlinePlus size={16} />}
            onClick={handleAddService}
          >
            添加服务
          </Button>
        </div>
      </div>

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

      <Card className="mb-6">
        <div className="mb-4">
          <Tabs
            tabs={[
              { key: 'all', label: '全部服务', content: null },
              { key: 'today', label: '今日服务', content: null },
              { key: 'pending', label: '待执行', content: null },
              { key: 'completed', label: '已完成', content: null }
            ]}
            defaultActiveKey="all"
            onChange={(key) => setActiveTab(key)}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-md">
            <div className="flex items-center">
              <AiOutlineCalendar className="text-yellow-600 mr-2" size={20} />
              <div>
                <p className="font-medium text-yellow-800">今日待执行服务: {
                  services.filter(s => 
                    s.serviceDate === new Date().toISOString().split('T')[0] && 
                    s.status === '待执行'
                  ).length
                }项</p>
                <p className="text-sm text-yellow-600">请及时安排工作人员执行服务</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('today')}
            >
              查看今日服务
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredServices}
          emptyMessage="暂无护理服务数据"
        />
      </Card>

      {renderAddModal()}
      {renderDetailModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}