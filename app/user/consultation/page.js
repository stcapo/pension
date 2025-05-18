'use client';

import { useState, useEffect } from 'react';
import { 
  AiOutlineQuestionCircle, 
  AiOutlineMessage, 
  AiOutlineUser, 
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineSearch
} from 'react-icons/ai';
import UserLayout from '../../../components/layout/UserLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';

export default function ConsultationPage() {
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [activeTab, setActiveTab] = useState('consultations');
  const [showNewConsultationModal, setShowNewConsultationModal] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [consultationSuccess, setConsultationSuccess] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockConsultations = [
        {
          id: 1,
          title: '关于血压药物的副作用咨询',
          category: '用药咨询',
          status: 'answered',
          date: '2023-11-01',
          description: '我最近开始服用新的降压药，但感觉有些头晕，这是正常的副作用吗？',
          answer: {
            staffName: '李医生',
            staffTitle: '主治医师',
            content: '头晕是降压药常见的副作用之一，特别是在刚开始服用时。建议您记录头晕发生的时间和程度，如果症状持续或加重，请及时就医。同时，建议您在服药期间避免突然站立，以减少体位性低血压带来的不适。',
            date: '2023-11-02',
          },
        },
        {
          id: 2,
          title: '如何改善睡眠质量',
          category: '健康咨询',
          status: 'pending',
          date: '2023-11-05',
          description: '最近我的睡眠质量不太好，经常半夜醒来，有什么方法可以改善睡眠质量吗？',
          answer: null,
        },
        {
          id: 3,
          title: '关于康复训练的频率咨询',
          category: '康复咨询',
          status: 'answered',
          date: '2023-10-25',
          description: '我正在进行膝关节康复训练，想咨询一下每周应该进行几次训练比较合适？',
          answer: {
            staffName: '王理疗师',
            staffTitle: '高级康复师',
            content: '对于膝关节康复训练，建议每周进行3-4次，每次30-45分钟。训练时应注意循序渐进，避免过度训练导致关节疼痛加重。如果在训练过程中感到明显疼痛，应立即停止并咨询专业医生。同时，建议您在训练前进行充分的热身，训练后进行适当的冷敷，以减少炎症反应。',
            date: '2023-10-26',
          },
        },
      ];
      
      const mockFaqs = [
        {
          id: 1,
          question: '如何正确测量血压？',
          answer: '正确测量血压的步骤：\n1. 测量前30分钟避免运动、吸烟和饮用咖啡等刺激性饮料\n2. 测量前排空膀胱，保持安静休息5分钟\n3. 坐姿测量，背部有靠，双脚平放在地面，不要翘二郎腿\n4. 将袖带绑在上臂，与心脏保持同一水平\n5. 测量时不要说话\n6. 连续测量两次，间隔1-2分钟，取平均值\n7. 最好在每天固定时间测量，记录数值',
          category: '健康监测',
        },
        {
          id: 2,
          question: '老年人每天应该喝多少水？',
          answer: '老年人每天应该喝1500-2000毫升水，约6-8杯。由于老年人的口渴感可能减弱，应该有意识地定时饮水，而不是等到口渴才喝。早晨起床后、每餐前、服药时和睡前都是适合饮水的时间。但需注意的是，患有心力衰竭、肾功能不全等疾病的老年人应遵医嘱控制饮水量。',
          category: '日常保健',
        },
        {
          id: 3,
          question: '老年人适合哪些运动？',
          answer: '老年人适合的运动包括：\n1. 散步：最简单安全的有氧运动，可以每天进行\n2. 太极拳：改善平衡能力，预防跌倒\n3. 游泳：关节负担小，全身性运动\n4. 骑自行车：可以使用固定自行车，减少跌倒风险\n5. 轻度力量训练：使用小哑铃或弹力带，增强肌肉力量\n6. 瑜伽：提高柔韧性和平衡能力\n\n运动时应注意循序渐进，避免剧烈运动和竞技性运动，如有不适应立即停止。有基础疾病的老年人在开始新的运动计划前应咨询医生。',
          category: '日常保健',
        },
        {
          id: 4,
          question: '老年人如何预防跌倒？',
          answer: '预防跌倒的措施：\n1. 家居环境改造：清除地面障碍物，固定地毯边缘，安装扶手和防滑垫\n2. 适当运动：增强肌肉力量和平衡能力，如太极拳、平衡训练\n3. 定期检查视力和听力，必要时使用助视器和助听器\n4. 穿着合适的鞋子，避免拖鞋和高跟鞋\n5. 合理用药，了解药物可能导致的头晕等副作用\n6. 使用辅助工具，如手杖、助行器等\n7. 起床或站立时动作缓慢，避免突然改变姿势\n8. 保持充足的光线，特别是夜间起床时',
          category: '安全防护',
        },
        {
          id: 5,
          question: '老年人应该如何安排饮食？',
          answer: '老年人饮食建议：\n1. 保证营养均衡：每天摄入适量的蛋白质、碳水化合物、脂肪、维生素和矿物质\n2. 增加蛋白质摄入：每天摄入鱼、瘦肉、蛋、奶、豆制品等优质蛋白\n3. 多吃蔬菜水果：每天至少5种不同颜色的蔬菜水果\n4. 适量全谷物：如糙米、全麦面包等\n5. 控制盐分摄入：每日不超过5克\n6. 少吃油炸和高糖食品\n7. 小餐多餐：可以分4-5餐进食，避免过饱\n8. 注意食物软硬适中，便于咀嚼\n9. 有慢性病的老年人应遵医嘱调整饮食',
          category: '日常保健',
        },
      ];
      
      setConsultations(mockConsultations);
      setFaqs(mockFaqs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleConsultationFormChange = (e) => {
    const { name, value } = e.target;
    setConsultationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultationSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setConsultationSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        // Add new consultation to the list
        const newConsultation = {
          id: consultations.length + 1,
          title: consultationForm.title,
          category: consultationForm.category,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
          description: consultationForm.description,
          answer: null,
        };
        
        setConsultations(prev => [newConsultation, ...prev]);
        setShowNewConsultationModal(false);
        setConsultationSuccess(false);
        setConsultationForm({
          title: '',
          category: '',
          description: '',
        });
      }, 2000);
    }, 1000);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const renderConsultationsTab = () => {
    return (
      <div>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-gray-600 mb-4 md:mb-0">
            在线咨询服务可以帮助您解答健康管理、生活照料等方面的问题，我们的专业人员会在24小时内回复您的咨询。
          </p>
          <Button 
            variant="primary" 
            icon={<AiOutlinePlus size={16} />}
            onClick={() => setShowNewConsultationModal(true)}
          >
            新增咨询
          </Button>
        </div>
        
        {consultations.length > 0 ? (
          <div className="space-y-4">
            {consultations.map(consultation => (
              <Card key={consultation.id} className="border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{consultation.title}</h3>
                  {consultation.status === 'pending' && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      待回复
                    </span>
                  )}
                  {consultation.status === 'answered' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      已回复
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-2">
                    {consultation.category}
                  </span>
                  <div className="flex items-center">
                    <AiOutlineCalendar className="mr-1" />
                    <span>{consultation.date}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <AiOutlineUser className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-600">{consultation.description}</p>
                    </div>
                  </div>
                </div>
                
                {consultation.answer && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <AiOutlineMessage className="text-green-600" size={20} />
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-gray-800 mr-2">{consultation.answer.staffName}</span>
                          <span className="text-xs text-gray-500">{consultation.answer.staffTitle}</span>
                          <span className="text-xs text-gray-500 ml-2">{consultation.answer.date}</span>
                        </div>
                        <p className="text-gray-600">{consultation.answer.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <AiOutlineMessage size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">暂无咨询记录</h3>
              <p className="text-gray-600 mb-4">
                您可以点击"新增咨询"按钮提交您的问题
              </p>
              <Button 
                variant="primary"
                onClick={() => setShowNewConsultationModal(true)}
              >
                新增咨询
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderFaqsTab = () => {
    return (
      <div>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索常见问题..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AiOutlineSearch className="text-gray-400" size={20} />
            </div>
          </div>
        </div>
        
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map(faq => (
              <Card key={faq.id} className="border border-gray-100">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <h3 className="font-bold text-gray-800">{faq.question}</h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {faq.category}
                  </span>
                </div>
                
                {expandedFaq === faq.id && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <AiOutlineQuestionCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">未找到相关问题</h3>
              <p className="text-gray-600 mb-4">
                尝试使用其他关键词搜索，或者提交新的咨询
              </p>
              <Button 
                variant="primary"
                onClick={() => {
                  setActiveTab('consultations');
                  setShowNewConsultationModal(true);
                }}
              >
                提交咨询
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">在线咨询</h1>
        <p className="text-gray-600 mt-2">
          获取专业人员的解答和建议，解决您的健康和生活问题
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-2">
        <div className="flex">
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
              activeTab === 'consultations'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('consultations')}
          >
            <AiOutlineMessage className="inline mr-1" />
            我的咨询
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
              activeTab === 'faqs'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('faqs')}
          >
            <AiOutlineQuestionCircle className="inline mr-1" />
            常见问题
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-32 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'consultations' && renderConsultationsTab()}
          {activeTab === 'faqs' && renderFaqsTab()}
        </>
      )}

      {/* New Consultation Modal */}
      <Modal
        isOpen={showNewConsultationModal}
        onClose={() => !consultationSuccess && setShowNewConsultationModal(false)}
        title="提交咨询"
        size="md"
      >
        {consultationSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">咨询提交成功</h3>
            <p className="mt-1 text-sm text-gray-500">
              我们会在24小时内回复您的咨询。
            </p>
          </div>
        ) : (
          <form onSubmit={handleConsultationSubmit}>
            <FormField
              label="咨询标题"
              type="text"
              name="title"
              value={consultationForm.title}
              onChange={handleConsultationFormChange}
              placeholder="请简要描述您的问题"
              required
            />
            <FormField
              label="咨询类别"
              type="select"
              name="category"
              value={consultationForm.category}
              onChange={handleConsultationFormChange}
              options={[
                { value: '健康咨询', label: '健康咨询' },
                { value: '用药咨询', label: '用药咨询' },
                { value: '康复咨询', label: '康复咨询' },
                { value: '心理咨询', label: '心理咨询' },
                { value: '生活照料', label: '生活照料' },
                { value: '其他', label: '其他' },
              ]}
              required
            />
            <FormField
              label="咨询内容"
              type="textarea"
              name="description"
              value={consultationForm.description}
              onChange={handleConsultationFormChange}
              placeholder="请详细描述您的问题，以便我们更好地为您提供帮助"
              rows={5}
              required
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setShowNewConsultationModal(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                提交咨询
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </UserLayout>
  );
}
