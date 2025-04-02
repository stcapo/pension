'use client';

import { useState, useEffect } from 'react';
import { 
  AiOutlinePlus, 
  AiOutlineFilter,
  AiOutlineSearch,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineFileText,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineClockCircle,
  AiOutlineFolder,
  AiOutlineDownload,
  AiOutlineUpload,
  AiOutlineEye,
  AiOutlineFile,
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFilePpt,
  AiOutlineFileImage,
  AiOutlineStar,
  AiOutlineTags,
  AiOutlineLock,
  AiOutlineWarning
} from 'react-icons/ai';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import Alert from '../../components/ui/Alert';
import { getDocuments, formatDate } from '../../utils/data-utils';

// 文档图标组件 - 用于复用
const DocumentIcon = ({ fileFormat }) => {
  const iconMap = {
    'PDF': <AiOutlineFilePdf size={24} className="text-red-500" />,
    'Word': <AiOutlineFileWord size={24} className="text-blue-500" />,
    'Excel': <AiOutlineFileExcel size={24} className="text-green-500" />,
    'PPT': <AiOutlineFilePpt size={24} className="text-orange-500" />,
    'Image': <AiOutlineFileImage size={24} className="text-purple-500" />,
    'default': <AiOutlineFile size={24} className="text-gray-500" />
  };
  
  return iconMap[fileFormat] || iconMap.default;
};

