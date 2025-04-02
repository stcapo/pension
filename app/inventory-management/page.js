'use client';

import { useState, useEffect } from 'react';
import { 
  AiOutlinePlus, 
  AiOutlineFilter,
  AiOutlineSearch,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineExport,
  AiOutlineImport,
  AiOutlineWarning,
  AiOutlineInfoCircle,
  AiOutlineCalendar,
  AiOutlineTag,
  AiOutlineShop,
  AiOutlineEnvironment,
  AiOutlineStock
} from 'react-icons/ai';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import Alert from '../../components/ui/Alert';
import { getInventory, formatDate } from '../../utils/data-utils';

// 库存项目卡片组件 - 用于复用
const InventoryItemCard = ({ item, onClick }) => {
  const isLowStock = item.currentStock <= item.minimumStock;
  const expired = item.expiryDate && new Date(item.expiryDate) < new Date();
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${
        isLowStock ? 'border-l-4 border-yellow-500' : 
        expired ? 'border-l-4 border-red-500' : 
        'border'
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{item.name}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            item.status === '充足' ? 'bg-green-100 text-green-800' : 
            item.status === '需补充' ? 'bg-yellow-100 text-yellow-800' : 
            item.status === '库存低' ? 'bg-orange-100 text-orange-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {item.status}
          </span>
        </div>
        
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <AiOutlineTag className="mr-1" />
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
            {item.category}
          </span>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-sm text-gray-500">当前库存</p>
            <p className={`font-medium ${isLowStock ? 'text-red-600' : ''}`}>
              {item.currentStock} {item.unit}
              {isLowStock && <AiOutlineWarning className="inline-block ml-1" />}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">最低库存</p>
            <p className="font-medium">{item.minimumStock} {item.unit}</p>
          </div>
        </div>
        
        {item.expiryDate && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">有效期至</p>
            <p className={`font-medium ${expired ? 'text-red-600' : ''}`}>
              {item.expiryDate}
              {expired && <AiOutlineWarning className="inline-block ml-1" />}
            </p>
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center text-sm">
        <span className="text-gray-500">进货价: ¥{item.purchasePrice}</span>
        <span className="text-gray-500">{item.storageLocation}</span>
      </div>
    </div>
  );
};

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    category: '',
    status: '',
    storageLocation: '',
    keyword: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有库存数据
        const data = await getInventory();
        setInventory(data);
        setFilteredInventory(data);
      } catch (error) {
        console.error('Failed to fetch inventory data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [inventory, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...inventory];
    
    // 按类别筛选
    if (filterParams.category) {
      result = result.filter(item => item.category === filterParams.category);
    }
    
    // 按状态筛选
    if (filterParams.status) {
      result = result.filter(item => item.status === filterParams.status);
    }
    
    // 按存放位置筛选
    if (filterParams.storageLocation) {
      result = result.filter(item => item.storageLocation === filterParams.storageLocation);
    }
    
    // 按关键字搜索
    if (filterParams.keyword) {
      const keyword = filterParams.keyword.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.supplier.toLowerCase().includes(keyword)
      );
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'low') {
      result = result.filter(item => item.currentStock <= item.minimumStock);
    } else if (activeTab === 'medical') {
      result = result.filter(item => item.category === '医疗用品');
    } else if (activeTab === 'expired') {
      const today = new Date();
      result = result.filter(item => 
        item.expiryDate && new Date(item.expiryDate) < today
      );
    }
    
    // 按类别和名称排序
    result.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    setFilteredInventory(result);
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleRestockItem = (item) => {
    setSelectedItem(item);
    setIsRestockModalOpen(true);
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
      category: '',
      status: '',
      storageLocation: '',
      keyword: ''
    });
  };

  const handleSearchChange = (e) => {
    setFilterParams(prev => ({ ...prev, keyword: e.target.value }));
  };

  // 获取类别、状态和存放位置选项
  const getCategoryOptions = () => {
    const categories = [...new Set(inventory.map(item => item.category))];
    return [
      { value: '', label: '全部类别' },
      ...categories.map(cat => ({ value: cat, label: cat }))
    ];
  };

  const getStatusOptions = () => {
    return [
      { value: '', label: '全部状态' },
      { value: '充足', label: '充足' },
      { value: '需补充', label: '需补充' },
      { value: '库存低', label: '库存低' },
      { value: '已用尽', label: '已用尽' }
    ];
  };

  const getStorageLocationOptions = () => {
    const locations = [...new Set(inventory.map(item => item.storageLocation))];
    return [
      { value: '', label: '全部位置' },
      ...locations.map(loc => ({ value: loc, label: loc }))
    ];
  };

  // 获取供应商选项
  const getSupplierOptions = () => {
    const suppliers = [...new Set(inventory.map(item => item.supplier))];
    return [
      ...suppliers.map(sup => ({ value: sup, label: sup }))
    ];
  };

  // 获取单位选项
  const getUnitOptions = () => {
    const units = [...new Set(inventory.map(item => item.unit))];
    return [
      ...units.map(unit => ({ value: unit, label: unit }))
    ];
  };

  // 获取统计数据
  const getLowStockCount = () => {
    return inventory.filter(item => item.currentStock <= item.minimumStock).length;
  };

  const getExpiredCount = () => {
    const today = new Date();
    return inventory.filter(item => 
      item.expiryDate && new Date(item.expiryDate) < today
    ).length;
  };

  const getMedicalItemsCount = () => {
    return inventory.filter(item => item.category === '医疗用品').length;
  };

  // 表格列定义
  const columns = [
    { 
      title: '物品名称', 
      dataIndex: 'name',
      width: '150px',
      render: (record) => (
        <div className="flex items-center">
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs mr-2">
            {record.category}
          </span>
          <span>{record.name}</span>
        </div>
      )
    },
    { 
      title: '库存情况', 
      width: '150px',
      render: (record) => {
        const isLowStock = record.currentStock <= record.minimumStock;
        
        return (
          <div>
            <div className={`font-medium ${isLowStock ? 'text-red-600' : ''}`}>
              {record.currentStock} {record.unit}
              {isLowStock && <AiOutlineWarning className="inline-block ml-1" />}
            </div>
            <div className="text-xs text-gray-500">
              最低库存: {record.minimumStock} {record.unit}
            </div>
          </div>
        );
      }
    },
    { 
      title: '采购信息', 
      width: '150px',
      render: (record) => (
        <div>
          <div className="text-sm">¥{record.purchasePrice}</div>
          <div className="text-xs text-gray-500">{record.supplier}</div>
        </div>
      )
    },
    { 
      title: '存放位置', 
      dataIndex: 'storageLocation',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineEnvironment className="text-gray-500 mr-1" />
          <span>{record.storageLocation}</span>
        </div>
      )
    },
    { 
      title: '最近入库', 
      dataIndex: 'lastRestockDate',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineCalendar className="text-gray-500 mr-1" />
          <span>{record.lastRestockDate}</span>
        </div>
      )
    },
    { 
      title: '有效期', 
      dataIndex: 'expiryDate',
      width: '100px',
      render: (record) => {
        if (!record.expiryDate) return <span className="text-gray-400">-</span>;
        
        const expired = new Date(record.expiryDate) < new Date();
        
        return (
          <div className={`${expired ? 'text-red-600 font-medium' : ''}`}>
            {record.expiryDate}
            {expired && <AiOutlineWarning className="inline-block ml-1" />}
          </div>
        );
      }
    },
    { 
      title: '状态', 
      dataIndex: 'status',
      width: '100px',
      render: (record) => {
        const statusColors = {
          '充足': 'bg-green-100 text-green-800',
          '需补充': 'bg-yellow-100 text-yellow-800',
          '库存低': 'bg-orange-100 text-orange-800',
          '已用尽': 'bg-red-100 text-red-800'
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
      width: '140px',
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewItem(record)}
          >
            详情
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<AiOutlineImport size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleRestockItem(record);
            }}
          >
            入库
          </Button>
        </div>
      )
    }
  ];

  // 渲染库存详情模态框
  const renderDetailModal = () => {
    if (!selectedItem) return null;
    
    const isLowStock = selectedItem.currentStock <= selectedItem.minimumStock;
    const expired = selectedItem.expiryDate && new Date(selectedItem.expiryDate) < new Date();
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="库存详情"
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
              icon={<AiOutlineImport size={16} />}
              onClick={() => {
                setIsDetailModalOpen(false);
                handleRestockItem(selectedItem);
              }}
            >
              入库
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
              <AiOutlineTag size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{selectedItem.name}</h3>
              <div className="flex items-center mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs mr-2">
                  {selectedItem.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedItem.status === '充足' ? 'bg-green-100 text-green-800' : 
                  selectedItem.status === '需补充' ? 'bg-yellow-100 text-yellow-800' : 
                  selectedItem.status === '库存低' ? 'bg-orange-100 text-orange-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">库存信息</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">当前库存:</p>
                  <p className={`text-xl font-medium ${isLowStock ? 'text-red-600' : ''}`}>
                    {selectedItem.currentStock} {selectedItem.unit}
                    {isLowStock && <AiOutlineWarning className="inline-block ml-1" />}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">最低库存:</p>
                  <p className="font-medium">{selectedItem.minimumStock} {selectedItem.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">存放位置:</p>
                  <p className="font-medium">{selectedItem.storageLocation}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">采购信息</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">采购价格:</p>
                  <p className="font-medium">¥{selectedItem.purchasePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">供应商:</p>
                  <p className="font-medium">{selectedItem.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">最近入库:</p>
                  <p className="font-medium">{selectedItem.lastRestockDate}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">有效期管理</h4>
              {selectedItem.expiryDate ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">有效期至:</p>
                    <p className={`font-medium ${expired ? 'text-red-600' : ''}`}>
                      {selectedItem.expiryDate}
                      {expired && <AiOutlineWarning className="inline-block ml-1" />}
                    </p>
                  </div>
                  {expired ? (
                    <div className="p-2 bg-red-100 text-red-800 rounded-md">
                      <p className="text-sm font-medium">该物品已过期</p>
                      <p className="text-xs mt-1">请尽快处理或更新库存</p>
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-100 rounded-md">
                      <p className="text-sm">请关注有效期</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">该物品无有效期限制</p>
              )}
            </div>
          </div>
          
          {selectedItem.notes && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">备注</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{selectedItem.notes}</p>
              </div>
            </div>
          )}
          
          {isLowStock && (
            <Alert
              type="warning"
              title="库存警告"
              message="该物品库存低于最低库存，请尽快补充。"
              className="mt-4"
            />
          )}
        </div>
      </Modal>
    );
  };

  // 渲染添加物品模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加物品"
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
            label="物品名称"
            name="name"
            placeholder="请输入物品名称"
            required
          />
          <FormField
            label="物品类别"
            name="category"
            type="select"
            options={getCategoryOptions()}
            required
          />
          <FormField
            label="当前库存"
            name="currentStock"
            type="number"
            min="0"
            required
          />
          <div className="flex space-x-2">
            <div className="flex-1">
              <FormField
                label="单位"
                name="unit"
                type="select"
                options={getUnitOptions()}
                required
              />
            </div>
            <div className="flex-1">
              <FormField
                label="最低库存"
                name="minimumStock"
                type="number"
                min="0"
                required
              />
            </div>
          </div>
          <FormField
            label="采购价格"
            name="purchasePrice"
            type="number"
            min="0"
            step="0.01"
            required
          />
          <FormField
            label="供应商"
            name="supplier"
            type="select"
            options={getSupplierOptions()}
            required
          />
          <FormField
            label="存放位置"
            name="storageLocation"
            type="select"
            options={getStorageLocationOptions()}
            required
          />
          <FormField
            label="有效期"
            name="expiryDate"
            type="date"
            hint="如适用"
          />
          <FormField
            label="状态"
            name="status"
            type="select"
            options={getStatusOptions()}
            required
          />
          <FormField
            label="入库日期"
            name="lastRestockDate"
            type="date"
            value={new Date().toISOString().split('T')[0]}
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

  // 渲染入库模态框
  const renderRestockModal = () => {
    if (!selectedItem) return null;
    
    return (
      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        title="物品入库"
        size="md"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsRestockModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              icon={<AiOutlineCheck size={16} />}
            >
              确认入库
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                <AiOutlineTag size={20} />
              </div>
              <div>
                <p className="font-medium">{selectedItem.name}</p>
                <p className="text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {selectedItem.category}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">当前库存:</p>
                <p className="font-medium">{selectedItem.currentStock} {selectedItem.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">最低库存:</p>
                <p className="font-medium">{selectedItem.minimumStock} {selectedItem.unit}</p>
              </div>
            </div>
          </div>
          
          <FormField
            label="入库数量"
            name="restockQuantity"
            type="number"
            min="1"
            required
          />
          
          <FormField
            label="入库日期"
            name="restockDate"
            type="date"
            value={new Date().toISOString().split('T')[0]}
            required
          />
          
          <FormField
            label="供应商"
            name="supplier"
            value={selectedItem.supplier}
            required
          />
          
          {selectedItem.expiryDate && (
            <FormField
              label="新有效期至"
              name="newExpiryDate"
              type="date"
              required
            />
          )}
          
          <FormField
            label="入库备注"
            name="restockNotes"
            type="textarea"
            placeholder="请输入入库备注"
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
        title="筛选库存"
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
            label="物品类别"
            name="category"
            type="select"
            value={filterParams.category}
            onChange={(e) => setFilterParams(prev => ({ ...prev, category: e.target.value }))}
            options={getCategoryOptions()}
          />
          
          <FormField
            label="库存状态"
            name="status"
            type="select"
            value={filterParams.status}
            onChange={(e) => setFilterParams(prev => ({ ...prev, status: e.target.value }))}
            options={getStatusOptions()}
          />
          
          <FormField
            label="存放位置"
            name="storageLocation"
            type="select"
            value={filterParams.storageLocation}
            onChange={(e) => setFilterParams(prev => ({ ...prev, storageLocation: e.target.value }))}
            options={getStorageLocationOptions()}
          />
          
          <FormField
            label="关键字搜索"
            name="keyword"
            placeholder="搜索物品名称、类别、供应商"
            value={filterParams.keyword}
            onChange={(e) => setFilterParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
      </Modal>
    );
  };

  // 获取统计数据
  const lowStockCount = getLowStockCount();
  const expiredCount = getExpiredCount();
  const medicalItemsCount = getMedicalItemsCount();

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
          <h1 className="text-2xl font-bold text-gray-800">库存管理</h1>
          <p className="text-gray-600 mt-1">管理所有物资和设备的库存信息</p>
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
            onClick={handleAddItem}
          >
            添加物品
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-blue-800">{inventory.length}</p>
              <p className="text-sm text-blue-700">库存物品总数</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineStock size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-800">{lowStockCount}</p>
              <p className="text-sm text-yellow-700">库存不足物品</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineWarning size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-red-800">{expiredCount}</p>
              <p className="text-sm text-red-700">已过期物品</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineCalendar size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-800">{medicalItemsCount}</p>
              <p className="text-sm text-green-700">医疗用品</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineInfoCircle size={24} />
            </div>
          </div>
        </Card>
      </div>

      {lowStockCount > 0 && (
        <Alert
          type="warning"
          title="库存警告"
          message={`有 ${lowStockCount} 种物品库存不足，请及时补充。`}
          className="mb-6"
        />
      )}

      {expiredCount > 0 && (
        <Alert
          type="error"
          title="过期警告"
          message={`有 ${expiredCount} 种物品已过期，请及时处理。`}
          className="mb-6"
        />
      )}

      <Card className="mb-6">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <Tabs
            tabs={[
              { key: 'all', label: '全部物品', content: null },
              { key: 'low', label: '库存不足', content: null },
              { key: 'medical', label: '医疗用品', content: null },
              { key: 'expired', label: '已过期', content: null }
            ]}
            defaultActiveKey="all"
            onChange={(key) => setActiveTab(key)}
          />
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="relative mr-3">
              <input
                type="text"
                placeholder="搜索物品名称、类别..."
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
            data={filteredInventory}
            emptyMessage="暂无库存数据"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleViewItem(item)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                暂无库存数据
              </div>
            )}
          </div>
        )}
      </Card>

      {renderDetailModal()}
      {renderAddModal()}
      {renderRestockModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}