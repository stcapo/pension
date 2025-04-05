'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  AiOutlinePlus, 
  AiOutlineUser, 
  AiOutlineEdit,
  AiOutlineFilter,
  AiOutlineCheck,
  AiOutlineCalendar,
  AiOutlineCoffee,
  AiOutlineFire,
  AiOutlineClockCircle,
  AiOutlineApple
} from 'react-icons/ai';

import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import Tabs from '../../components/ui/Tabs';
import Alert from '../../components/ui/Alert';
import { getNutritionPlans, getElderlyProfiles, getElderlyById, formatDate } from '../../utils/data-utils';
import { useSaveAnimation, renderSaveButton, renderSuccessOverlay } from '../../utils/save-animation';

// 食物项组件 - 用于复用
const FoodItem = ({ category, name, portion }) => {
  const categoryColors = {
    '主食': 'bg-yellow-100 text-yellow-800',
    '肉类': 'bg-red-100 text-red-800',
    '蔬菜': 'bg-green-100 text-green-800',
    '水果': 'bg-purple-100 text-purple-800',
    '汤': 'bg-blue-100 text-blue-800',
    '点心': 'bg-pink-100 text-pink-800',
    '饮品': 'bg-indigo-100 text-indigo-800'
  };

  return (
    <div className="flex justify-between items-center p-2 rounded-md bg-gray-50 mb-1">
      <div className="flex items-center">
        <span className={`px-2 py-0.5 text-xs rounded-full ${categoryColors[category] || 'bg-gray-100'} mr-2`}>
          {category}
        </span>
        <span>{name}</span>
      </div>
      <span className="text-sm text-gray-500">{portion}</span>
    </div>
  );
};

// 膳食计划卡片组件 - 用于复用
const MealPlanCard = ({ meal, onEdit }) => {
  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AiOutlineCoffee className="mr-2" />
            <span>{meal.type}</span>
          </div>
          <span className="text-sm font-normal">{meal.time}</span>
        </div>
      } 
      className="mb-4"
      headerClassName="bg-blue-50"
      footer={
        <div className="text-right">
          <Button
            size="sm"
            variant="outline"
            icon={<AiOutlineEdit size={16} />}
            onClick={() => onEdit && onEdit(meal)}
          >
            编辑
          </Button>
        </div>
      }
    >
      <div className="py-2">
        {meal.items.length > 0 ? (
          meal.items.map((item, index) => (
            <FoodItem 
              key={index}
              category={item.category}
              name={item.name}
              portion={item.portion}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-2">暂无食物项目</p>
        )}
      </div>
    </Card>
  );
};

