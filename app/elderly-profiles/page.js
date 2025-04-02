'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineUserAdd, AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlineEye, AiOutlineHeart, AiOutlineMedicineBox } from 'react-icons/ai';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import { getElderlyProfiles } from '../../utils/data-utils';

export default function ElderlyProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('全部');
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getElderlyProfiles();
        setProfiles(data);
        setFilteredProfiles(data);
      } catch (error) {
        console.error('Failed to fetch elderly profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // 处理搜索
  useEffect(() => {
    let result = [...profiles];
    
    // 应用搜索过滤
    if (searchTerm) {
      result = result.filter((profile) => 
        profile.name.includes(searchTerm) || 
        profile.idCard.includes(searchTerm) ||
        profile.roomNumber.includes(searchTerm)
      );
    }
    
    // 应用状态过滤
    if (filterStatus !== '全部') {
      result = result.filter((profile) => profile.healthStatus === filterStatus);
    }
    
    setFilteredProfiles(result);
  }, [searchTerm, profiles, filterStatus]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setIsDetailModalOpen(true);
  };

  const handleViewHealthData = (id) => {
    router.push(`/health-monitoring?elderlyId=${id}`);
  };

  const handleViewMedications = (id) => {
    router.push(`/medication-management?elderlyId=${id}`);
  };

  const handleAddProfile = () => {
    setIsAddModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProfile(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // 表格列定义
  const columns = [
    { title: 'ID', dataIndex: 'id', width: '60px' },
    { title: '姓名', dataIndex: 'name', width: '100px' },
    { title: '性别', dataIndex: 'gender', width: '60px' },
    { title: '年龄', dataIndex: 'age', width: '60px' },
    { title: '房间号', dataIndex: 'roomNumber', width: '80px' },
    { 
      title: '健康状态', 
      dataIndex: 'healthStatus',
      width: '100px',
      render: (record) => {
        const statusColor = {
          '良好': 'bg-green-100 text-green-800',
          '稳定': 'bg-blue-100 text-blue-800',
          '需关注': 'bg-yellow-100 text-yellow-800',
          '需治疗': 'bg-red-100 text-red-800',
          '恢复中': 'bg-purple-100 text-purple-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColor[record.healthStatus] || 'bg-gray-100'}`}>
            {record.healthStatus}
          </span>
        );
      }
    },
    { 
      title: '入住日期', 
      dataIndex: 'entryDate',
      width: '100px'
    },
    {
      title: '操作',
      width: '220px',
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            icon={<AiOutlineEye size={16} />}
            onClick={() => handleViewProfile(record)}
          >
            详情
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<AiOutlineHeart size={16} />}
            onClick={() => handleViewHealthData(record.id)}
          >
            健康
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<AiOutlineMedicineBox size={16} />}
            onClick={() => handleViewMedications(record.id)}
          >
            用药
          </Button>
        </div>
      )
    }
  ];

  // 渲染健康状态过滤器
  const renderStatusFilter = () => {
    const statuses = ['全部', '良好', '稳定', '需关注', '需治疗', '恢复中'];
    
    return (
      <div className="flex space-x-2">
        {statuses.map((status) => (
          <button
            key={status}
            className={`px-3 py-1 text-sm rounded-md ${
              filterStatus === status 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>
    );
  };

  // 渲染详情模态框
  const renderDetailModal = () => {
    if (!selectedProfile) return null;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        title="老人档案详情"
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={closeDetailModal}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          <div className="mb-4 col-span-2">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-gray-600">{selectedProfile.name.substring(0, 1)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
                <p className="text-gray-600">
                  ID: {selectedProfile.id} | 房间号: {selectedProfile.roomNumber}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">性别</p>
            <p className="font-medium">{selectedProfile.gender}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">年龄</p>
            <p className="font-medium">{selectedProfile.age}岁</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">出生日期</p>
            <p className="font-medium">{selectedProfile.birthDate}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">身份证号</p>
            <p className="font-medium">{selectedProfile.idCard}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">联系电话</p>
            <p className="font-medium">{selectedProfile.phone}</p>
          </div>
          
          <div className="mb-3 col-span-2">
            <p className="text-sm text-gray-500">地址</p>
            <p className="font-medium">{selectedProfile.address}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">血型</p>
            <p className="font-medium">{selectedProfile.bloodType}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">入住日期</p>
            <p className="font-medium">{selectedProfile.entryDate}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">健康状态</p>
            <p className="font-medium">{selectedProfile.healthStatus}</p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500">护理级别</p>
            <p className="font-medium">{selectedProfile.careLevel}级</p>
          </div>
          
          <div className="mb-3 col-span-2">
            <p className="text-sm text-gray-500">慢性病</p>
            <p className="font-medium">
              {selectedProfile.chronicDiseases.length > 0 
                ? selectedProfile.chronicDiseases.join('、') 
                : '无'
              }
            </p>
          </div>
          
          <div className="mb-3 col-span-2">
            <p className="text-sm text-gray-500">饮食限制</p>
            <p className="font-medium">
              {selectedProfile.dietaryRestrictions.length > 0 
                ? selectedProfile.dietaryRestrictions.join('、') 
                : '无特殊限制'
              }
            </p>
          </div>
          
          <div className="mb-3 col-span-2">
            <p className="text-sm text-gray-500">用药情况</p>
            <p className="font-medium">
              {selectedProfile.medications.length > 0 
                ? selectedProfile.medications.join('、') 
                : '无'
              }
            </p>
          </div>
          
          <div className="mb-3 col-span-2">
            <p className="text-sm text-gray-500">紧急联系人</p>
            <p className="font-medium">
              {selectedProfile.emergencyContact.name} 
              ({selectedProfile.emergencyContact.relationship})
              {' '}
              {selectedProfile.emergencyContact.phone}
            </p>
          </div>
          
          <div className="mb-3 col-span-2">
            <p className="text-sm text-gray-500">备注</p>
            <p className="font-medium">{selectedProfile.notes}</p>
          </div>
        </div>
      </Modal>
    );
  };

  // 渲染添加老人模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="添加老人档案"
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={closeAddModal}
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
            label="出生日期"
            name="birthDate"
            type="date"
            required
          />
          <FormField
            label="身份证号"
            name="idCard"
            placeholder="请输入身份证号"
            required
          />
          <FormField
            label="联系电话"
            name="phone"
            placeholder="请输入联系电话"
          />
          <FormField
            label="血型"
            name="bloodType"
            type="select"
            options={[
              { value: 'A型', label: 'A型' },
              { value: 'B型', label: 'B型' },
              { value: 'AB型', label: 'AB型' },
              { value: 'O型', label: 'O型' }
            ]}
          />
          <div className="col-span-2">
            <FormField
              label="地址"
              name="address"
              placeholder="请输入地址"
            />
          </div>
          <FormField
            label="房间号"
            name="roomNumber"
            placeholder="请输入房间号"
            required
          />
          <FormField
            label="护理级别"
            name="careLevel"
            type="select"
            options={[
              { value: '1', label: '1级 (基础照护)' },
              { value: '2', label: '2级 (轻度照护)' },
              { value: '3', label: '3级 (中度照护)' },
              { value: '4', label: '4级 (重度照护)' },
              { value: '5', label: '5级 (特重度照护)' }
            ]}
            required
          />
          <FormField
            label="健康状态"
            name="healthStatus"
            type="select"
            options={[
              { value: '良好', label: '良好' },
              { value: '稳定', label: '稳定' },
              { value: '需关注', label: '需关注' },
              { value: '需治疗', label: '需治疗' },
              { value: '恢复中', label: '恢复中' }
            ]}
            required
          />
          <FormField
            label="入住日期"
            name="entryDate"
            type="date"
            required
          />
          <div className="col-span-2">
            <FormField
              label="慢性病"
              name="chronicDiseases"
              type="checkbox"
              options={[
                { value: '高血压', label: '高血压' },
                { value: '糖尿病', label: '糖尿病' },
                { value: '冠心病', label: '冠心病' },
                { value: '关节炎', label: '关节炎' },
                { value: '骨质疏松', label: '骨质疏松' },
                { value: '白内障', label: '白内障' },
                { value: '帕金森', label: '帕金森' },
                { value: '老年痴呆', label: '老年痴呆' }
              ]}
            />
          </div>
          <div className="col-span-2">
            <FormField
              label="饮食限制"
              name="dietaryRestrictions"
              type="checkbox"
              options={[
                { value: '低盐饮食', label: '低盐饮食' },
                { value: '糖尿病饮食', label: '糖尿病饮食' },
                { value: '软食', label: '软食' },
                { value: '流质饮食', label: '流质饮食' },
                { value: '高蛋白饮食', label: '高蛋白饮食' },
                { value: '无乳糖饮食', label: '无乳糖饮食' }
              ]}
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
              { value: '子女', label: '子女' },
              { value: '配偶', label: '配偶' },
              { value: '亲戚', label: '亲戚' },
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
          <h1 className="text-2xl font-bold text-gray-800">老人档案管理</h1>
          <p className="text-gray-600 mt-1">管理所有老人的个人信息和档案</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary" 
            icon={<AiOutlineUserAdd size={16} />}
            onClick={handleAddProfile}
          >
            添加老人档案
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex-1 mb-4 md:mb-0 md:mr-4">
            <div className="relative">
              <input
                type="text"
                className="input-field pl-10"
                placeholder="搜索姓名、身份证号、房间号..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AiOutlineSearch className="text-gray-400" size={20} />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            {renderStatusFilter()}
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredProfiles}
          emptyMessage="暂无老人档案数据"
        />
      </Card>

      {renderDetailModal()}
      {renderAddModal()}
    </MainLayout>
  );
}