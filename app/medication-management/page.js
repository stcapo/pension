'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  AiOutlinePlus, 
  AiOutlineUser, 
  AiOutlineMedicineBox, 
  AiOutlineClockCircle,
  AiOutlineWarning,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineFilter,
  AiOutlineCalendar,
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
import { getMedications, getElderlyProfiles, getElderlyById, formatDate } from '../../utils/data-utils';

export default function MedicationManagement() {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    elderlyId: '',
    medicationName: '',
    status: ''
  });
  
  const searchParams = useSearchParams();
  const elderlyIdParam = searchParams.get('elderlyId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有药物管理数据
        const medicationData = await getMedications();
        setMedications(medicationData);
        
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
        console.error('Failed to fetch medication data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [elderlyIdParam]);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [medications, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...medications];
    
    // 按老人ID筛选
    if (filterParams.elderlyId) {
      result = result.filter(med => med.elderlyId === parseInt(filterParams.elderlyId));
    }
    
    // 按药物名称筛选
    if (filterParams.medicationName) {
      result = result.filter(med => 
        med.medicationName.includes(filterParams.medicationName)
      );
    }
    
    // 按状态筛选
    if (filterParams.status) {
      result = result.filter(med => med.status === filterParams.status);
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'active') {
      result = result.filter(med => med.status === '正在使用');
    } else if (activeTab === 'low-stock') {
      result = result.filter(med => med.status === '即将耗尽');
    } else if (activeTab === 'stopped') {
      result = result.filter(med => med.status === '已停用');
    }
    
    // 按药物名称排序
    result.sort((a, b) => {
      if (a.elderlyName !== b.elderlyName) {
        return a.elderlyName.localeCompare(b.elderlyName);
      }
      return a.medicationName.localeCompare(b.medicationName);
    });
    
    setFilteredMedications(result);
  };

  const handleAddMedication = () => {
    setIsAddModalOpen(true);
  };

  const handleViewMedication = (medication) => {
    setSelectedMedication(medication);
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
      medicationName: '',
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
      title: '药物名称', 
      dataIndex: 'medicationName',
      width: '130px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineMedicineBox className="text-green-600 mr-1" />
          <span>{record.medicationName}</span>
        </div>
      )
    },
    { 
      title: '剂量/频率', 
      width: '150px',
      render: (record) => (
        <span>
          {record.dosage} / {record.frequency}
        </span>
      )
    },
    { 
      title: '服用时间', 
      width: '150px',
      render: (record) => (
        <div>
          {record.timeOfDay.map((time, index) => (
            <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-1 mb-1">
              {time}
            </span>
          ))}
        </div>
      )
    },
    { 
      title: '开始日期', 
      dataIndex: 'startDate',
      width: '100px'
    },
    { 
      title: '结束日期', 
      dataIndex: 'endDate',
      width: '100px'
    },
    { 
      title: '库存', 
      width: '80px',
      render: (record) => {
        const isLowStock = record.stock <= 10;
        
        return (
          <span className={`${isLowStock ? 'text-red-600 font-medium' : ''}`}>
            {record.stock} {isLowStock && <AiOutlineWarning className="inline-block ml-1" />}
          </span>
        );
      }
    },
    { 
      title: '状态', 
      dataIndex: 'status',
      width: '100px',
      render: (record) => {
        const statusColors = {
          '正在使用': 'bg-green-100 text-green-800',
          '即将耗尽': 'bg-red-100 text-red-800',
          '已停用': 'bg-gray-100 text-gray-800',
          '需要补充': 'bg-yellow-100 text-yellow-800'
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
      width: '80px',
      render: (record) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleViewMedication(record)}
        >
          详情
        </Button>
      )
    }
  ];

  // 渲染添加药物模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加药物"
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
            label="药物名称"
            name="medicationName"
            placeholder="请输入药物名称"
            required
          />
          <FormField
            label="剂量"
            name="dosage"
            placeholder="例如：1片、5ml等"
            required
          />
          <FormField
            label="频率"
            name="frequency"
            type="select"
            options={[
              { value: '每天一次', label: '每天一次' },
              { value: '每天两次', label: '每天两次' },
              { value: '每天三次', label: '每天三次' },
              { value: '需要时服用', label: '需要时服用' },
              { value: '每周三次', label: '每周三次' }
            ]}
            required
          />
          <div className="col-span-2">
            <FormField
              label="服用时间"
              name="timeOfDay"
              type="checkbox"
              options={[
                { value: '早餐前', label: '早餐前' },
                { value: '早餐后', label: '早餐后' },
                { value: '午餐前', label: '午餐前' },
                { value: '午餐后', label: '午餐后' },
                { value: '晚餐前', label: '晚餐前' },
                { value: '晚餐后', label: '晚餐后' },
                { value: '睡前', label: '睡前' }
              ]}
              required
            />
          </div>
          <FormField
            label="开始日期"
            name="startDate"
            type="date"
            required
          />
          <FormField
            label="结束日期"
            name="endDate"
            type="date"
            hint="留空表示长期服用"
          />
          <FormField
            label="医生处方"
            name="prescribedBy"
            placeholder="开药医生姓名"
            required
          />
          <FormField
            label="库存数量"
            name="stock"
            type="number"
            min="0"
            required
          />
          <FormField
            label="状态"
            name="status"
            type="select"
            options={[
              { value: '正在使用', label: '正在使用' },
              { value: '即将耗尽', label: '即将耗尽' },
              { value: '已停用', label: '已停用' },
              { value: '需要补充', label: '需要补充' }
            ]}
            required
          />
          <div className="col-span-2">
            <FormField
              label="用法说明"
              name="notes"
              type="textarea"
              placeholder="请输入药物用法说明"
            />
          </div>
          <div className="col-span-2">
            <FormField
              label="可能副作用"
              name="sideEffects"
              type="textarea"
              placeholder="请输入可能的副作用"
            />
          </div>
        </div>
      </Modal>
    );
  };

  // 渲染药物详情模态框
  const renderDetailModal = () => {
    if (!selectedMedication) return null;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="药物详情"
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
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
              <AiOutlineMedicineBox size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{selectedMedication.medicationName}</h3>
              <p className="text-gray-600">
                {selectedMedication.elderlyName} 的医嘱用药
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500">剂量</p>
              <p className="text-lg font-medium mt-1">{selectedMedication.dosage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">频率</p>
              <p className="text-lg font-medium mt-1">{selectedMedication.frequency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">服用时间</p>
              <div className="mt-1">
                {selectedMedication.timeOfDay.map((time, index) => (
                  <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mr-2 mb-2">
                    {time}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">医生处方</p>
              <p className="text-lg font-medium mt-1">{selectedMedication.prescribedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">开始日期</p>
              <p className="text-lg font-medium mt-1">{selectedMedication.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">结束日期</p>
              <p className="text-lg font-medium mt-1">{selectedMedication.endDate || '长期服用'}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-blue-700 font-medium mb-2">
                <AiOutlineCalendar className="inline-block mr-1" /> 服药管理
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">当前库存</p>
                  <p className={`text-lg font-bold ${selectedMedication.stock <= 10 ? 'text-red-600' : ''}`}>
                    {selectedMedication.stock}
                    {selectedMedication.stock <= 10 && <AiOutlineWarning className="inline-block ml-1" />}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">状态</p>
                  <p className="text-lg font-bold">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedMedication.status === '正在使用' ? 'bg-green-100 text-green-800' :
                      selectedMedication.status === '即将耗尽' ? 'bg-red-100 text-red-800' :
                      selectedMedication.status === '已停用' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedMedication.status}
                    </span>
                  </p>
                </div>
              </div>
              
              {selectedMedication.status === '即将耗尽' && (
                <Alert
                  type="warning"
                  title="库存警告"
                  message="药物库存即将耗尽，请及时补充"
                  className="mt-4"
                />
              )}
            </div>
          </div>
          
          {selectedMedication.notes && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">用法说明</h4>
              <div className="bg-gray-100 p-3 rounded-md">
                <p>{selectedMedication.notes}</p>
              </div>
            </div>
          )}
          
          {selectedMedication.sideEffects && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">可能副作用</h4>
              <div className="bg-red-50 p-3 rounded-md text-red-800">
                <p>{selectedMedication.sideEffects}</p>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <Button
              variant="primary"
              icon={<AiOutlineCheck size={16} />}
              fullWidth
            >
              记录服药
            </Button>
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
        title="筛选药物"
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
          
          <FormField
            label="药物名称"
            name="medicationName"
            placeholder="输入药物名称搜索"
            value={filterParams.medicationName}
            onChange={(e) => setFilterParams(prev => ({ ...prev, medicationName: e.target.value }))}
          />
          
          <FormField
            label="状态"
            name="status"
            type="select"
            value={filterParams.status}
            onChange={(e) => setFilterParams(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: '', label: '全部状态' },
              { value: '正在使用', label: '正在使用' },
              { value: '即将耗尽', label: '即将耗尽' },
              { value: '已停用', label: '已停用' },
              { value: '需要补充', label: '需要补充' }
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

  // 计算低库存药物数量
  const lowStockCount = medications.filter(med => med.status === '即将耗尽').length;

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">药物管理</h1>
          <p className="text-gray-600 mt-1">
            {selectedElderly ? `${selectedElderly.name}的用药管理` : '管理所有老人的药物信息'}
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
            onClick={handleAddMedication}
          >
            添加药物
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
                  <p className="text-sm text-gray-500">慢性病</p>
                  <p className="font-medium truncate" title={selectedElderly.chronicDiseases.join('、')}>
                    {selectedElderly.chronicDiseases.length > 0 
                      ? selectedElderly.chronicDiseases.join('、') 
                      : '无'
                    }
                  </p>
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
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-800">{filteredMedications.filter(m => m.status === '正在使用').length}</p>
              <p className="text-sm text-green-700">正在使用的药物</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineMedicineBox size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-800">{elderlyProfiles.length}</p>
              <p className="text-sm text-yellow-700">用药老人数量</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineUser size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-red-800">{lowStockCount}</p>
              <p className="text-sm text-red-700">库存不足药物</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineWarning size={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="mb-4">
          <Tabs
            tabs={[
              { key: 'all', label: '全部药物', content: null },
              { key: 'active', label: '正在使用', content: null },
              { key: 'low-stock', label: '库存不足', content: null },
              { key: 'stopped', label: '已停用', content: null }
            ]}
            defaultActiveKey="all"
            onChange={(key) => setActiveTab(key)}
          />
        </div>

        {lowStockCount > 0 && (
          <div className="mb-4">
            <Alert
              type="warning"
              title="药物库存警告"
              message={`有 ${lowStockCount} 种药物库存不足，请及时补充`}
              closable
            />
          </div>
        )}

        <Table
          columns={columns}
          data={filteredMedications}
          emptyMessage="暂无药物数据"
        />
      </Card>

      {renderAddModal()}
      {renderDetailModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}