export default function NutritionManagement() {
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [elderlyProfiles, setElderlyProfiles] = useState([]);
  const [selectedElderly, setSelectedElderly] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMealModalOpen, setIsEditMealModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filterParams, setFilterParams] = useState({
    elderlyId: '',
    dietType: ''
  });
  
  const searchParams = useSearchParams();
  const elderlyIdParam = searchParams.get('elderlyId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载所有营养计划数据
        const planData = await getNutritionPlans();
        setNutritionPlans(planData);
        
        // 加载所有老人档案数据
        const profiles = await getElderlyProfiles();
        setElderlyProfiles(profiles);
        
        // 如果URL中有elderlyId参数，则选中对应老人
        if (elderlyIdParam) {
          const elderly = await getElderlyById(parseInt(elderlyIdParam));
          if (elderly) {
            setSelectedElderly(elderly);
            setFilterParams(prev => ({ ...prev, elderlyId: elderly.id }));
            
            // 查找该老人的营养计划
            const plan = planData.find(p => p.elderlyId === elderly.id);
            if (plan) {
              setSelectedPlan(plan);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch nutrition plan data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [elderlyIdParam]);

  // 当筛选参数或数据变化时，应用筛选
  useEffect(() => {
    applyFilters();
  }, [nutritionPlans, filterParams, activeTab]);

  // 应用筛选逻辑
  const applyFilters = () => {
    let result = [...nutritionPlans];
    
    // 按老人ID筛选
    if (filterParams.elderlyId) {
      result = result.filter(plan => plan.elderlyId === parseInt(filterParams.elderlyId));
    }
    
    // 按饮食类型筛选
    if (filterParams.dietType) {
      result = result.filter(plan => plan.dietType === filterParams.dietType);
    }
    
    // 根据活动选项卡筛选
    if (activeTab === 'special') {
      result = result.filter(plan => plan.dietType !== '普通饮食');
    }
    
    setFilteredPlans(result);
  };

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setIsDetailModalOpen(true);
  };

  const handleEditMeal = (meal) => {
    setSelectedMeal(meal);
    setIsSaving(false);
    setSaveSuccess(false);
    setIsEditMealModalOpen(true);
  };

  const closeEditMealModal = () => {
    setIsEditMealModalOpen(false);
    setIsSaving(false);
    setSaveSuccess(false);
  };
  
  // 使用工具函数处理保存动画
  const handleSaveMeal = useSaveAnimation(setIsSaving, setSaveSuccess, closeEditMealModal);

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
    
    // 查找该老人的营养计划
    if (id) {
      const plan = nutritionPlans.find(p => p.elderlyId === id);
      if (plan) {
        setSelectedPlan(plan);
      } else {
        setSelectedPlan(null);
      }
    } else {
      setSelectedPlan(null);
    }
  };

  const handleResetFilters = () => {
    setFilterParams({
      elderlyId: '',
      dietType: ''
    });
    setSelectedElderly(null);
    setSelectedPlan(null);
  };

  // 计算老人总能量摄入
  const calculateTotalCalories = (plan) => {
    if (!plan) return 0;
    
    // 假设我们从计划的calorieIntake字段中提取数字
    const calorieMatch = plan.calorieIntake.match(/\d+/);
    return calorieMatch ? parseInt(calorieMatch[0]) : 0;
  };

  // 获取不同饮食类型的老人数量统计
  const getDietTypeStats = () => {
    const stats = {};
    nutritionPlans.forEach(plan => {
      if (!stats[plan.dietType]) {
        stats[plan.dietType] = 0;
      }
      stats[plan.dietType]++;
    });
    return stats;
  };

  // 获取饮食类型选项
  const getDietTypeOptions = () => {
    const types = [...new Set(nutritionPlans.map(plan => plan.dietType))];
    return [
      { value: '', label: '全部类型' },
      ...types.map(type => ({ value: type, label: type }))
    ];
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
      title: '饮食类型', 
      dataIndex: 'dietType',
      width: '120px',
      render: (record) => {
        const dietTypeColors = {
          '普通饮食': 'bg-green-100 text-green-800',
          '低盐饮食': 'bg-blue-100 text-blue-800',
          '糖尿病饮食': 'bg-yellow-100 text-yellow-800',
          '软食': 'bg-purple-100 text-purple-800',
          '流质饮食': 'bg-pink-100 text-pink-800',
          '高蛋白饮食': 'bg-indigo-100 text-indigo-800',
          '无乳糖饮食': 'bg-orange-100 text-orange-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${dietTypeColors[record.dietType] || 'bg-gray-100'}`}>
            {record.dietType}
          </span>
        );
      }
    },
    { 
      title: '能量摄入', 
      dataIndex: 'calorieIntake',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineFire className="text-orange-500 mr-1" />
          <span>{record.calorieIntake}</span>
        </div>
      )
    },
    { 
      title: '特殊要求', 
      dataIndex: 'specialRequirements',
      width: '180px',
      render: (record) => (
        <div className="truncate max-w-[180px]" title={record.specialRequirements}>
          {record.specialRequirements || '无'}
        </div>
      )
    },
    { 
      title: '更新日期', 
      dataIndex: 'lastUpdated',
      width: '100px',
      render: (record) => (
        <div className="flex items-center">
          <AiOutlineCalendar className="text-gray-500 mr-1" />
          <span>{record.lastUpdated}</span>
        </div>
      )
    },
    {
      title: '操作',
      width: '100px',
      render: (record) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleViewPlan(record)}
        >
          查看
        </Button>
      )
    }
  ];

  // 渲染营养计划详情模态框
  const renderDetailModal = () => {
    if (!selectedPlan) return null;
    
    return (
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="营养计划详情"
        size="xl"
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
              编辑计划
            </Button>
          </div>
        }
      >
        {renderSuccessOverlay(saveSuccess)}
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
              <AiOutlineApple size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{selectedPlan.elderlyName}的营养计划</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <span className={`px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 mr-2`}>
                  {selectedPlan.dietType}
                </span>
                <span>更新于: {selectedPlan.lastUpdated}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-blue-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-blue-700">能量摄入</p>
              <p className="font-medium flex items-center mt-1">
                <AiOutlineFire className="text-orange-500 mr-1" />
                {selectedPlan.calorieIntake}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-blue-700">特殊要求</p>
              <p className="font-medium mt-1">
                {selectedPlan.specialRequirements || '无特殊要求'}
              </p>
            </div>
          </div>
          
          <h4 className="font-medium mb-4">每日膳食计划</h4>
          
          <div className="space-y-6">
            {selectedPlan.dailyMeals.map((meal, index) => (
              <MealPlanCard 
                key={index} 
                meal={meal} 
                onEdit={handleEditMeal}
              />
            ))}
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">营养师建议</h4>
            <p className="text-gray-700">
              基于{selectedPlan.elderlyName}的健康状况和饮食需求，我们制定了上述营养计划。
              请确保按照计划提供膳食，并注意观察老人的进食情况和反馈。
            </p>
          </div>
        </div>
      </Modal>
    );
  };

  // 渲染编辑膳食模态框
  const renderEditMealModal = () => {
    if (!selectedMeal) return null;
    
    // 食物类别
    const foodCategories = ['主食', '肉类', '蔬菜', '水果', '汤', '点心', '饮品'];
    
    // 每个类别对应的食物
    const foods = {
      '主食': ['米饭', '面条', '馒头', '粥', '花卷', '面包'],
      '肉类': ['鱼肉', '鸡肉', '瘦猪肉', '牛肉', '豆腐', '鸡蛋'],
      '蔬菜': ['青菜', '胡萝卜', '土豆', '西红柿', '茄子', '白菜', '黄瓜'],
      '水果': ['苹果', '香蕉', '橙子', '梨', '西瓜', '葡萄'],
      '汤': ['蔬菜汤', '鸡汤', '鱼汤', '番茄汤', '紫菜汤'],
      '点心': ['蛋糕', '饼干', '酸奶', '水果沙拉'],
      '饮品': ['牛奶', '豆浆', '茶', '果汁', '温水']
    };
    
    return (
      <Modal
        isOpen={isEditMealModalOpen}
        onClose={closeEditMealModal}
        title={`编辑${selectedMeal.type}菜单`}
        size="lg"
        footer={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={closeEditMealModal}
            >
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveMeal}
              disabled={isSaving || saveSuccess}
            >
              {renderSaveButton(isSaving, saveSuccess)}
            </Button>
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AiOutlineCoffee size={20} className="mr-2 text-blue-600" />
              <h3 className="font-medium">{selectedMeal.type}</h3>
            </div>
            <div className="flex items-center">
              <AiOutlineClockCircle size={16} className="mr-1 text-gray-500" />
              <FormField
                name="mealTime"
                type="time"
                value={selectedMeal.time}
                className="mb-0"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">当前食物项目</h4>
            {selectedMeal.items.length > 0 ? (
              <div className="space-y-2">
                {selectedMeal.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded bg-gray-50">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded-full mr-2">
                        {item.category}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormField
                        name={`portion-${index}`}
                        placeholder="份量"
                        value={item.portion}
                        className="mb-0 w-24"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="!p-1 text-red-500"
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 p-4 bg-gray-50 rounded">暂无食物项目</p>
            )}
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">添加食物项目</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="食物类别"
                name="foodCategory"
                type="select"
                options={foodCategories.map(cat => ({ value: cat, label: cat }))}
              />
              <FormField
                label="食物名称"
                name="foodName"
                type="select"
                options={[]}
                placeholder="请先选择食物类别"
              />
              <FormField
                label="份量"
                name="foodPortion"
                placeholder="例如：1份"
              />
            </div>
            <div className="mt-4 text-right">
              <Button
                variant="primary"
                size="sm"
                icon={<AiOutlinePlus size={16} />}
              >
                添加食物
              </Button>
            </div>
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
        title="筛选营养计划"
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
            label="饮食类型"
            name="dietType"
            type="select"
            value={filterParams.dietType}
            onChange={(e) => setFilterParams(prev => ({ ...prev, dietType: e.target.value }))}
            options={getDietTypeOptions()}
          />
        </div>
      </Modal>
    );
  };

  // 获取饮食类型统计
  const dietTypeStats = getDietTypeStats();

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
          <h1 className="text-2xl font-bold text-gray-800">营养管理</h1>
          <p className="text-gray-600 mt-1">
            {selectedElderly ? `${selectedElderly.name}的营养计划` : '管理所有老人的营养计划'}
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
          >
            新建计划
          </Button>
        </div>
      </div>

      {selectedElderly && selectedPlan && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 flex flex-col items-center justify-center border-r pr-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-2">
                <AiOutlineUser size={28} />
              </div>
              <h3 className="text-lg font-bold text-center">{selectedElderly.name}</h3>
              <p className="text-sm text-gray-500">{selectedElderly.age}岁 | 房间 {selectedElderly.roomNumber}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800`}>
                  {selectedPlan.dietType}
                </span>
              </div>
            </div>
            
            <div className="md:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">能量摄入</p>
                  <p className="text-lg font-medium flex items-center">
                    <AiOutlineFire className="text-orange-500 mr-1" />
                    {selectedPlan.calorieIntake}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">特殊要求</p>
                  <p className="text-sm font-medium">
                    {selectedPlan.specialRequirements || '无特殊要求'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">更新日期</p>
                  <p className="text-sm font-medium flex items-center">
                    <AiOutlineCalendar className="mr-1" />
                    {selectedPlan.lastUpdated}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedPlan.dailyMeals.map((meal, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-sm">{meal.type}</p>
                      <p className="text-xs text-gray-500">{meal.time}</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {meal.items.map(item => item.name).join('、')}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<AiOutlineEdit size={16} />}
                  onClick={() => handleViewPlan(selectedPlan)}
                >
                  查看详情
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {!selectedElderly && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-green-800">{nutritionPlans.length}</p>
                <p className="text-sm text-green-700">营养计划总数</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                <AiOutlineApple size={24} />
              </div>
            </div>
          </Card>
          
          <Card className="bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-blue-800">{dietTypeStats['低盐饮食'] || 0}</p>
                <p className="text-sm text-blue-700">低盐饮食老人</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <AiOutlineUser size={24} />
              </div>
            </div>
          </Card>
          
          <Card className="bg-yellow-50 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-yellow-800">{dietTypeStats['糖尿病饮食'] || 0}</p>
                <p className="text-sm text-yellow-700">糖尿病饮食老人</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                <AiOutlineUser size={24} />
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card className="mb-6">
        <div className="mb-4">
          <Tabs
            tabs={[
              { key: 'all', label: '全部计划', content: null },
              { key: 'special', label: '特殊饮食', content: null }
            ]}
            defaultActiveKey="all"
            onChange={(key) => setActiveTab(key)}
          />
        </div>

        <Table
          columns={columns}
          data={filteredPlans}
          emptyMessage="暂无营养计划数据"
        />
      </Card>

      {renderDetailModal()}
      {renderEditMealModal()}
      {renderFilterModal()}
    </MainLayout>
  );
}