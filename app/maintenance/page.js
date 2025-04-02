'use client';

import { useState, useEffect } from 'react';
import { 
  AiOutlinePlus, 
  AiOutlineFilter,
  AiOutlineSearch,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineTool,
  AiOutlineWarning,
  AiOutlineEnvironment,
  AiOutlineCalendar,
  AiOutlineSetting,
  AiOutlineClockCircle,
  AiOutlineUser,
  AiOutlineExclamationCircle,
  AiOutlineCheckCircle
} from 'react-icons/ai';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import Alert from '../../components/ui/Alert';
import { getMaintenance, formatDate } from '../../utils/data-utils';

// 维护任务卡片组件 - 用于复用
const MaintenanceTaskCard = ({ task, onClick }) => {
  const isPending = task.status === '待处理';
  const isProcessing = task.status === '处理中';
  const isComplete = task.status === '已完成';
  const isUrgent = task.priority === '紧急';
  
  const priorityColors = {
    '紧急': 'bg-red-100 text-red-800',
    '高': 'bg-orange-100 text-orange-800',
    '中': 'bg-yellow-100 text-yellow-800',
    '低': 'bg-blue-100 text-blue-800'
  };
  
  const statusColors = {
    '待处理': 'bg-red-100 text-red-800',
    '处理中': 'bg-yellow-100 text-yellow-800',
    '已完成': 'bg-green-100 text-green-800',
    '已取消': 'bg-gray-100 text-gray-800',
    '延期处理': 'bg-purple-100 text-purple-800'
  };
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${
        isUrgent ? 'border-l-4 border-red-500' : 
        isPending ? 'border-l-4 border-yellow-500' : 
        'border'
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{task.equipmentType} - {task.issueType}</h3>
          <div className="flex space-x-1">
            <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[task.status]}`}>
              {task.status}
            </span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{task.issueDescription}</p>
        
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <AiOutlineEnvironment className="mr-1" />
            <span>{task.location}</span>
          </div>
          <div className="flex items-center">
            <AiOutlineCalendar className="mr-1" />
            <span>{task.reportDate}</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <span>报告人: {task.reportedBy}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <span>指派给: {task.assignedTo || '未指派'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MaintenanceManagement() {
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    equipmentType: '',
    issueType: '',
    priority: '',
    status: '',
    startDate: '',
    endDate: '',
    keyword: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有维护任务数据
        const data = await getMaintenance();
        setMaintenanceTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        console.error('Failed to fetch maintenance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [maintenanceTasks, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...maintenanceTasks];
    
    // 按设备类型筛选
    if (filterParams.equipmentType) {
      result = result.filter(task => task.equipmentType === filterParams.equipmentType);
    }
    
    // 按问题类型筛选
    if (filterParams.issueType) {
      result = result.filter(task => task.issueType === filterParams.issueType);
    }
    
    // 按优先级筛选
    if (filterParams.priority) {
      result = result.filter(task => task.priority === filterParams.priority);
    }
    
    // 按状态筛选
    if (filterParams.status) {
      result = result.filter(task => task.status === filterParams.status);
    }
    
    // 按日期范围筛选
    if (filterParams.startDate) {
      result = result.filter(task => task.reportDate >= filterParams.startDate);
    }
    
    if (filterParams.endDate) {
      result = result.filter(task => task.reportDate <= filterParams.endDate);
    }
    
    // 按关键字搜索
    if (filterParams.keyword) {
      const keyword = filterParams.keyword.toLowerCase();
      result = result.filter(task => 
        task.issueDescription.toLowerCase().includes(keyword) ||
        task.location.toLowerCase().includes(keyword) ||
        task.equipmentType.toLowerCase().includes(keyword) ||
        task.reportedBy.toLowerCase().includes(keyword)
      );
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'pending') {
      result = result.filter(task => task.status === '待处理');
    } else if (activeTab === 'processing') {
      result = result.filter(task => task.status === '处理中');
    } else if (activeTab === 'completed') {
      result = result.filter(task => task.status === '已完成');
    } else if (activeTab === 'urgent') {
      result = result.filter(task => task.priority === '紧急');
    }
    
    // 按日期和优先级排序
    result.sort((a, b) => {
      // 先按状态排序（待处理优先）
      const statusOrder = {
        '待处理': 0,
        '处理中': 1,
        '延期处理': 2,
        '已取消': 3,
        '已完成': 4
      };
      
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      
      // 再按优先级排序
      const priorityOrder = {
        '紧急': 0,
        '高': 1,
        '中': 2,
        '低': 3
      };
      
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // 最后按日期排序（最新的在前）
      return new Date(b.reportDate) - new Date(a.reportDate);
    });
    
    setFilteredTasks(result);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
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
      equipmentType: '',
      issueType: '',
      priority: '',
      status: '',
      startDate: '',
      endDate: '',
      keyword: ''
    });
  };

  const handleSearchChange = (e) => {
    setFilterParams(prev => ({ ...prev, keyword: e.target.value }));
  };

  // 获取选项
  const getEquipmentTypeOptions = () => {
    const types = [...new Set(maintenanceTasks.map(task => task.equipmentType))];
    return [
      { value: '', label: '全部类型' },
      ...types.map(type => ({ value: type, label: type }))
    ];
  };

  const getIssueTypeOptions = () => {
    const types = [...new Set(maintenanceTasks.map(task => task.issueType))];
    return [
      { value: '', label: '全部类型' },
      ...types.map(type => ({ value: type, label: type }))
    ];
  };

  const getPriorityOptions = () => {
    return [
      { value: '', label: '全部优先级' },
      { value: '紧急', label: '紧急' },
      { value: '高', label: '高' },
      { value: '中', label: '中' },
      { value: '低', label: '低' }
    ];
  };

  const getStatusOptions = () => {
    return [
      { value: '', label: '全部状态' },
      { value: '待处理', label: '待处理' },
      { value: '处理中', label: '处理中' },
      { value: '已完成', label: '已完成' },
      { value: '已取消', label: '已取消' },
      { value: '延期处理', label: '延期处理' }
    ];
  };

  // 获取统计数据
  const getPendingTasksCount = () => {
    return maintenanceTasks.filter(task => task.status === '待处理').length;
  };

  const getUrgentTasksCount = () => {
    return maintenanceTasks.filter(task => task.priority === '紧急' && (task.status === '待处理' || task.status === '处理中')).length;
  };

  const getCompletedTasksCount = () => {
    return maintenanceTasks.filter(task => task.status === '已完成').length;
  };

  // 表格列定义
  const columns = [
    { 
      title: '设备/问题', 
      width: '200px',
      render: (record) => (
        <div>
          <div className="font-medium">{record.equipmentType}</div>
          <div className="text-sm text-gray-500">{record.issueType}</div>
          <div className="text-xs text-gray-500 truncate max-w-[180px]" title={record.issueDescription}>
            {record.issueDescription}
          </div>
        </div>
      )
    },
    { 
      title: '位置', 
      dataIndex: 'location',
      width: '150px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineEnvironment className="text-gray-500 mr-1" />
          <span>{record.location}</span>
        </div>
      )
    },
    { 
      title: '设备ID', 
      dataIndex: 'equipmentId',
      width: '100px'
    },
    { 
      title: '报告日期', 
      dataIndex: 'reportDate',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineCalendar className="text-gray-500 mr-1" />
          <span>{record.reportDate}</span>
        </div>
      )
    },
    { 
      title: '优先级/状态', 
      width: '140px',
      render: (record) => {
        const priorityColors = {
          '紧急': 'bg-red-100 text-red-800',
          '高': 'bg-orange-100 text-orange-800',
          '中': 'bg-yellow-100 text-yellow-800',
          '低': 'bg-blue-100 text-blue-800'
        };
        
        const statusColors = {
          '待处理': 'bg-red-100 text-red-800',
          '处理中': 'bg-yellow-100 text-yellow-800',
          '已完成': 'bg-green-100 text-green-800',
          '已取消': 'bg-gray-100 text-gray-800',
          '延期处理': 'bg-purple-100 text-purple-800'
        };
        
        return (
          <div className="space-y-1">
            <span className={`px-2 py-1 rounded-full text-xs inline-block ${priorityColors[record.priority]}`}>
              {record.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs inline-block ${statusColors[record.status]}`}>
              {record.status}
            </span>
          </div>
        );
      }
    },
    { 
      title: '报告人/指派给', 
      width: '140px',
      render: (record) => (
        <div>
          <div className="text-sm">报告人: {record.reportedBy}</div>
          <div className="text-sm">指派给: {record.assignedTo || '未指派'}</div>
        </div>
      )
    },
    { 
      title: '计划完成日期', 
      dataIndex: 'plannedCompletionDate',
      width: '120px'
    },
    {
      title: '操作',
      width: '120px',
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewTask(record)}
          >
            详情
          </Button>
          {(record.status === '待处理' || record.status === '处理中') && (
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateTask(record);
              }}
            >
              更新
            </Button>
          )}
        </div>
      )
    }
  ];

  // 渲染任务详情模态框
  const renderDetailModal = () => {
    if (!selectedTask) return null;
    
    const isPending = selectedTask.status === '待处理';
    const isProcessing = selectedTask.status === '处理中';
    const isComplete = selectedTask.status === '已完成';
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="维护任务详情"
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              关闭
            </Button>
            {(isPending || isProcessing) && (
              <Button
                variant="primary"
                icon={<AiOutlineEdit size={16} />}
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleUpdateTask(selectedTask);
                }}
              >
                更新状态
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
              <AiOutlineTool size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{selectedTask.equipmentType} - {selectedTask.issueType}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedTask.priority === '紧急' ? 'bg-red-100 text-red-800' : 
                  selectedTask.priority === '高' ? 'bg-orange-100 text-orange-800' : 
                  selectedTask.priority === '中' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {selectedTask.priority}级
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedTask.status === '待处理' ? 'bg-red-100 text-red-800' : 
                  selectedTask.status === '处理中' ? 'bg-yellow-100 text-yellow-800' : 
                  selectedTask.status === '已完成' ? 'bg-green-100 text-green-800' : 
                  selectedTask.status === '已取消' ? 'bg-gray-100 text-gray-800' : 
                  'bg-purple-100 text-purple-800'
                }`}>
                  {selectedTask.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">基本信息</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">设备ID:</p>
                  <p className="font-medium">{selectedTask.equipmentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">位置:</p>
                  <p className="font-medium">{selectedTask.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">问题描述:</p>
                  <p className="font-medium">{selectedTask.issueDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">报告人:</p>
                  <p className="font-medium">{selectedTask.reportedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">报告日期:</p>
                  <p className="font-medium">{selectedTask.reportDate}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">进度信息</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">当前状态:</p>
                  <p className={`font-medium ${
                    selectedTask.status === '待处理' ? 'text-red-600' : 
                    selectedTask.status === '处理中' ? 'text-yellow-600' : 
                    selectedTask.status === '已完成' ? 'text-green-600' : 
                    'text-gray-600'
                  }`}>
                    {selectedTask.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">指派给:</p>
                  <p className="font-medium">{selectedTask.assignedTo || '未指派'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">计划完成日期:</p>
                  <p className="font-medium">{selectedTask.plannedCompletionDate}</p>
                </div>
                {selectedTask.status === '已完成' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">实际完成日期:</p>
                      <p className="font-medium">{selectedTask.actualCompletionDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">维修费用:</p>
                      <p className="font-medium">{selectedTask.cost || '无费用'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {selectedTask.notes && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">备注</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{selectedTask.notes}</p>
              </div>
            </div>
          )}
          
          {selectedTask.status === '待处理' && (
            <Alert
              type="warning"
              title="待处理任务"
              message="此维护任务尚未处理，请尽快安排维修。"
              className="mt-4"
            />
          )}
          
          {selectedTask.status === '处理中' && selectedTask.priority === '紧急' && (
            <Alert
              type="error"
              title="紧急处理中"
              message="此任务为紧急任务，请优先处理。"
              className="mt-4"
            />
          )}
          
          {selectedTask.status === '已完成' && (
            <Alert
              type="success"
              title="任务已完成"
              message={`维护已于 ${selectedTask.actualCompletionDate} 完成。`}
              className="mt-4"
            />
          )}
        </div>
      </Modal>
    );
  };

  // 渲染添加任务模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加维护任务"
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
              icon={<AiOutlineCheck size={16} />}
            >
              保存
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="设备类型"
            name="equipmentType"
            type="select"
            options={getEquipmentTypeOptions()}
            required
          />
          <FormField
            label="设备ID"
            name="equipmentId"
            placeholder="请输入设备ID"
            required
          />
          <FormField
            label="位置"
            name="location"
            placeholder="请输入位置"
            required
          />
          <FormField
            label="问题类型"
            name="issueType"
            type="select"
            options={getIssueTypeOptions()}
            required
          />
          <div className="md:col-span-2">
            <FormField
              label="问题描述"
              name="issueDescription"
              type="textarea"
              placeholder="请描述问题"
              required
            />
          </div>
          <FormField
            label="报告人"
            name="reportedBy"
            placeholder="请输入报告人姓名"
            required
          />
          <FormField
            label="报告日期"
            name="reportDate"
            type="date"
            value={new Date().toISOString().split('T')[0]}
            required
          />
          <FormField
            label="优先级"
            name="priority"
            type="select"
            options={[
              { value: '紧急', label: '紧急' },
              { value: '高', label: '高' },
              { value: '中', label: '中' },
              { value: '低', label: '低' }
            ]}
            required
          />
          <FormField
            label="初始状态"
            name="status"
            type="select"
            options={[
              { value: '待处理', label: '待处理' },
              { value: '处理中', label: '处理中' }
            ]}
            required
          />
          <FormField
            label="指派给"
            name="assignedTo"
            placeholder="请输入负责人姓名"
          />
          <FormField
            label="计划完成日期"
            name="plannedCompletionDate"
            type="date"
            required
          />
          <div className="md:col-span-2">
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

  // 渲染更新任务模态框
  const renderUpdateModal = () => {
    if (!selectedTask) return null;
    
    return (
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="更新维护任务"
        size="md"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              icon={<AiOutlineCheck size={16} />}
            >
              保存
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                <AiOutlineTool size={20} />
              </div>
              <div>
                <p className="font-medium">{selectedTask.equipmentType} - {selectedTask.issueType}</p>
                <p className="text-sm text-gray-500">{selectedTask.location}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">问题描述:</p>
              <p className="text-sm mt-1">{selectedTask.issueDescription}</p>
            </div>
          </div>
          
          <FormField
            label="当前状态"
            name="status"
            type="select"
            value={selectedTask.status}
            options={[
              { value: '待处理', label: '待处理' },
              { value: '处理中', label: '处理中' },
              { value: '已完成', label: '已完成' },
              { value: '已取消', label: '已取消' },
              { value: '延期处理', label: '延期处理' }
            ]}
            required
          />
          
          <FormField
            label="指派给"
            name="assignedTo"
            value={selectedTask.assignedTo || ''}
            placeholder="请输入负责人姓名"
          />
          
          <FormField
            label="计划完成日期"
            name="plannedCompletionDate"
            type="date"
            value={selectedTask.plannedCompletionDate}
            required
          />
          
          {selectedTask.status === '已完成' && (
            <>
              <FormField
                label="实际完成日期"
                name="actualCompletionDate"
                type="date"
                value={selectedTask.actualCompletionDate || new Date().toISOString().split('T')[0]}
                required
              />
              
              <FormField
                label="维修费用"
                name="cost"
                placeholder="例如：¥200"
                value={selectedTask.cost || ''}
              />
            </>
          )}
          
          <FormField
            label="更新备注"
            name="notes"
            type="textarea"
            value={selectedTask.notes || ''}
            placeholder="请输入更新备注"
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
        title="筛选维护任务"
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
            label="设备类型"
            name="equipmentType"
            type="select"
            value={filterParams.equipmentType}
            onChange={(e) => setFilterParams(prev => ({ ...prev, equipmentType: e.target.value }))}
            options={getEquipmentTypeOptions()}
          />
          
          <FormField
            label="问题类型"
            name="issueType"
            type="select"
            value={filterParams.issueType}
            onChange={(e) => setFilterParams(prev => ({ ...prev, issueType: e.target.value }))}
            options={getIssueTypeOptions()}
          />
          
          <FormField
            label="优先级"
            name="priority"
            type="select"
            value={filterParams.priority}
            onChange={(e) => setFilterParams(prev => ({ ...prev, priority: e.target.value }))}
            options={getPriorityOptions()}
          />
          
          <FormField
            label="状态"
            name="status"
            type="select"
            value={filterParams.status}
            onChange={(e) => setFilterParams(prev => ({ ...prev, status: e.target.value }))}
            options={getStatusOptions()}
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
            label="关键字搜索"
            name="keyword"
            placeholder="搜索问题描述、位置等"
            value={filterParams.keyword}
            onChange={(e) => setFilterParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
      </Modal>
    );
  };

  // 获取统计数据
  const pendingTasksCount = getPendingTasksCount();
  const urgentTasksCount = getUrgentTasksCount();
  const completedTasksCount = getCompletedTasksCount();

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
          <h1 className="text-2xl font-bold text-gray-800">维护管理</h1>
          <p className="text-gray-600 mt-1">管理设备维护、维修与设施保养</p>
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
            onClick={handleAddTask}
          >
            添加任务
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-red-800">{urgentTasksCount}</p>
              <p className="text-sm text-red-700">紧急任务</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineExclamationCircle size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-800">{pendingTasksCount}</p>
              <p className="text-sm text-yellow-700">待处理任务</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineTool size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-800">{completedTasksCount}</p>
              <p className="text-sm text-green-700">已完成任务</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineCheckCircle size={24} />
            </div>
          </div>
        </Card>
      </div>

      {urgentTasksCount > 0 && (
        <Alert
          type="error"
          title="紧急任务提醒"
          message={`有 ${urgentTasksCount} 个紧急任务需要处理，请尽快安排维修。`}
          className="mb-6"
        />
      )}

      <Card className="mb-6">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <Tabs
            tabs={[
              { key: 'all', label: '全部任务', content: null },
              { key: 'pending', label: '待处理', content: null },
              { key: 'processing', label: '处理中', content: null },
              { key: 'urgent', label: '紧急任务', content: null },
              { key: 'completed', label: '已完成', content: null }
            ]}
            defaultActiveKey="all"
            onChange={(key) => setActiveTab(key)}
          />
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="relative mr-3">
              <input
                type="text"
                placeholder="搜索问题描述、位置..."
                className="input-field pl-10 py-1"
                value={filterParams.keyword}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineSearch className="text-gray-400" size={20} />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                表格
              </Button>
              <Button
                variant={viewMode === 'card' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('card')}
              >
                卡片
              </Button>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <Table
            columns={columns}
            data={filteredTasks}
            emptyMessage="暂无维护任务数据"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <MaintenanceTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleViewTask(task)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                暂无维护任务数据
              </div>
            )}
          </div>
        )}
      </Card>

      {renderDetailModal()}
      {renderAddModal()}
      {renderUpdateModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}