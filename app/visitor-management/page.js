'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  AiOutlinePlus, 
  AiOutlineUser, 
  AiOutlineTeam,
  AiOutlineFilter,
  AiOutlinePhone,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineEnvironment,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineGift,
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
import { getVisitors, getElderlyProfiles, getElderlyById, formatDate } from '../../utils/data-utils';

// 访客记录组件 - 用于复用
const VisitorRecord = ({ visitor, onView }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer p-4 mb-4"
      onClick={onView}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-3">
            <AiOutlineUser size={20} />
          </div>
          <div>
            <h4 className="font-medium">{visitor.visitorName}</h4>
            <p className="text-sm text-gray-600 mt-1">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs mr-1">{visitor.relationship}</span>
              拜访 {visitor.elderlyName}
            </p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <AiOutlineCalendar className="mr-1" />
              <span>{visitor.visitDate}</span>
              <span className="mx-1">|</span>
              <AiOutlineClockCircle className="mr-1" />
              <span>{visitor.checkInTime} - {visitor.checkOutTime === '未离开' ? '未离开' : visitor.checkOutTime}</span>
            </div>
          </div>
        </div>
        <div>
          {visitor.checkOutTime === '未离开' ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              正在访问
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
              已离开
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function VisitorManagement() {
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    elderlyId: '',
    relationship: '',
    visitDate: '',
    status: '',
    keyword: ''
  });
  
  const searchParams = useSearchParams();
  const elderlyIdParam = searchParams.get('elderlyId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有访客数据
        const visitorData = await getVisitors();
        setVisitors(visitorData);
        
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
        console.error('Failed to fetch visitor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [elderlyIdParam]);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [visitors, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...visitors];
    
    // 按老人ID筛选
    if (filterParams.elderlyId) {
      result = result.filter(visitor => visitor.elderlyId === parseInt(filterParams.elderlyId));
    }
    
    // 按关系筛选
    if (filterParams.relationship) {
      result = result.filter(visitor => visitor.relationship === filterParams.relationship);
    }
    
    // 按访问日期筛选
    if (filterParams.visitDate) {
      result = result.filter(visitor => visitor.visitDate === filterParams.visitDate);
    }
    
    // 按状态筛选
    if (filterParams.status) {
      if (filterParams.status === '正在访问') {
        result = result.filter(visitor => visitor.checkOutTime === '未离开');
      } else {
        result = result.filter(visitor => visitor.checkOutTime !== '未离开');
      }
    }
    
    // 按关键字搜索
    if (filterParams.keyword) {
      const keyword = filterParams.keyword.toLowerCase();
      result = result.filter(visitor => 
        visitor.visitorName.toLowerCase().includes(keyword) ||
        visitor.visitorPhone.includes(keyword) ||
        visitor.elderlyName.toLowerCase().includes(keyword)
      );
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(visitor => visitor.visitDate === today);
    } else if (activeTab === 'visiting') {
      result = result.filter(visitor => visitor.checkOutTime === '未离开');
    } else if (activeTab === 'left') {
      result = result.filter(visitor => visitor.checkOutTime !== '未离开');
    }
    
    // 按访问日期和时间排序（最新的在前）
    result.sort((a, b) => {
      const dateComparison = new Date(b.visitDate) - new Date(a.visitDate);
      if (dateComparison !== 0) return dateComparison;
      
      return a.checkInTime.localeCompare(b.checkInTime);
    });
    
    setFilteredVisitors(result);
  };

  const handleViewVisitor = (visitor) => {
    setSelectedVisitor(visitor);
    setIsDetailModalOpen(true);
  };

  const handleAddVisitor = () => {
    setIsAddModalOpen(true);
  };

  const handleCheckout = (visitor) => {
    setSelectedVisitor(visitor);
    setIsCheckoutModalOpen(true);
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
      relationship: '',
      visitDate: '',
      status: '',
      keyword: ''
    });
    setSelectedElderly(null);
  };

  const handleSearchChange = (e) => {
    setFilterParams(prev => ({ ...prev, keyword: e.target.value }));
  };

  // 获取关系选项
  const getRelationshipOptions = () => {
    const relationships = [...new Set(visitors.map(visitor => visitor.relationship))];
    return [
      { value: '', label: '全部关系' },
      ...relationships.map(rel => ({ value: rel, label: rel }))
    ];
  };

  // 获取访问状态选项
  const getStatusOptions = () => {
    return [
      { value: '', label: '全部状态' },
      { value: '正在访问', label: '正在访问' },
      { value: '已离开', label: '已离开' }
    ];
  };

  // 获取访问目的选项
  const getVisitPurposeOptions = () => {
    const purposes = [...new Set(visitors.map(visitor => visitor.visitPurpose))];
    return [
      ...purposes.map(purpose => ({ value: purpose, label: purpose }))
    ];
  };

  // 获取统计数据
  const getTodayVisitors = () => {
    const today = new Date().toISOString().split('T')[0];
    return visitors.filter(visitor => visitor.visitDate === today);
  };

  const getCurrentVisitors = () => {
    return visitors.filter(visitor => visitor.checkOutTime === '未离开');
  };

  // 表格列定义
  const columns = [
    { 
      title: '访客信息', 
      width: '180px',
      render: (record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-2">
            <AiOutlineUser />
          </div>
          <div>
            <div>{record.visitorName}</div>
            <div className="text-xs text-gray-500 flex items-center">
              <AiOutlinePhone className="mr-1" />
              {record.visitorPhone}
            </div>
          </div>
        </div>
      )
    },
    { 
      title: '被访老人', 
      width: '120px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineUser className="text-gray-500 mr-1" />
          <span>{record.elderlyName}</span>
        </div>
      )
    },
    { 
      title: '关系', 
      dataIndex: 'relationship',
      width: '80px',
      render: (record) => (
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
          {record.relationship}
        </span>
      )
    },
    { 
      title: '来访时间', 
      width: '180px',
      render: (record) => (
        <div>
          <div className="flex items-center text-sm">
            <AiOutlineCalendar className="text-gray-500 mr-1" />
            <span>{record.visitDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <AiOutlineClockCircle className="text-gray-500 mr-1" />
            <span>{record.checkInTime} - {record.checkOutTime}</span>
          </div>
        </div>
      )
    },
    { 
      title: '来访目的', 
      dataIndex: 'visitPurpose',
      width: '100px'
    },
    { 
      title: '带来物品', 
      dataIndex: 'broughtItems',
      width: '100px',
      render: (record) => (
        <div>
          {record.broughtItems ? (
            <div className="flex items-center">
              <AiOutlineGift className="text-gray-500 mr-1" />
              <span>{record.broughtItems}</span>
            </div>
          ) : (
            <span className="text-gray-400">无</span>
          )}
        </div>
      )
    },
    { 
      title: '状态', 
      width: '80px',
      render: (record) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          record.checkOutTime === '未离开' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {record.checkOutTime === '未离开' ? '正在访问' : '已离开'}
        </span>
      )
    },
    {
      title: '操作',
      width: '120px',
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewVisitor(record)}
          >
            详情
          </Button>
          {record.checkOutTime === '未离开' && (
            <Button
              size="sm"
              variant="primary"
              icon={<AiOutlineLogout size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                handleCheckout(record);
              }}
            >
              离开
            </Button>
          )}
        </div>
      )
    }
  ];

  // 渲染访客详情模态框
  const renderDetailModal = () => {
    if (!selectedVisitor) return null;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="访客详情"
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
            {selectedVisitor.checkOutTime === '未离开' && (
              <Button
                variant="primary"
                icon={<AiOutlineLogout size={16} />}
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleCheckout(selectedVisitor);
                }}
              >
                登记离开
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">访客信息</h4>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-3">
                  <AiOutlineUser size={20} />
                </div>
                <div>
                  <p className="font-medium">{selectedVisitor.visitorName}</p>
                  <p className="text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {selectedVisitor.relationship}
                    </span>
                  </p>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center">
                  <AiOutlinePhone className="text-gray-500 mr-2 w-5" />
                  <span>{selectedVisitor.visitorPhone}</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineCalendar className="text-gray-500 mr-2 w-5" />
                  <span>访问日期: {selectedVisitor.visitDate}</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineLogin className="text-gray-500 mr-2 w-5" />
                  <span>签到时间: {selectedVisitor.checkInTime}</span>
                </div>
                <div className="flex items-center">
                  <AiOutlineLogout className="text-gray-500 mr-2 w-5" />
                  <span>签离时间: {selectedVisitor.checkOutTime}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">被访人信息</h4>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                  <AiOutlineUser size={20} />
                </div>
                <div>
                  <p className="font-medium">{selectedVisitor.elderlyName}</p>
                  <p className="text-sm text-gray-500">ID: {selectedVisitor.elderlyId}</p>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center">
                  <AiOutlineEnvironment className="text-gray-500 mr-2 w-5" />
                  <span>房间号: {elderlyProfiles.find(p => p.id === selectedVisitor.elderlyId)?.roomNumber || '-'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">访问详情</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">访问目的:</p>
                  <p className="font-medium mt-1">{selectedVisitor.visitPurpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">带来物品:</p>
                  <p className="font-medium mt-1">{selectedVisitor.broughtItems || '无'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">审核人:</p>
                  <p className="font-medium mt-1">{selectedVisitor.approvedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">状态:</p>
                  <p className="font-medium mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedVisitor.checkOutTime === '未离开' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedVisitor.checkOutTime === '未离开' ? '正在访问' : '已离开'}
                    </span>
                  </p>
                </div>
              </div>
              
              {selectedVisitor.notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">备注:</p>
                  <p className="mt-1">{selectedVisitor.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          {selectedVisitor.checkOutTime === '未离开' && (
            <Alert
              type="info"
              title="访客正在访问中"
              message="访客尚未登记离开，请在访客离开时及时登记。"
              className="mt-4"
            />
          )}
        </div>
      </Modal>
    );
  };

  // 渲染添加访客模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="登记访客"
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
            label="访客姓名"
            name="visitorName"
            placeholder="请输入访客姓名"
            required
          />
          <FormField
            label="联系电话"
            name="visitorPhone"
            placeholder="请输入访客电话"
            required
          />
          <FormField
            label="被访老人"
            name="elderlyId"
            type="select"
            options={elderlyProfiles.map(profile => ({
              value: profile.id.toString(),
              label: profile.name
            }))}
            required
          />
          <FormField
            label="与老人关系"
            name="relationship"
            type="select"
            options={[
              { value: '子女', label: '子女' },
              { value: '配偶', label: '配偶' },
              { value: '孙辈', label: '孙辈' },
              { value: '亲戚', label: '亲戚' },
              { value: '朋友', label: '朋友' },
              { value: '邻居', label: '邻居' },
              { value: '社工', label: '社工' }
            ]}
            required
          />
          <FormField
            label="访问日期"
            name="visitDate"
            type="date"
            value={new Date().toISOString().split('T')[0]}
            required
          />
          <FormField
            label="签到时间"
            name="checkInTime"
            type="time"
            value={new Date().toTimeString().substring(0, 5)}
            required
          />
          <FormField
            label="访问目的"
            name="visitPurpose"
            type="select"
            options={getVisitPurposeOptions()}
            required
          />
          <FormField
            label="带来物品"
            name="broughtItems"
            placeholder="请输入带来的物品"
          />
          <FormField
            label="审核人"
            name="approvedBy"
            placeholder="请输入审核人姓名"
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

  // 渲染访客离开模态框
  const renderCheckoutModal = () => {
    if (!selectedVisitor) return null;
    
    return (
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="登记访客离开"
        size="md"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCheckoutModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              icon={<AiOutlineCheck size={16} />}
            >
              确认离开
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p><span className="font-medium">访客姓名:</span> {selectedVisitor.visitorName}</p>
            <p><span className="font-medium">被访老人:</span> {selectedVisitor.elderlyName}</p>
            <p><span className="font-medium">签到时间:</span> {selectedVisitor.visitDate} {selectedVisitor.checkInTime}</p>
          </div>
          
          <FormField
            label="签离时间"
            name="checkOutTime"
            type="time"
            value={new Date().toTimeString().substring(0, 5)}
            required
          />
          
          <FormField
            label="备注"
            name="notes"
            type="textarea"
            placeholder="请输入备注信息"
          />
          
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
            <p className="font-medium">离开提醒</p>
            <p className="text-sm mt-1">请确认访客已归还访客证，并已检查携带的物品。</p>
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
        title="筛选访客记录"
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
            label="被访老人"
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
          
          <FormField
            label="与老人关系"
            name="relationship"
            type="select"
            value={filterParams.relationship}
            onChange={(e) => setFilterParams(prev => ({ ...prev, relationship: e.target.value }))}
            options={getRelationshipOptions()}
          />
          
          <FormField
            label="访问日期"
            name="visitDate"
            type="date"
            value={filterParams.visitDate}
            onChange={(e) => setFilterParams(prev => ({ ...prev, visitDate: e.target.value }))}
          />
          
          <FormField
            label="访问状态"
            name="status"
            type="select"
            value={filterParams.status}
            onChange={(e) => setFilterParams(prev => ({ ...prev, status: e.target.value }))}
            options={getStatusOptions()}
          />
          
          <FormField
            label="关键字搜索"
            name="keyword"
            placeholder="搜索访客姓名、电话"
            value={filterParams.keyword}
            onChange={(e) => setFilterParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
      </Modal>
    );
  };

  // 获取统计数据
  const todayVisitors = getTodayVisitors();
  const currentVisitors = getCurrentVisitors();

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
          <h1 className="text-2xl font-bold text-gray-800">访客管理</h1>
          <p className="text-gray-600 mt-1">
            {selectedElderly ? `${selectedElderly.name}的访客记录` : '管理所有访客记录'}
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
            icon={<AiOutlineLogin size={16} />}
            onClick={handleAddVisitor}
          >
            登记访客
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                <div>
                  <p className="text-sm text-gray-500">房间号</p>
                  <p className="font-medium">{selectedElderly.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">最近访客</p>
                  <p className="font-medium">
                    {filteredVisitors.length > 0 
                      ? filteredVisitors[0].visitorName 
                      : '无访客记录'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">访客总数</p>
                  <p className="font-medium">{filteredVisitors.length}人</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-blue-800">{visitors.length}</p>
              <p className="text-sm text-blue-700">访客总记录</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineTeam size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-800">{currentVisitors.length}</p>
              <p className="text-sm text-green-700">当前访客</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineUser size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-800">{todayVisitors.length}</p>
              <p className="text-sm text-yellow-700">今日访客</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineCalendar size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <Card
            title="当前访客"
            icon={<AiOutlineUser size={18} />}
            headerClassName="bg-green-50 text-green-800"
          >
            <div className="h-[400px] overflow-y-auto py-2">
              {currentVisitors.length > 0 ? (
                currentVisitors.map((visitor, index) => (
                  <div 
                    key={index}
                    className="bg-white border-l-4 border-green-400 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-3 mb-3"
                    onClick={() => handleViewVisitor(visitor)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{visitor.visitorName}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs mr-1">{visitor.relationship}</span>
                          拜访 {visitor.elderlyName}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <AiOutlineClockCircle className="mr-1" />
                          <span>签到: {visitor.checkInTime}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<AiOutlineLogout size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckout(visitor);
                        }}
                      >
                        离开
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <AiOutlineCheck size={48} className="text-green-500 mb-2" />
                  <p>暂无在访人员</p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
              <Tabs
                tabs={[
                  { key: 'all', label: '全部记录', content: null },
                  { key: 'today', label: '今日访客', content: null },
                  { key: 'visiting', label: '正在访问', content: null },
                  { key: 'left', label: '已离开', content: null }
                ]}
                defaultActiveKey="all"
                onChange={(key) => setActiveTab(key)}
              />
              
              <div className="relative mt-4 md:mt-0">
                <input
                  type="text"
                  placeholder="搜索访客姓名、电话..."
                  className="input-field pl-10 py-1"
                  value={filterParams.keyword}
                  onChange={handleSearchChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineSearch className="text-gray-400" size={20} />
                </div>
              </div>
            </div>

            <Table
              columns={columns}
              data={filteredVisitors}
              emptyMessage="暂无访客记录"
            />
          </Card>
        </div>
      </div>

      {renderDetailModal()}
      {renderAddModal()}
      {renderCheckoutModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}