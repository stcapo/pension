'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineRight } from 'react-icons/ai';
import UserLayout from '../../../components/layout/UserLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'daily', name: '日常照护' },
    { id: 'health', name: '健康管理' },
    { id: 'rehab', name: '康复护理' },
    { id: 'mental', name: '心理关怀' },
    { id: 'social', name: '社交活动' },
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockServices = [
        {
          id: 1,
          title: '日常生活照料',
          category: 'daily',
          description: '提供起居照料、个人卫生、饮食照料等日常生活服务，帮助老年人维持日常生活自理能力。',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          price: '¥50-200/次',
          duration: '1-2小时/次',
          rating: 4.8,
        },
        {
          id: 2,
          title: '健康评估',
          category: 'health',
          description: '由专业医护人员提供全面的健康评估服务，包括基础体检、慢病风险评估等。',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          price: '¥200-500/次',
          duration: '1小时/次',
          rating: 4.9,
        },
        {
          id: 3,
          title: '康复训练',
          category: 'rehab',
          description: '针对老年人身体功能障碍提供专业的康复训练，帮助恢复和提高身体功能。',
          image: 'https://img0.baidu.com/it/u=3043029503,2118642389&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
          price: '¥150-300/次',
          duration: '45分钟/次',
          rating: 4.7,
        },
        {
          id: 4,
          title: '心理疏导',
          category: 'mental',
          description: '由专业心理咨询师提供心理疏导服务，帮助老年人缓解心理压力，保持积极心态。',
          image: 'https://img1.baidu.com/it/u=3144862399,2379192810&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
          price: '¥200-400/次',
          duration: '1小时/次',
          rating: 4.8,
        },
        {
          id: 5,
          title: '用药指导',
          category: 'health',
          description: '由专业药师提供用药咨询和指导，确保老年人安全合理用药。',
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          price: '¥100-200/次',
          duration: '30分钟/次',
          rating: 4.6,
        },
        {
          id: 6,
          title: '社交活动组织',
          category: 'social',
          description: '组织各类适合老年人的社交活动，丰富老年人的精神文化生活，促进社交互动。',
          image: 'https://img0.baidu.com/it/u=3814547698,3074858476&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500',
          price: '¥50-150/次',
          duration: '2-3小时/次',
          rating: 4.9,
        },
        {
          id: 7,
          title: '陪同就医',
          category: 'health',
          description: '提供专业陪同就医服务，包括预约挂号、陪同就诊、取药等全流程服务。',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          price: '¥200-400/次',
          duration: '3-4小时/次',
          rating: 4.8,
        },
        {
          id: 8,
          title: '居家环境改造',
          category: 'daily',
          description: '根据老年人的需求和身体状况，提供专业的居家环境改造建议和服务，提高居家安全性。',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          price: '¥500-2000/次',
          duration: '根据实际需求',
          rating: 4.7,
        },
      ];
      
      setServices(mockServices);
      setFilteredServices(mockServices);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    // Filter services based on search term and category
    let results = services;
    
    if (searchTerm) {
      results = results.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      results = results.filter(service => service.category === selectedCategory);
    }
    
    setFilteredServices(results);
  }, [searchTerm, selectedCategory, services]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">养老服务</h1>
        <p className="text-gray-600 mt-2">
          浏览我们提供的各类养老服务，根据您的需求选择合适的服务
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-grow mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="搜索服务..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <AiOutlineFilter className="text-gray-500 mr-2" />
              <span className="text-gray-700 mr-2">分类:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse h-80"></div>
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Link key={service.id} href={`/user/services/${service.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative h-48 mb-4 -mx-4 -mt-4 rounded-t-lg overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {service.price}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-1">{service.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{service.duration}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">没有找到符合条件的服务，请尝试其他搜索条件。</p>
        </div>
      )}
    </UserLayout>
  );
}
