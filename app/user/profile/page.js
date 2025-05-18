'use client';

import { useState, useEffect } from 'react';
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineLock,
  AiOutlineIdcard,
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineEdit,
  AiOutlineUpload,
  AiOutlineHeart,
  AiOutlineSchedule,
  AiOutlineMessage
} from 'react-icons/ai';
import UserLayout from '../../../components/layout/UserLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import FormField from '../../../components/ui/FormField';
import Modal from '../../../components/ui/Modal';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      const mockUserData = {
        basic: {
          name: '张爷爷',
          gender: '男',
          birthDate: '1945-05-15',
          age: 78,
          idCard: '110101194505153456',
          phone: '13812345678',
          email: 'zhang@example.com',
          address: '北京市朝阳区健康路123号',
          emergencyContact: {
            name: '张小明',
            relationship: '儿子',
            phone: '13987654321',
          },
        },
        health: {
          height: 172,
          weight: 68,
          bloodType: 'A型',
          allergies: ['青霉素', '海鲜'],
          chronicDiseases: ['高血压', '糖尿病'],
          medications: [
            { name: '降压药', dosage: '5mg', frequency: '每日一次' },
            { name: '降糖药', dosage: '10mg', frequency: '每日两次' },
          ],
        },
        activities: [
          { id: 1, type: '健康检查', date: '2025-11-10', status: 'upcoming' },
          { id: 2, type: '太极拳课程', date: '2025-11-15', status: 'upcoming' },
          { id: 3, type: '营养咨询', date: '2025-10-25', status: 'completed' },
        ],
      };

      setUserData(mockUserData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditClick = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    // Simulate saving data
    setTimeout(() => {
      setEditSuccess(true);

      // Update user data
      setUserData(prev => {
        const newData = { ...prev };

        // Handle nested fields
        if (editField.includes('.')) {
          const [section, field] = editField.split('.');
          if (section === 'emergencyContact') {
            newData.basic.emergencyContact[field] = editValue;
          }
        } else {
          newData.basic[editField] = editValue;
        }

        return newData;
      });

      // Reset form after success
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess(false);
        setEditField('');
        setEditValue('');
      }, 2000);
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('新密码和确认密码不一致');
      return;
    }

    // Simulate password change
    setTimeout(() => {
      setPasswordSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }, 2000);
    }, 1000);
  };

  const renderBasicInfoTab = () => {
    if (!userData) return null;

    return (
      <div>
        <Card>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://img0.baidu.com/it/u=3181891204,123474442&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md">
                  <AiOutlineUpload size={16} />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-4">{userData.basic.name}</h2>
              <p className="text-gray-600">{userData.basic.age}岁</p>
            </div>

            <div className="md:w-2/3 md:pl-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">基本信息</h3>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlineUser className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">姓名</p>
                      <p className="text-gray-800">{userData.basic.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<AiOutlineEdit size={14} />}
                    onClick={() => handleEditClick('name', userData.basic.name)}
                  >
                    编辑
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlineIdcard className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">身份证号</p>
                      <p className="text-gray-800">{userData.basic.idCard}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlineCalendar className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">出生日期</p>
                      <p className="text-gray-800">{userData.basic.birthDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlinePhone className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">手机号码</p>
                      <p className="text-gray-800">{userData.basic.phone}</p>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<AiOutlineEdit size={14} />}
                    onClick={() => handleEditClick('phone', userData.basic.phone)}
                  >
                    编辑
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlineMail className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">电子邮箱</p>
                      <p className="text-gray-800">{userData.basic.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<AiOutlineEdit size={14} />}
                    onClick={() => handleEditClick('email', userData.basic.email)}
                  >
                    编辑
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlineHome className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">家庭住址</p>
                      <p className="text-gray-800">{userData.basic.address}</p>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<AiOutlineEdit size={14} />}
                    onClick={() => handleEditClick('address', userData.basic.address)}
                  >
                    编辑
                  </Button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">紧急联系人</h3>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlineUser className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">姓名</p>
                      <p className="text-gray-800">{userData.basic.emergencyContact.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<AiOutlineEdit size={14} />}
                    onClick={() => handleEditClick('emergencyContact.name', userData.basic.emergencyContact.name)}
                  >
                    编辑
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlineUser className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">关系</p>
                      <p className="text-gray-800">{userData.basic.emergencyContact.relationship}</p>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<AiOutlineEdit size={14} />}
                    onClick={() => handleEditClick('emergencyContact.relationship', userData.basic.emergencyContact.relationship)}
                  >
                    编辑
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b">
                  <div className="flex items-center">
                    <AiOutlinePhone className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">联系电话</p>
                      <p className="text-gray-800">{userData.basic.emergencyContact.phone}</p>
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="sm"
                    icon={<AiOutlineEdit size={14} />}
                    onClick={() => handleEditClick('emergencyContact.phone', userData.basic.emergencyContact.phone)}
                  >
                    编辑
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  icon={<AiOutlineLock size={16} />}
                  onClick={() => setShowPasswordModal(true)}
                >
                  修改密码
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderHealthInfoTab = () => {
    if (!userData) return null;

    return (
      <div>
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">健康信息</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b">
                  <div>
                    <p className="text-sm text-gray-500">身高</p>
                    <p className="text-gray-800">{userData.health.height} cm</p>
                  </div>
                </div>

                <div className="flex justify-between pb-3 border-b">
                  <div>
                    <p className="text-sm text-gray-500">体重</p>
                    <p className="text-gray-800">{userData.health.weight} kg</p>
                  </div>
                </div>

                <div className="flex justify-between pb-3 border-b">
                  <div>
                    <p className="text-sm text-gray-500">血型</p>
                    <p className="text-gray-800">{userData.health.bloodType}</p>
                  </div>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-500 mb-1">过敏史</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.health.allergies.map((allergy, index) => (
                      <span key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-500 mb-1">慢性病</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.health.chronicDiseases.map((disease, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        {disease}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-3">当前用药</p>
              <div className="space-y-3">
                {userData.health.medications.map((medication, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-800">{medication.name}</p>
                    <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-gray-600">
                      <span>剂量: {medication.dosage}</span>
                      <span>频率: {medication.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              icon={<AiOutlineHeart size={16} />}
              onClick={() => window.location.href = '/user/health'}
            >
              查看健康管理
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const renderActivitiesTab = () => {
    if (!userData) return null;

    return (
      <div>
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">近期活动</h3>

          <div className="space-y-4">
            {userData.activities.map((activity) => (
              <div key={activity.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      activity.type.includes('健康') ? 'bg-green-100' :
                      activity.type.includes('太极') ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {activity.type.includes('健康') && <AiOutlineHeart className="text-green-600" size={20} />}
                      {activity.type.includes('太极') && <AiOutlineSchedule className="text-blue-600" size={20} />}
                      {activity.type.includes('营养') && <AiOutlineMessage className="text-purple-600" size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <div>
                    {activity.status === 'upcoming' && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        即将到来
                      </span>
                    )}
                    {activity.status === 'completed' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        已完成
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              icon={<AiOutlineSchedule size={16} />}
              onClick={() => window.location.href = '/user/appointments'}
            >
              查看所有预约
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">个人中心</h1>
        <p className="text-gray-600 mt-2">
          管理您的个人信息和账号设置
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-2">
        <div className="flex">
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
              activeTab === 'basic'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            <AiOutlineUser className="inline mr-1" />
            基本信息
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
              activeTab === 'health'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('health')}
          >
            <AiOutlineHeart className="inline mr-1" />
            健康信息
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
              activeTab === 'activities'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('activities')}
          >
            <AiOutlineSchedule className="inline mr-1" />
            近期活动
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm h-96 animate-pulse"></div>
      ) : (
        <>
          {activeTab === 'basic' && renderBasicInfoTab()}
          {activeTab === 'health' && renderHealthInfoTab()}
          {activeTab === 'activities' && renderActivitiesTab()}
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => !editSuccess && setShowEditModal(false)}
        title={`编辑${
          editField === 'name' ? '姓名' :
          editField === 'phone' ? '手机号码' :
          editField === 'email' ? '电子邮箱' :
          editField === 'address' ? '家庭住址' :
          editField === 'emergencyContact.name' ? '紧急联系人姓名' :
          editField === 'emergencyContact.relationship' ? '紧急联系人关系' :
          editField === 'emergencyContact.phone' ? '紧急联系人电话' :
          ''
        }`}
        size="sm"
      >
        {editSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">修改成功</h3>
            <p className="mt-1 text-sm text-gray-500">
              您的信息已成功更新。
            </p>
          </div>
        ) : (
          <div>
            <FormField
              type={
                editField === 'phone' || editField === 'emergencyContact.phone' ? 'tel' :
                editField === 'email' ? 'email' :
                'text'
              }
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              required
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setShowEditModal(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleEditSubmit}
              >
                保存
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => !passwordSuccess && setShowPasswordModal(false)}
        title="修改密码"
        size="md"
      >
        {passwordSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">密码修改成功</h3>
            <p className="mt-1 text-sm text-gray-500">
              您的密码已成功更新，请使用新密码登录。
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <FormField
              label="当前密码"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <FormField
              label="新密码"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <FormField
              label="确认新密码"
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              error={passwordError}
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setShowPasswordModal(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                确认修改
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </UserLayout>
  );
}
