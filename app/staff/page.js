'use client';

import { useState, useEffect } from 'react';
import { 
  AiOutlinePlus, 
  AiOutlineUser, 
  AiOutlineTeam,
  AiOutlineFilter,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineCalendar,
  AiOutlineIdcard,
  AiOutlineClockCircle,
  AiOutlineEnvironment,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineExport,
  AiOutlineSearch
} from 'react-icons/ai';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import Alert from '../../components/ui/Alert';
import { getStaff, formatDate } from '../../utils/data-utils';

// 工作人员卡片组件 - 用于复用
const StaffCard = ({ staff, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-3">
            <AiOutlineUser size={20} />
          </div>
          <div>
            <h3 className="font-bold">{staff.name}</h3>
            <p className="text-gray-600 text-sm">{staff.position}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <AiOutlineTeam className="mr-2" />
            <span>{staff.department}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <AiOutlinePhone className="mr-2" />
            <span>{staff.phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <AiOutlineMail className="mr-2" />
            <span>{staff.email}</span>
          </div>
        </div>
      </div>
      <div className={`px-4 py-2 ${
        staff.status === '在职' ? 'bg-green-50 text-green-700' : 
        staff.status === '休假' ? 'bg-yellow-50 text-yellow-700' : 
        'bg-gray-50 text-gray-700'
      }`}>
        <div className="flex justify-between items-center">
          <span>{staff.status}</span>
          <span>{staff.workingDays}</span>
        </div>
      </div>
    </div>
  );
};

// 资格证书标签组件 - 用于复用
const CertificateTag = ({ name }) => {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
      {name}
    </span>
  );
};