// 文档卡片组件 - 用于复用
const DocumentCard = ({ document, onClick }) => {
  const securityLevelColors = {
    '公开': 'bg-green-100 text-green-800',
    '内部': 'bg-blue-100 text-blue-800',
    '保密': 'bg-yellow-100 text-yellow-800',
    '机密': 'bg-red-100 text-red-800'
  };
  
  const statusColors = {
    '已审批': 'bg-green-100 text-green-800',
    '待审批': 'bg-yellow-100 text-yellow-800',
    '需修订': 'bg-orange-100 text-orange-800',
    '已归档': 'bg-blue-100 text-blue-800',
    '已过期': 'bg-gray-100 text-gray-800'
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="mr-3">
            <DocumentIcon fileFormat={document.fileFormat} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium truncate" title={document.title}>{document.title}</h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span className="px-2 py-0.5 rounded-full mr-1 bg-blue-100 text-blue-800">
                {document.documentType}
              </span>
              <span className="ml-1">{document.fileFormat}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <AiOutlineUser className="mr-1" />
          <span>作者: {document.author}</span>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <AiOutlineCalendar className="mr-1" />
            <span>创建: {document.creationDate}</span>
          </div>
          <div className="flex items-center">
            <AiOutlineClockCircle className="mr-1" />
            <span>版本: {document.version}</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center">
        <span className={`px-2 py-0.5 rounded-full text-xs ${securityLevelColors[document.securityLevel]}`}>
          {document.securityLevel}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[document.status]}`}>
          {document.status}
        </span>
      </div>
    </div>
  );
};

export default function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    documentType: '',
    securityLevel: '',
    status: '',
    startDate: '',
    endDate: '',
    keyword: ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有文档数据
        const data = await getDocuments();
        setDocuments(data);
        setFilteredDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [documents, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...documents];
    
    // 按文档类型筛选
    if (filterParams.documentType) {
      result = result.filter(doc => doc.documentType === filterParams.documentType);
    }
    
    // 按安全级别筛选
    if (filterParams.securityLevel) {
      result = result.filter(doc => doc.securityLevel === filterParams.securityLevel);
    }
    
    // 按状态筛选
    if (filterParams.status) {
      result = result.filter(doc => doc.status === filterParams.status);
    }
    
    // 按日期范围筛选
    if (filterParams.startDate) {
      result = result.filter(doc => doc.creationDate >= filterParams.startDate);
    }
    
    if (filterParams.endDate) {
      result = result.filter(doc => doc.creationDate <= filterParams.endDate);
    }
    
    // 按关键字搜索
    if (filterParams.keyword) {
      const keyword = filterParams.keyword.toLowerCase();
      result = result.filter(doc => 
        doc.title.toLowerCase().includes(keyword) ||
        doc.author.toLowerCase().includes(keyword) ||
        doc.keywords.toLowerCase().includes(keyword) ||
        doc.description.toLowerCase().includes(keyword)
      );
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'regulations') {
      result = result.filter(doc => doc.documentType === '规章制度');
    } else if (activeTab === 'medical') {
      result = result.filter(doc => doc.documentType === '医疗记录');
    } else if (activeTab === 'contracts') {
      result = result.filter(doc => doc.documentType === '合同协议');
    } else if (activeTab === 'pending') {
      result = result.filter(doc => doc.status === '待审批');
    }
    
    // 按类型和标题排序
    result.sort((a, b) => {
      if (a.documentType !== b.documentType) {
        return a.documentType.localeCompare(b.documentType);
      }
      return a.title.localeCompare(b.title);
    });
    
    setFilteredDocuments(result);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsDetailModalOpen(true);
  };

  const handleAddDocument = () => {
    setIsAddModalOpen(true);
  };

  const handleUploadDocument = () => {
    setIsUploadModalOpen(true);
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
      documentType: '',
      securityLevel: '',
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
  const getDocumentTypeOptions = () => {
    const types = [...new Set(documents.map(doc => doc.documentType))];
    return [
      { value: '', label: '全部类型' },
      ...types.map(type => ({ value: type, label: type }))
    ];
  };

  const getSecurityLevelOptions = () => {
    return [
      { value: '', label: '全部级别' },
      { value: '公开', label: '公开' },
      { value: '内部', label: '内部' },
      { value: '保密', label: '保密' },
      { value: '机密', label: '机密' }
    ];
  };

  const getStatusOptions = () => {
    return [
      { value: '', label: '全部状态' },
      { value: '已审批', label: '已审批' },
      { value: '待审批', label: '待审批' },
      { value: '需修订', label: '需修订' },
      { value: '已归档', label: '已归档' },
      { value: '已过期', label: '已过期' }
    ];
  };

  const getFileFormatOptions = () => {
    return [
      { value: 'PDF', label: 'PDF' },
      { value: 'Word', label: 'Word' },
      { value: 'Excel', label: 'Excel' },
      { value: 'PPT', label: 'PowerPoint' },
      { value: 'Image', label: '图片' }
    ];
  };

  // 获取统计数据
  const getDocumentsCountByType = (type) => {
    return documents.filter(doc => doc.documentType === type).length;
  };

  const getRecentDocuments = (count = 5) => {
    return [...documents]
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, count);
  };

  const getExpiredDocuments = () => {
    const today = new Date();
    return documents.filter(doc => 
      doc.expiryDate && new Date(doc.expiryDate) < today
    );
  };

  // 表格列定义
  const columns = [
    { 
      title: '文档名称/类型', 
      width: '250px',
      render: (record) => (
        <div className="flex items-center">
          <div className="mr-3">
            <DocumentIcon fileFormat={record.fileFormat} />
          </div>
          <div>
            <div className="font-medium">{record.title}</div>
            <div className="flex items-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {record.documentType}
              </span>
              <span className="text-xs text-gray-500 ml-2">{record.fileFormat}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      title: '作者/日期', 
      width: '150px',
      render: (record) => (
        <div>
          <div className="flex items-center text-sm">
            <AiOutlineUser className="text-gray-500 mr-1" />
            <span>{record.author}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <AiOutlineCalendar className="mr-1" />
            <span>{record.creationDate}</span>
          </div>
        </div>
      )
    },
    { 
      title: '版本/更新日期', 
      width: '150px',
      render: (record) => (
        <div>
          <div className="text-sm">版本 {record.version}</div>
          <div className="text-xs text-gray-500">更新: {record.lastUpdated}</div>
        </div>
      )
    },
    { 
      title: '安全级别', 
      dataIndex: 'securityLevel',
      width: '100px',
      render: (record) => {
        const securityLevelColors = {
          '公开': 'bg-green-100 text-green-800',
          '内部': 'bg-blue-100 text-blue-800',
          '保密': 'bg-yellow-100 text-yellow-800',
          '机密': 'bg-red-100 text-red-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${securityLevelColors[record.securityLevel]}`}>
            {record.securityLevel}
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
          '已审批': 'bg-green-100 text-green-800',
          '待审批': 'bg-yellow-100 text-yellow-800',
          '需修订': 'bg-orange-100 text-orange-800',
          '已归档': 'bg-blue-100 text-blue-800',
          '已过期': 'bg-gray-100 text-gray-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[record.status]}`}>
            {record.status}
          </span>
        );
      }
    },
    { 
      title: '有效期', 
      dataIndex: 'expiryDate',
      width: '100px',
      render: (record) => {
        const isExpired = record.expiryDate && new Date(record.expiryDate) < new Date();
        
        return (
          <div className={isExpired ? 'text-red-600' : ''}>
            {record.expiryDate || '无限期'}
            {isExpired && <AiOutlineWarning className="inline-block ml-1" />}
          </div>
        );
      }
    },
    {
      title: '操作',
      width: '150px',
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            icon={<AiOutlineEye size={16} />}
            onClick={() => handleViewDocument(record)}
          >
            查看
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<AiOutlineDownload size={16} />}
          >
            下载
          </Button>
        </div>
      )
    }
  ];

  // 渲染文档详情模态框
  const renderDetailModal = () => {
    if (!selectedDocument) return null;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="文档详情"
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
              variant="outline"
              icon={<AiOutlineDownload size={16} />}
            >
              下载
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
            <div className="mr-4">
              <DocumentIcon fileFormat={selectedDocument.fileFormat} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{selectedDocument.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                  {selectedDocument.documentType}
                </span>
                <span className="text-gray-500">{selectedDocument.fileFormat}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedDocument.securityLevel === '公开' ? 'bg-green-100 text-green-800' : 
                  selectedDocument.securityLevel === '内部' ? 'bg-blue-100 text-blue-800' : 
                  selectedDocument.securityLevel === '保密' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedDocument.securityLevel}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">基本信息</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">作者:</p>
                  <p className="font-medium">{selectedDocument.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">创建日期:</p>
                  <p className="font-medium">{selectedDocument.creationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">最后更新:</p>
                  <p className="font-medium">{selectedDocument.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">版本:</p>
                  <p className="font-medium">{selectedDocument.version}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">状态信息</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">状态:</p>
                  <p className={`font-medium ${
                    selectedDocument.status === '已过期' ? 'text-red-600' : 
                    selectedDocument.status === '待审批' ? 'text-yellow-600' : 
                    selectedDocument.status === '需修订' ? 'text-orange-600' : 
                    'text-gray-800'
                  }`}>
                    {selectedDocument.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">有效期至:</p>
                  <p className="font-medium">
                    {selectedDocument.expiryDate || '无限期'}
                    {selectedDocument.expiryDate && new Date(selectedDocument.expiryDate) < new Date() && (
                      <span className="text-red-600 ml-2">(已过期)</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">存放位置:</p>
                  <p className="font-medium">{selectedDocument.location}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">文档描述</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{selectedDocument.description}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium mb-3">关键词</h4>
            <div className="flex flex-wrap gap-2">
              {selectedDocument.keywords.split('、').map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          {selectedDocument.notes && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">备注</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{selectedDocument.notes}</p>
              </div>
            </div>
          )}
          
          {selectedDocument.status === '待审批' && (
            <Alert
              type="warning"
              title="待审批文档"
              message="此文档正在等待审批，尚未生效。"
              className="mt-4"
            />
          )}
          
          {selectedDocument.securityLevel === '机密' && (
            <Alert
              type="error"
              title="机密文档"
              message="此文档为机密级别，请严格遵守信息安全管理规定。"
              className="mt-4"
            />
          )}
        </div>
      </Modal>
    );
  };

  // 渲染添加文档模态框
  const renderAddModal = () => {
    return (
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加文档"
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
            label="文档标题"
            name="title"
            placeholder="请输入文档标题"
            required
          />
          <FormField
            label="文档类型"
            name="documentType"
            type="select"
            options={getDocumentTypeOptions()}
            required
          />
          <FormField
            label="文件格式"
            name="fileFormat"
            type="select"
            options={getFileFormatOptions()}
            required
          />
          <FormField
            label="作者"
            name="author"
            placeholder="请输入作者姓名"
            required
          />
          <FormField
            label="创建日期"
            name="creationDate"
            type="date"
            value={new Date().toISOString().split('T')[0]}
            required
          />
          <FormField
            label="版本"
            name="version"
            placeholder="例如：1.0"
            required
          />
          <FormField
            label="安全级别"
            name="securityLevel"
            type="select"
            options={[
              { value: '公开', label: '公开' },
              { value: '内部', label: '内部' },
              { value: '保密', label: '保密' },
              { value: '机密', label: '机密' }
            ]}
            required
          />
          <FormField
            label="状态"
            name="status"
            type="select"
            options={[
              { value: '已审批', label: '已审批' },
              { value: '待审批', label: '待审批' },
              { value: '需修订', label: '需修订' },
              { value: '已归档', label: '已归档' }
            ]}
            required
          />
          <FormField
            label="有效期至"
            name="expiryDate"
            type="date"
          />
          <FormField
            label="存放位置"
            name="location"
            placeholder="请输入存放位置"
            required
          />
          <div className="md:col-span-2">
            <FormField
              label="关键词"
              name="keywords"
              placeholder="请输入关键词，用逗号分隔"
              required
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              label="文档描述"
              name="description"
              type="textarea"
              placeholder="请输入文档描述"
              required
            />
          </div>
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

  // 渲染上传文档模态框
  const renderUploadModal = () => {
    return (
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="上传文档"
        size="md"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              icon={<AiOutlineCheck size={16} />}
            >
              上传
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <AiOutlineUpload size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-2">点击或拖拽文件到此处上传</p>
            <p className="text-gray-500 text-sm">支持 PDF, Word, Excel, PowerPoint, 图片等格式</p>
            <Button
              variant="outline"
              className="mt-4"
              icon={<AiOutlineUpload size={16} />}
            >
              选择文件
            </Button>
          </div>
          
          <FormField
            label="文档类型"
            name="documentType"
            type="select"
            options={getDocumentTypeOptions()}
            required
          />
          
          <FormField
            label="安全级别"
            name="securityLevel"
            type="select"
            options={[
              { value: '公开', label: '公开' },
              { value: '内部', label: '内部' },
              { value: '保密', label: '保密' },
              { value: '机密', label: '机密' }
            ]}
            required
          />
          
          <FormField
            label="文档描述"
            name="description"
            type="textarea"
            placeholder="请输入文档描述"
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
        title="筛选文档"
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
            label="文档类型"
            name="documentType"
            type="select"
            value={filterParams.documentType}
            onChange={(e) => setFilterParams(prev => ({ ...prev, documentType: e.target.value }))}
            options={getDocumentTypeOptions()}
          />
          
          <FormField
            label="安全级别"
            name="securityLevel"
            type="select"
            value={filterParams.securityLevel}
            onChange={(e) => setFilterParams(prev => ({ ...prev, securityLevel: e.target.value }))}
            options={getSecurityLevelOptions()}
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
            placeholder="搜索标题、作者、关键词等"
            value={filterParams.keyword}
            onChange={(e) => setFilterParams(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
      </Modal>
    );
  };

  // 获取统计数据
  const regulationsCount = getDocumentsCountByType('规章制度');
  const medicalRecordsCount = getDocumentsCountByType('医疗记录');
  const contractsCount = getDocumentsCountByType('合同协议');
  const recentDocuments = getRecentDocuments();
  const expiredDocuments = getExpiredDocuments();

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
          <h1 className="text-2xl font-bold text-gray-800">文档管理</h1>
          <p className="text-gray-600 mt-1">管理所有机构文档、制度和记录</p>
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
            variant="outline" 
            icon={<AiOutlineUpload size={16} />}
            onClick={handleUploadDocument}
          >
            上传
          </Button>
          <Button 
            variant="primary" 
            icon={<AiOutlinePlus size={16} />}
            onClick={handleAddDocument}
          >
            新建
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-blue-800">{documents.length}</p>
              <p className="text-sm text-blue-700">文档总数</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineFileText size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-800">{regulationsCount}</p>
              <p className="text-sm text-green-700">规章制度</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineFileText size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-purple-800">{medicalRecordsCount}</p>
              <p className="text-sm text-purple-700">医疗记录</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineFileText size={24} />
            </div>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-800">{contractsCount}</p>
              <p className="text-sm text-yellow-700">合同协议</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <AiOutlineFileText size={24} />
            </div>
          </div>
        </Card>
      </div>

      {expiredDocuments.length > 0 && (
        <Alert
          type="warning"
          title="文档过期提醒"
          message={`有 ${expiredDocuments.length} 个文档已过期，请及时更新。`}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <Card
            title="最近更新"
            icon={<AiOutlineClockCircle size={18} />}
            headerClassName="bg-blue-50"
          >
            <div className="space-y-3 mt-2">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc, index) => (
                  <div 
                    key={index}
                    className="flex items-start p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <DocumentIcon fileFormat={doc.fileFormat} />
                    <div className="ml-2">
                      <p className="font-medium text-sm line-clamp-1" title={doc.title}>{doc.title}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <AiOutlineCalendar className="mr-1" />
                        <span>{doc.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">暂无更新文档</p>
              )}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
              <Tabs
                tabs={[
                  { key: 'all', label: '全部文档', content: null },
                  { key: 'regulations', label: '规章制度', content: null },
                  { key: 'medical', label: '医疗记录', content: null },
                  { key: 'contracts', label: '合同协议', content: null },
                  { key: 'pending', label: '待审批', content: null }
                ]}
                defaultActiveKey="all"
                onChange={(key) => setActiveTab(key)}
              />
              
              <div className="flex items-center mt-4 md:mt-0">
                <div className="relative mr-3">
                  <input
                    type="text"
                    placeholder="搜索文档..."
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
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    卡片
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    表格
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === 'table' ? (
              <Table
                columns={columns}
                data={filteredDocuments}
                emptyMessage="暂无文档数据"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onClick={() => handleViewDocument(doc)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    暂无文档数据
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {renderDetailModal()}
      {renderAddModal()}
      {renderUploadModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}