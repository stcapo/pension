'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AiOutlineHeart, 
  AiOutlineSchedule, 
  AiOutlineMessage, 
  AiOutlineQuestionCircle,
  AiOutlineUser,
  AiOutlineRight
} from 'react-icons/ai';
import UserLayout from '../../components/layout/UserLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function UserHomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setServices([
        {
          id: 1,
          title: '日常照护',
          description: '提供日常生活照料，包括起居照料、个人卫生、饮食照料等服务',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        },
        {
          id: 2,
          title: '健康管理',
          description: '提供健康评估、健康监测、用药指导、慢病管理等服务',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        },
        {
          id: 3,
          title: '康复护理',
          description: '提供康复评估、康复训练、功能锻炼等服务',
          image: 'https://img0.baidu.com/it/u=122252862,290432990&fm=253&fmt=auto&app=120&f=JPEG?w=752&h=500',
        },
        {
          id: 4,
          title: '心理关怀',
          description: '提供心理评估、心理疏导、情绪支持等服务',
          image: 'https://img2.baidu.com/it/u=1402469768,187864863&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <UserLayout>
      {/* Hero Section */}
      <div className="relative bg-primary rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90"></div>
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                智慧养老服务平台
              </h1>
              <p className="mt-3 text-lg text-blue-100">
                为老年人及其家属提供全方位的养老服务，让晚年生活更加健康、舒适、有尊严。
              </p>
              <div className="mt-6">
                <Link href="/user/services">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="font-medium"
                  >
                    浏览服务
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="老年人生活" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">快速导航</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/user/health">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="bg-red-100 p-3 rounded-full">
                <AiOutlineHeart size={24} className="text-red-600" />
              </div>
              <span className="mt-2 text-gray-800 font-medium">健康管理</span>
            </div>
          </Link>
          <Link href="/user/services">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full">
                <AiOutlineSchedule size={24} className="text-blue-600" />
              </div>
              <span className="mt-2 text-gray-800 font-medium">养老服务</span>
            </div>
          </Link>
          <Link href="/user/family-chat">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="bg-green-100 p-3 rounded-full">
                <AiOutlineMessage size={24} className="text-green-600" />
              </div>
              <span className="mt-2 text-gray-800 font-medium">家人互动</span>
            </div>
          </Link>
          <Link href="/user/profile">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 p-3 rounded-full">
                <AiOutlineUser size={24} className="text-purple-600" />
              </div>
              <span className="mt-2 text-gray-800 font-medium">个人中心</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Services */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">特色服务</h2>
          <Link href="/user/services">
            <span className="text-primary flex items-center hover:underline">
              查看全部 <AiOutlineRight className="ml-1" />
            </span>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                  <Link href={`/user/services/${service.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 w-full"
                    >
                      了解详情
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">用户评价</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-100">
            <div className="flex flex-col h-full">
              <p className="text-gray-600 italic">"智慧养老平台的服务非常贴心，让我的父母在家也能享受到专业的照护，我们全家都很放心。"</p>
              <div className="mt-4 flex items-center">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-gray-700 font-medium">张</span>
                </div>
                <div className="ml-3">
                  <p className="text-gray-800 font-medium">张女士</p>
                  <p className="text-gray-500 text-sm">老人家属</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="border border-gray-100">
            <div className="flex flex-col h-full">
              <p className="text-gray-600 italic">"平台上的健康管理功能很实用，可以随时查看我的健康数据，医生也能及时给我建议。"</p>
              <div className="mt-4 flex items-center">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-gray-700 font-medium">李</span>
                </div>
                <div className="ml-3">
                  <p className="text-gray-800 font-medium">李爷爷</p>
                  <p className="text-gray-500 text-sm">平台用户</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="border border-gray-100">
            <div className="flex flex-col h-full">
              <p className="text-gray-600 italic">"通过平台可以和子女随时交流，分享我的日常生活，让我不再感到孤单，非常感谢这个平台。"</p>
              <div className="mt-4 flex items-center">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-gray-700 font-medium">王</span>
                </div>
                <div className="ml-3">
                  <p className="text-gray-800 font-medium">王奶奶</p>
                  <p className="text-gray-500 text-sm">平台用户</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}
