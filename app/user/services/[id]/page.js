'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  AiOutlineClockCircle, 
  AiOutlineCalendar, 
  AiOutlineDollar, 
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineMessage,
  AiOutlineLeft
} from 'react-icons/ai';
import UserLayout from '../../../../components/layout/UserLayout';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/ui/Modal';
import FormField from '../../../../components/ui/FormField';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    name: '',
    phone: '',
    notes: '',
  });
  const [consultForm, setConsultForm] = useState({
    name: '',
    phone: '',
    question: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [consultSuccess, setConsultSuccess] = useState(false);

  useEffect(() => {
    // Simulate loading service data
    setTimeout(() => {
      const mockServices = [
        {
          id: '1',
          title: '日常生活照料',
          category: 'daily',
          description: '提供起居照料、个人卫生、饮食照料等日常生活服务，帮助老年人维持日常生活自理能力。',
          fullDescription: `
            <p>日常生活照料服务是为行动不便或需要帮助的老年人提供的基础性服务，旨在帮助老年人维持日常生活的自理能力和生活质量。</p>
            <p>我们的专业护理人员将根据老年人的具体需求，提供个性化的照料服务，包括但不限于：</p>
            <ul>
              <li>起居照料：帮助起床、睡觉、翻身、坐立等</li>
              <li>个人卫生：协助洗澡、洗头、口腔护理、修剪指甲等</li>
              <li>饮食照料：协助进食、准备餐食、监督饮食等</li>
              <li>排泄照料：协助如厕、更换尿布、清洁等</li>
              <li>穿着照料：协助穿脱衣物、整理衣物等</li>
              <li>居室整理：整理床铺、清洁居室环境等</li>
            </ul>
            <p>我们的服务人员均经过专业培训，具备丰富的老年人照料经验，能够耐心、细致地为老年人提供服务，让老年人在家也能享受到专业的照护。</p>
          `,
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          price: '¥50-200/次',
          duration: '1-2小时/次',
          rating: 4.8,
          reviews: [
            { id: 1, user: '张女士', content: '服务人员非常专业，态度很好，我父亲很满意。', rating: 5, date: '2023-10-15' },
            { id: 2, user: '王先生', content: '服务很周到，但希望能够更加灵活安排时间。', rating: 4, date: '2023-09-28' },
            { id: 3, user: '李奶奶', content: '护工很耐心，每次都把我家收拾得很干净。', rating: 5, date: '2023-09-10' },
          ],
          staff: [
            { id: 1, name: '张护工', title: '高级护理员', experience: '5年', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' },
            { id: 2, name: '王护工', title: '护理员', experience: '3年', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80' },
          ]
        },
        {
          id: '2',
          title: '健康评估',
          category: 'health',
          description: '由专业医护人员提供全面的健康评估服务，包括基础体检、慢病风险评估等。',
          fullDescription: `
            <p>健康评估服务由专业医护人员提供，旨在全面了解老年人的健康状况，及时发现健康问题，为后续的健康管理提供依据。</p>
            <p>我们的健康评估服务包括但不限于：</p>
            <ul>
              <li>基础体检：测量血压、脉搏、呼吸、体温等生命体征</li>
              <li>身体测量：测量身高、体重、腰围、臀围等，计算BMI指数</li>
              <li>功能评估：评估老年人的日常生活活动能力、认知功能、情绪状态等</li>
              <li>慢病风险评估：评估老年人患心脑血管疾病、糖尿病等慢性病的风险</li>
              <li>营养状况评估：评估老年人的营养摄入情况，提供营养改善建议</li>
              <li>用药评估：评估老年人的用药情况，避免不合理用药</li>
            </ul>
            <p>评估完成后，我们会提供详细的评估报告和健康建议，帮助老年人和家属了解健康状况，制定合理的健康管理计划。</p>
          `,
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          price: '¥200-500/次',
          duration: '1小时/次',
          rating: 4.9,
          reviews: [
            { id: 1, user: '刘先生', content: '评估非常全面，医生很专业，给了很多有用的建议。', rating: 5, date: '2023-10-20' },
            { id: 2, user: '赵女士', content: '服务很好，但价格稍高。', rating: 4, date: '2023-10-05' },
          ],
          staff: [
            { id: 1, name: '李医生', title: '主治医师', experience: '10年', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' },
          ]
        },
        // More services...
      ];
      
      const foundService = mockServices.find(s => s.id === params.id);
      setService(foundService || null);
      setLoading(false);
    }, 800);
  }, [params.id]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConsultChange = (e) => {
    const { name, value } = e.target;
    setConsultForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Simulate booking submission
    setTimeout(() => {
      setBookingSuccess(true);
      // Reset form after success
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        setBookingForm({
          date: '',
          time: '',
          name: '',
          phone: '',
          notes: '',
        });
      }, 2000);
    }, 1000);
  };

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    // Simulate consult submission
    setTimeout(() => {
      setConsultSuccess(true);
      // Reset form after success
      setTimeout(() => {
        setShowConsultModal(false);
        setConsultSuccess(false);
        setConsultForm({
          name: '',
          phone: '',
          question: '',
        });
      }, 2000);
    }, 1000);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        </div>
      </UserLayout>
    );
  }

  if (!service) {
    return (
      <UserLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">服务不存在</h2>
          <p className="text-gray-600 mb-6">抱歉，您查找的服务不存在或已被删除。</p>
          <Button 
            variant="primary" 
            onClick={() => router.push('/user/services')}
          >
            返回服务列表
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="mb-4">
        <button 
          onClick={() => router.push('/user/services')}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <AiOutlineLeft className="mr-1" />
          返回服务列表
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="relative h-64 md:h-80">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{service.title}</h1>
          
          <div className="flex flex-wrap items-center text-gray-600 mb-4">
            <div className="flex items-center mr-6 mb-2">
              <AiOutlineDollar className="mr-1" />
              <span>{service.price}</span>
            </div>
            <div className="flex items-center mr-6 mb-2">
              <AiOutlineClockCircle className="mr-1" />
              <span>{service.duration}</span>
            </div>
            <div className="flex items-center mb-2">
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
              <span className="ml-1">{service.rating}</span>
              <span className="ml-1 text-gray-500">({service.reviews.length} 评价)</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
            <Button 
              variant="primary" 
              className="mb-3 md:mb-0"
              onClick={() => setShowBookingModal(true)}
            >
              预约服务
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowConsultModal(true)}
            >
              在线咨询
            </Button>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">服务介绍</h2>
            <div 
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: service.fullDescription }}
            />
          </div>
        </div>
      </div>

      {/* Service Staff */}
      {service.staff && service.staff.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">服务人员</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.staff.map(person => (
              <div key={person.id} className="flex items-center p-3 border rounded-lg">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">{person.name}</h3>
                  <p className="text-gray-600 text-sm">{person.title}</p>
                  <p className="text-gray-500 text-sm">从业经验: {person.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reviews */}
      {service.reviews && service.reviews.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">用户评价</h2>
          <div className="space-y-4">
            {service.reviews.map(review => (
              <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-gray-700 font-medium">{review.user.charAt(0)}</span>
                    </div>
                    <span className="ml-2 font-medium text-gray-800">{review.user}</span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.content}</p>
                <p className="text-gray-500 text-sm mt-1">{review.date}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => !bookingSuccess && setShowBookingModal(false)}
        title="预约服务"
        size="md"
      >
        {bookingSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">预约成功</h3>
            <p className="mt-1 text-sm text-gray-500">
              我们会尽快与您联系确认预约详情。
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit}>
            <FormField
              label="预约日期"
              type="date"
              name="date"
              value={bookingForm.date}
              onChange={handleBookingChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
            <FormField
              label="预约时间"
              type="time"
              name="time"
              value={bookingForm.time}
              onChange={handleBookingChange}
              required
            />
            <FormField
              label="联系人"
              type="text"
              name="name"
              value={bookingForm.name}
              onChange={handleBookingChange}
              placeholder="请输入联系人姓名"
              required
            />
            <FormField
              label="联系电话"
              type="tel"
              name="phone"
              value={bookingForm.phone}
              onChange={handleBookingChange}
              placeholder="请输入联系电话"
              required
            />
            <FormField
              label="备注"
              type="textarea"
              name="notes"
              value={bookingForm.notes}
              onChange={handleBookingChange}
              placeholder="请输入特殊需求或其他备注信息"
              rows={3}
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setShowBookingModal(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                确认预约
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Consult Modal */}
      <Modal
        isOpen={showConsultModal}
        onClose={() => !consultSuccess && setShowConsultModal(false)}
        title="在线咨询"
        size="md"
      >
        {consultSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">咨询提交成功</h3>
            <p className="mt-1 text-sm text-gray-500">
              我们的工作人员会尽快回复您的咨询。
            </p>
          </div>
        ) : (
          <form onSubmit={handleConsultSubmit}>
            <FormField
              label="姓名"
              type="text"
              name="name"
              value={consultForm.name}
              onChange={handleConsultChange}
              placeholder="请输入您的姓名"
              required
            />
            <FormField
              label="联系电话"
              type="tel"
              name="phone"
              value={consultForm.phone}
              onChange={handleConsultChange}
              placeholder="请输入您的联系电话"
              required
            />
            <FormField
              label="咨询内容"
              type="textarea"
              name="question"
              value={consultForm.question}
              onChange={handleConsultChange}
              placeholder="请详细描述您想咨询的问题"
              rows={5}
              required
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setShowConsultModal(false)}
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