export default function StaffManagement() {
  const [staffData, setStaffData] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    department: '',
    position: '',
    status: '',
    keyword: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有工作人员数据
        const data = await getStaff();
        setStaffData(data);
        setFilteredStaff(data);
      } catch (error) {
        console.error('Failed to fetch staff data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [staffData, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...staffData];
    
    // 按部门筛选
    if (filterParams.department) {
      result = result.filter(staff => staff.department === filterParams.department);
    }
    
    // 按职位筛选
    if (filterParams.position) {
      result = result.filter(staff => staff.position === filterParams.position);
    }
    
    // 按状态筛选
    if (filterParams.status) {
      result = result.filter(staff => staff.status === filterParams.status);
    }
    
    // 按关键字搜索
    if (filterParams.keyword) {
      const keyword = filterParams.keyword.toLowerCase();
      result = result.filter(staff => 
        staff.name.toLowerCase().includes(keyword) ||
        staff.phone.includes(keyword) ||
        staff.email.toLowerCase().includes(keyword)
      );
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'active') {
      result = result.filter(staff => staff.status === '在职');
    } else if (activeTab === 'vacation') {
      result = result.filter(staff => staff.status === '休假');
    } else if (activeTab === 'left') {
      result = result.filter(staff => staff.status === '离职');
    }
    
    // 按姓名排序
    result.sort((a, b) => a.name.localeCompare(b.name));
    
    setFilteredStaff(result);
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setIsDetailModalOpen(true);
  };

  const handleAddStaff = () => {
    setIsAddModalOpen(true);
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
      department: '',
      position: '',
      status: '',
      keyword: ''
    });
  };

  const handleSearchChange = (e) => {
    setFilterParams(prev => ({ ...prev, keyword: e.target.value }));
  };

  // 获取部门和职位选项
  const getDepartmentOptions = () => {
    const departments = [...new Set(staffData.map(staff => staff.department))];
    return [
      { value: '', label: '全部部门' },
      ...departments.map(dept => ({ value: dept, label: dept }))
    ];
  };

  const getPositionOptions = () => {
    // 如果选择了部门，只显示该部门下的职位
    let positions = [];
    if (filterParams.department) {
      positions = [
        ...new Set(
          staffData
            .filter(staff => staff.department === filterParams.department)
            .map(staff => staff.position)
        )
      ];
    } else {
      positions = [...new Set(staffData.map(staff => staff.position))];
    }
    
    return [
      { value: '', label: '全部职位' },
      ...positions.map(pos => ({ value: pos, label: pos }))
    ];
  };

  const getStatusOptions = () => {
    return [
      { value: '', label: '全部状态' },
      { value: '在职', label: '在职' },
      { value: '休假', label: '休假' },
      { value: '离职', label: '离职' }
    ];
  };

  // 获取各部门人数统计
  const getDepartmentStats = () => {
    const stats = {};
    staffData.forEach(staff => {
      if (staff.status === '在职' || staff.status === '休假') {
        if (!stats[staff.department]) {
          stats[staff.department] = 0;
        }
        stats[staff.department]++;
      }
    });
    return stats;
  };

  // 获取各状态人数统计
  const getStatusStats = () => {
    const stats = {
      active: staffData.filter(staff => staff.status === '在职').length,
      vacation: staffData.filter(staff => staff.status === '休假').length,
      left: staffData.filter(staff => staff.status === '离职').length
    };
    return stats;
  };

  // 表格列定义
  const columns = [
    { 
      title: '姓名', 
      dataIndex: 'name',
      width: '120px',
      render: (record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-2">
            <AiOutlineUser />
          </div>
          <div>
            <div>{record.name}</div>
            <div className="text-xs text-gray-500">{record.gender} | {record.age}岁</div>
          </div>
        </div>
      )
    },
    { 
      title: '部门/职位', 
      width: '150px',
      render: (record) => (
        <div>
          <div>{record.department}</div>
          <div className="text-sm text-gray-500">{record.position}</div>
        </div>
      )
    },
    { 
      title: '联系方式', 
      width: '200px',
      render: (record) => (
        <div>
          <div className="flex items-center text-sm">
            <AiOutlinePhone className="text-gray-500 mr-1" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <AiOutlineMail className="mr-1" />
            <span>{record.email}</span>
          </div>
        </div>
      )
    },
    { 
      title: '入职日期', 
      dataIndex: 'hireDate',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineCalendar className="text-gray-500 mr-1" />
          <span>{record.hireDate}</span>
        </div>
      )
    },
    { 
      title: '工作时间', 
      width: '150px',
      render: (record) => (
        <div>
          <div className="text-sm">{record.workingHours}</div>
          <div className="text-xs text-gray-500">{record.workingDays}</div>
        </div>
      )
    },
    { 
      title: '状态', 
      dataIndex: 'status',
      width: '100px',
      render: (record) => {
        const statusColors = {
          '在职': 'bg-green-100 text-green-800',
          '休假': 'bg-yellow-100 text-yellow-800',
          '离职': 'bg-gray-100 text-gray-800'
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
            onClick={() => handleViewStaff(record)}
          >
            详情
          </Button>
        </div>
      )
    }
  ];

  // 渲染工作人员详情模态框
  const renderDetailModal = () => {
    if (!selectedStaff) return null;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="工作人员详情"
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              关闭
            </Button>
            <Button
              variant="primary"
              icon={<AiOutlineEdit size={16} />}
            >
              编辑
            </Button>
            <Button
              variant="primary"
              icon={<AiOutlineExport size={16} />}
            >
              导出信息
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mr-4">
              <AiOutlineUser size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{selectedStaff.name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-gray-600 mr-3">{selectedStaff.gender} | {selectedStaff.age}岁</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedStaff.status === '在职' ? 'bg-green-100 text-green-800' : 
                  selectedStaff.status === '休假' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedStaff.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">基本信息</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <AiOutlineIdcard className="text-gray-500 mr-2" />
                  <span className="text-gray-600 w-20">部门:</span>
                  <span>{selectedStaff.department}</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineTeam className="text-gray-500 mr-2" />
                  <span className="text-gray-600 w-20">职位:</span>
                  <span>{selectedStaff.position}</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineCalendar className="text-gray-500 mr-2" />
                  <span className="text-gray-600 w-20">入职日期:</span>
                  <span>{selectedStaff.hireDate}</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineClockCircle className="text-gray-500 mr-2" />
                  <span className="text-gray-600 w-20">工作时间:</span>
                  <span>{selectedStaff.workingHours}</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineCalendar className="text-gray-500 mr-2" />
                  <span className="text-gray-600 w-20">工作日:</span>
                  <span>{selectedStaff.workingDays}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">联系方式</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <AiOutlinePhone className="text-gray-500 mr-2" />
                  <span className="text-gray-600 w-20">电话:</span>
                  <span>{selectedStaff.phone}</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineMail className="text-gray-500 mr-2" />
                  <span className="text-gray-600 w-20">邮箱:</span>
                  <span>{selectedStaff.email}</span>
                </div>
                <div className="flex items-start mt-2">
                  <AiOutlineUser className="text-gray-500 mr-2 mt-1" />
                  <span className="text-gray-600 w-20 mt-1">紧急联系人:</span>
                  <div>
                    <p>{selectedStaff.emergencyContact.name} ({selectedStaff.emergencyContact.relationship})</p>
                    <p className="text-sm text-gray-500">{selectedStaff.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">资格与证书</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-2">
                <span className="text-gray-600 mr-2">教育程度:</span>
                <span>{selectedStaff.education}</span>
              </div>
              <div>
                <span className="text-gray-600 mr-2">证书:</span>
                <div className="mt-1">
                  {selectedStaff.certificates.map((cert, index) => (
                    <CertificateTag key={index} name={cert} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {selectedStaff.notes && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">备注</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{selectedStaff.notes}</p>
              </div>
            </div>
          )}
          
          {selectedStaff.status === '休假' && (
            <Alert
              type="warning"
              title="员工休假中"
              message="此员工目前处于休假状态，请安排其他人员替代工作。"
              className="mt-4"
            />
          )}
          
          {selectedStaff.status === '离职' && (
            <Alert
              type="error"
              title="员工已离职"
              message="此员工已离职，请勿安排工作。"
              className="mt-4"
            />
          )}
        </div>
      </Modal>
    );
  };

  // 渲染添加工作人员模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加工作人员"
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
            label="姓名"
            name="name"
            placeholder="请输入姓名"
            required
          />
          <FormField
            label="性别"
            name="gender"
            type="select"
            options={[
              { value: '男', label: '男' },
              { value: '女', label: '女' }
            ]}
            required
          />
          <FormField
            label="年龄"
            name="age"
            type="number"
            min="18"
            max="65"
            required
          />
          <FormField
            label="联系电话"
            name="phone"
            placeholder="请输入联系电话"
            required
          />
          <FormField
            label="电子邮箱"
            name="email"
            placeholder="请输入电子邮箱"
            required
          />
          <FormField
            label="部门"
            name="department"
            type="select"
            options={getDepartmentOptions()}
            required
          />
          <FormField
            label="职位"
            name="position"
            placeholder="请输入职位"
            required
          />
          <FormField
            label="入职日期"
            name="hireDate"
            type="date"
            required
          />
          <FormField
            label="教育程度"
            name="education"
            type="select"
            options={[
              { value: '大专', label: '大专' },
              { value: '本科', label: '本科' },
              { value: '硕士', label: '硕士' },
              { value: '博士', label: '博士' },
              { value: '中专', label: '中专' }
            ]}
            required
          />
          <FormField
            label="工作时间"
            name="workingHours"
            placeholder="例如：9:00 - 17:00"
            required
          />
          <FormField
            label="工作日"
            name="workingDays"
            type="select"
            options={[
              { value: '周一至周五', label: '周一至周五' },
              { value: '周一至周六轮班', label: '周一至周六轮班' },
              { value: '四班三倒', label: '四班三倒' }
            ]}
            required
          />
          <FormField
            label="状态"
            name="status"
            type="select"
            options={[
              { value: '在职', label: '在职' },
              { value: '休假', label: '休假' },
              { value: '离职', label: '离职' }
            ]}
            required
          />
          <div className="md:col-span-2">
            <FormField
              label="资格证书"
              name="certificates"
              type="textarea"
              placeholder="请输入证书名称，多个证书用逗号分隔"
            />
          </div>
          <FormField
            label="紧急联系人姓名"
            name="emergencyContactName"
            placeholder="请输入紧急联系人姓名"
            required
          />
          <FormField
            label="紧急联系人关系"
            name="emergencyContactRelationship"
            type="select"
            options={[
              { value: '配偶', label: '配偶' },
              { value: '父母', label: '父母' },
              { value: '兄弟姐妹', label: '兄弟姐妹' },
              { value: '朋友', label: '朋友' }
            ]}
            required
          />
          <FormField
            label="紧急联系人电话"
            name="emergencyContactPhone"
            placeholder="请输入紧急联系人电话"
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

  // 渲染筛选模态框
  const renderFilterModal = () => {
    return (
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="筛选工作人员"
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
            label="部门"
            name="department"
            type="select"
            value={filterParams.department}
            onChange={(e) => setFilterParams(prev => ({ ...prev, department: e.target.value, position: '' }))}
            options={getDepartmentOptions()}
          />
          
          <FormField
            label="职位"
            name="position"
            type="select"
            value={filterParams.position}
            onChange={(e) => setFilterParams(prev => ({ ...prev, position: e.target.value }))}
            options={getPositionOptions()}
          />
          
          <FormField
            label="状态"
            name="status"
            type="select"
            value={filterParams.status}
            onChange={(e) => setFilterParams(prev => ({ ...prev, status: e.target.value }))}
            options={getStatusOptions()}
          />
          
          <FormField
            label="关键字搜索"
            name="keyword"
            placeholder="搜索姓名、电话、邮箱"
            value={filterParams.keyword}
            onChange={(e) => setFilterParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
      </Modal>
    );
  };

  // 获取部门和状态统计
  const departmentStats = getDepartmentStats();
  const statusStats = getStatusStats();

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
          <h1 className="text-2xl font-bold text-gray-800">工作人员管理</h1>
          <p className="text-gray-600 mt-1">管理所有工作人员信息和排班</p>
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
            onClick={handleAddStaff}
          >
            添加员工
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-800">{statusStats.active}</p>
              <p className="text-sm text-green-700">在职员工</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineTeam size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-800">{statusStats.vacation}</p>
              <p className="text-sm text-yellow-700">休假员工</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineClockCircle size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-blue-800">{departmentStats['护理部'] || 0}</p>
              <p className="text-sm text-blue-700">护理人员</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineUser size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-purple-800">{departmentStats['医疗部'] || 0}</p>
              <p className="text-sm text-purple-700">医疗人员</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineUser size={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <Tabs
            tabs={[
              { key: 'all', label: '全部人员', content: null },
              { key: 'active', label: '在职人员', content: null },
              { key: 'vacation', label: '休假人员', content: null },
              { key: 'left', label: '离职人员', content: null }
            ]}
            defaultActiveKey="all"
            onChange={(key) => setActiveTab(key)}
          />
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="relative mr-3">
              <input
                type="text"
                placeholder="搜索姓名、电话、邮箱..."
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
            data={filteredStaff}
            emptyMessage="暂无工作人员数据"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  onClick={() => handleViewStaff(staff)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                暂无工作人员数据
              </div>
            )}
          </div>
        )}
      </Card>

      {renderDetailModal()}
      {renderAddModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}