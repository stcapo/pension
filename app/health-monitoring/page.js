'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AiOutlineHeart, AiOutlinePlus, AiOutlineUser, AiOutlineCalendar, AiOutlineFilter, AiOutlineDownload } from 'react-icons/ai';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import { getHealthData, getElderlyProfiles, getElderlyById, filterDataByDateRange, formatDate } from '../../utils/data-utils';

export default function HealthMonitoring() {
  const [healthData, setHealthData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    elderlyId: '',
    startDate: '',
    endDate: '',
    bloodPressureMin: '',
    bloodPressureMax: '',
    abnormalOnly: false
  });
  
  const searchParams = useSearchParams();
  const elderlyIdParam = searchParams.get('elderlyId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有健康监测数据
        const healthRecords = await getHealthData();
        setHealthData(healthRecords);
        
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
        console.error('Failed to fetch health data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [elderlyIdParam]);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [healthData, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...healthData];
    
    // 按老人ID筛选
    if (filterParams.elderlyId) {
      result = result.filter(record => record.elderlyId === parseInt(filterParams.elderlyId));
    }
    
    // 按日期范围筛选
    if (filterParams.startDate || filterParams.endDate) {
      result = filterDataByDateRange(
        result, 
        filterParams.startDate, 
        filterParams.endDate
      );
    }
    
    // 按血压范围筛选
    if (filterParams.bloodPressureMin) {
      result = result.filter(record => record.bloodPressureHigh >= parseInt(filterParams.bloodPressureMin));
    }
    
    if (filterParams.bloodPressureMax) {
      result = result.filter(record => record.bloodPressureHigh <= parseInt(filterParams.bloodPressureMax));
    }
    
    // 仅显示异常数据
    if (filterParams.abnormalOnly) {
      result = result.filter(record => 
        record.bloodPressureHigh > 140 || 
        record.bloodPressureHigh < 90 ||
        record.bloodPressureLow > 90 ||
        record.bloodPressureLow < 60 ||
        record.heartRate > 100 ||
        record.heartRate < 60 ||
        record.temperature > 37.3 ||
        parseFloat(record.bloodSugar) > 11.1
      );
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(record => record.date === today);
    } else if (activeTab === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(record => new Date(record.date) >= oneWeekAgo);
    }
    
    // 按日期降序排序
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredData(result);
  };

  const handleAddRecord = () => {
    setIsAddModalOpen(true);
  };

  const handleViewRecord = (record) => {
    setSelectedHealthRecord(record);
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
      bloodPressureMin: '',
      bloodPressureMax: '',
      abnormalOnly: false
    });
    setSelectedElderly(null);
  };

  // 表格列定义
  const columns = [
    { 
      title: '老人姓名', 
      dataIndex: 'elderlyName',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-2">
            <AiOutlineUser />
          </div>
          <span>{record.elderlyName}</span>
        </div>
      )
    },
    { title: '日期', dataIndex: 'date', width: '100px' },
    { 
      title: '血压(mmHg)', 
      width: '120px',
      render: (record) => {
        const isHigh = record.bloodPressureHigh > 140 || record.bloodPressureLow > 90;
        const isLow = record.bloodPressureHigh < 90 || record.bloodPressureLow < 60;
        
        return (
          <span className={`font-medium ${isHigh ? 'text-red-600' : isLow ? 'text-blue-600' : ''}`}>
            {record.bloodPressureHigh}/{record.bloodPressureLow}
          </span>
        );
      }
    },
    { 
      title: '心率(bpm)', 
      dataIndex: 'heartRate',
      width: '100px',
      render: (record) => {
        const isAbnormal = record.heartRate > 100 || record.heartRate < 60;
        
        return (
          <span className={`font-medium ${isAbnormal ? 'text-red-600' : ''}`}>
            {record.heartRate}
          </span>
        );
      }
    },
    { 
      title: '体温(°C)', 
      dataIndex: 'temperature',
      width: '100px',
      render: (record) => {
        const isAbnormal = record.temperature > 37.3;
        
        return (
          <span className={`font-medium ${isAbnormal ? 'text-red-600' : ''}`}>
            {record.temperature}
          </span>
        );
      }
    },
    { 
      title: '血糖(mmol/L)', 
      dataIndex: 'bloodSugar',
      width: '120px',
      render: (record) => {
        const isAbnormal = parseFloat(record.bloodSugar) > 11.1;
        
        return (
          <span className={`font-medium ${isAbnormal ? 'text-red-600' : ''}`}>
            {record.bloodSugar}
          </span>
        );
      }
    },
    { 
      title: '情绪状态', 
      dataIndex: 'moodStatus',
      width: '100px',
      render: (record) => {
        const moodColors = {
          '良好': 'bg-green-100 text-green-800',
          '平稳': 'bg-blue-100 text-blue-800',
          '低落': 'bg-yellow-100 text-yellow-800',
          '焦虑': 'bg-orange-100 text-orange-800',
          '烦躁': 'bg-red-100 text-red-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${moodColors[record.moodStatus] || 'bg-gray-100'}`}>
            {record.moodStatus}
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
          onClick={() => handleViewRecord(record)}
        >
          详情
        </Button>
      )
    }
  ];

  // 渲染添加健康记录模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加健康记录"
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
            label="日期"
            name="date"
            type="date"
            value={new Date().toISOString().split('T')[0]}
            required
          />
          <FormField
            label="收缩压(mmHg)"
            name="bloodPressureHigh"
            type="number"
            placeholder="收缩压"
            min="60"
            max="220"
            required
          />
          <FormField
            label="舒张压(mmHg)"
            name="bloodPressureLow"
            type="number"
            placeholder="舒张压"
            min="40"
            max="140"
            required
          />
          <FormField
            label="心率(bpm)"
            name="heartRate"
            type="number"
            placeholder="心率"
            min="40"
            max="180"
            required
          />
          <FormField
            label="体温(°C)"
            name="temperature"
            type="number"
            placeholder="体温"
            min="35"
            max="42"
            step="0.1"
            required
          />
          <FormField
            label="血糖(mmol/L)"
            name="bloodSugar"
            type="number"
            placeholder="血糖"
            min="2"
            max="30"
            step="0.1"
          />
          <FormField
            label="体重(kg)"
            name="weight"
            type="number"
            placeholder="体重"
            min="30"
            max="150"
            step="0.1"
          />
          <FormField
            label="睡眠时间(小时)"
            name="sleepHours"
            type="number"
            placeholder="睡眠时间"
            min="0"
            max="24"
          />
          <FormField
            label="情绪状态"
            name="moodStatus"
            type="select"
            options={[
              { value: '良好', label: '良好' },
              { value: '平稳', label: '平稳' },
              { value: '低落', label: '低落' },
              { value: '焦虑', label: '焦虑' },
              { value: '烦躁', label: '烦躁' }
            ]}
          />
          <FormField
            label="疼痛等级(0-5)"
            name="painLevel"
            type="select"
            options={[
              { value: '0', label: '0 - 无痛' },
              { value: '1', label: '1 - 轻微疼痛' },
              { value: '2', label: '2 - 不适但可忍受' },
              { value: '3', label: '3 - 痛苦，影响注意力' },
              { value: '4', label: '4 - 严重疼痛' },
              { value: '5', label: '5 - 极度疼痛' }
            ]}
          />
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

  // 渲染健康记录详情模态框
  const renderDetailModal = () => {
    if (!selectedHealthRecord) return null;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="健康记录详情"
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
              icon={<AiOutlineDownload size={16} />}
            >
              导出记录
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mr-3">
              <AiOutlineUser size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{selectedHealthRecord.elderlyName}</h3>
              <p className="text-gray-600">
                记录日期: {selectedHealthRecord.date}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-blue-700 font-medium mb-2">血压监测</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">收缩压/舒张压</p>
                  <p className="text-2xl font-bold">
                    {selectedHealthRecord.bloodPressureHigh}/{selectedHealthRecord.bloodPressureLow}
                    <span className="text-sm font-normal ml-1">mmHg</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600">
                  <AiOutlineHeart size={24} />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm">
                  {selectedHealthRecord.bloodPressureHigh > 140 || selectedHealthRecord.bloodPressureLow > 90
                    ? '⚠️ 高于正常值'
                    : selectedHealthRecord.bloodPressureHigh < 90 || selectedHealthRecord.bloodPressureLow < 60
                    ? '⚠️ 低于正常值'
                    : '✓ 正常范围内'}
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-green-700 font-medium mb-2">心率</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">心跳次数/分钟</p>
                  <p className="text-2xl font-bold">
                    {selectedHealthRecord.heartRate}
                    <span className="text-sm font-normal ml-1">bpm</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600">
                  <AiOutlineHeart size={24} />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm">
                  {selectedHealthRecord.heartRate > 100
                    ? '⚠️ 心率偏快'
                    : selectedHealthRecord.heartRate < 60
                    ? '⚠️ 心率偏慢'
                    : '✓ 正常范围内'}
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="text-red-700 font-medium mb-2">体温</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">体温</p>
                  <p className="text-2xl font-bold">
                    {selectedHealthRecord.temperature}
                    <span className="text-sm font-normal ml-1">°C</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm">
                  {selectedHealthRecord.temperature > 37.3
                    ? '⚠️ 体温偏高'
                    : selectedHealthRecord.temperature < 36
                    ? '⚠️ 体温偏低'
                    : '✓ 正常范围内'}
                </p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-purple-700 font-medium mb-2">血糖</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">血糖值</p>
                  <p className="text-2xl font-bold">
                    {selectedHealthRecord.bloodSugar}
                    <span className="text-sm font-normal ml-1">mmol/L</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm">
                  {parseFloat(selectedHealthRecord.bloodSugar) > 11.1
                    ? '⚠️ 血糖偏高'
                    : parseFloat(selectedHealthRecord.bloodSugar) < 3.9
                    ? '⚠️ 血糖偏低'
                    : '✓ 正常范围内'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="border p-3 rounded-md">
              <p className="text-sm text-gray-500">体重</p>
              <p className="text-lg font-medium">{selectedHealthRecord.weight} kg</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="text-sm text-gray-500">睡眠时间</p>
              <p className="text-lg font-medium">{selectedHealthRecord.sleepHours} 小时</p>
            </div>
            <div className="border p-3 rounded-md">
              <p className="text-sm text-gray-500">疼痛等级</p>
              <p className="text-lg font-medium">{selectedHealthRecord.painLevel}/5</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">情绪状态</h4>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">{selectedHealthRecord.moodStatus}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">用药记录</h4>
            <div className="bg-gray-100 p-3 rounded-md">
              {selectedHealthRecord.medications.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedHealthRecord.medications.map((med, index) => (
                    <li key={index}>{med}</li>
                  ))}
                </ul>
              ) : (
                <p>无用药记录</p>
              )}
            </div>
          </div>
          
          {selectedHealthRecord.notes && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">备注</h4>
              <div className="bg-gray-100 p-3 rounded-md">
                <p>{selectedHealthRecord.notes}</p>
              </div>
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
        title="筛选健康记录"
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
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="血压下限"
              name="bloodPressureMin"
              type="number"
              placeholder="最低收缩压"
              value={filterParams.bloodPressureMin}
              onChange={(e) => setFilterParams(prev => ({ ...prev, bloodPressureMin: e.target.value }))}
            />
            <FormField
              label="血压上限"
              name="bloodPressureMax"
              type="number"
              placeholder="最高收缩压"
              value={filterParams.bloodPressureMax}
              onChange={(e) => setFilterParams(prev => ({ ...prev, bloodPressureMax: e.target.value }))}
            />
          </div>
          
          <div className="flex items-center mt-4">
            <input
              id="abnormalOnly"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              checked={filterParams.abnormalOnly}
              onChange={(e) => setFilterParams(prev => ({ ...prev, abnormalOnly: e.target.checked }))}
            />
            <label htmlFor="abnormalOnly" className="ml-2 block text-sm text-gray-700">
              仅显示异常数据
            </label>
          </div>
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
          <h1 className="text-2xl font-bold text-gray-800">健康监测管理</h1>
          <p className="text-gray-600 mt-1">
            {selectedElderly ? `${selectedElderly.name}的健康监测记录` : '管理所有老人的健康监测数据'}
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
            onClick={handleAddRecord}
          >
            添加记录
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

      <Card className="mb-6">
        <div className="mb-4">
          <Tabs
            tabs={[
              { key: 'all', label: '全部记录', content: null },
              { key: 'today', label: '今日数据', content: null },
              { key: 'week', label: '本周数据', content: null },
            ]}
            defaultActiveKey="all"
            onChange={(key) => setActiveTab(key)}
          />
        </div>

        <Table
          columns={columns}
          data={filteredData}
          emptyMessage="暂无健康监测数据"
        />
      </Card>

      {renderAddModal()}
      {renderDetailModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}