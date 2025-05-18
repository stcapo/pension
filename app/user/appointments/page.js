'use client';

import { useState, useEffect } from 'react';
import {
  AiOutlineSchedule,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineUser,
  AiOutlineEnvironment,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineStar,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete
} from 'react-icons/ai';
import UserLayout from '../../../components/layout/UserLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import FormField from '../../../components/ui/FormField';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    serviceType: '',
    date: '',
    time: '',
    notes: '',
  });
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    comment: '',
  });
  const [cancelReason, setCancelReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockAppointments = [
        {
          id: 1,
          serviceType: '日常生活照料',
          date: '2025-11-15',
          time: '09:00',
          duration: '2小时',
          status: 'upcoming',
          staffName: '张护工',
          location: '居家服务',
          notes: '需要协助洗澡和整理房间',
        },
        {
          id: 2,
          serviceType: '健康评估',
          date: '2025-11-20',
          time: '14:30',
          duration: '1小时',
          status: 'upcoming',
          staffName: '李医生',
          location: '社区健康中心',
          notes: '',
        },
        {
          id: 3,
          serviceType: '康复训练',
          date: '2025-10-25',
          time: '10:00',
          duration: '45分钟',
          status: 'completed',
          staffName: '王理疗师',
          location: '康复中心',
          notes: '',
          rating: 4,
          comment: '理疗师很专业，训练效果不错',
        },
        {
          id: 4,
          serviceType: '心理疏导',
          date: '2025-10-18',
          time: '15:00',
          duration: '1小时',
          status: 'completed',
          staffName: '赵心理咨询师',
          location: '居家服务',
          notes: '',
          rating: 5,
          comment: '咨询师很耐心，帮助我解决了很多心理问题',
        },
        {
          id: 5,
          serviceType: '陪同就医',
          date: '2025-10-10',
          time: '08:30',
          duration: '3小时',
          status: 'cancelled',
          staffName: '刘护工',
          location: '市第一医院',
          notes: '',
          cancelReason: '身体不适，需要改期',
        },
      ];

      setAppointments(mockAppointments);
      setLoading(false);
    }, 800);
  }, []);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingForm(prev => ({ ...prev, [name]: value }));
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
          serviceType: '',
          date: '',
          time: '',
          notes: '',
        });

        // Add new appointment to the list
        const newAppointment = {
          id: appointments.length + 1,
          serviceType: bookingForm.serviceType,
          date: bookingForm.date,
          time: bookingForm.time,
          duration: '1小时', // Default duration
          status: 'upcoming',
          staffName: '待分配',
          location: '待确认',
          notes: bookingForm.notes,
        };

        setAppointments(prev => [newAppointment, ...prev]);
      }, 2000);
    }, 1000);
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    // Simulate rating submission
    setTimeout(() => {
      setRatingSuccess(true);
      // Reset form after success
      setTimeout(() => {
        // Update appointment with rating
        setAppointments(prev =>
          prev.map(app =>
            app.id === selectedAppointment.id
              ? {
                  ...app,
                  rating: parseInt(ratingForm.rating),
                  comment: ratingForm.comment
                }
              : app
          )
        );

        setShowRatingModal(false);
        setRatingSuccess(false);
        setRatingForm({
          rating: 5,
          comment: '',
        });
        setSelectedAppointment(null);
      }, 2000);
    }, 1000);
  };

  const handleCancelSubmit = () => {
    // Simulate cancel submission
    setTimeout(() => {
      setCancelSuccess(true);
      // Reset form after success
      setTimeout(() => {
        // Update appointment status to cancelled
        setAppointments(prev =>
          prev.map(app =>
            app.id === selectedAppointment.id
              ? {
                  ...app,
                  status: 'cancelled',
                  cancelReason: cancelReason
                }
              : app
          )
        );

        setShowCancelModal(false);
        setCancelSuccess(false);
        setCancelReason('');
        setSelectedAppointment(null);
      }, 2000);
    }, 1000);
  };

  const openRatingModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRatingForm({
      rating: appointment.rating || 5,
      comment: appointment.comment || '',
    });
    setShowRatingModal(true);
  };

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === 'upcoming') {
      return appointment.status === 'upcoming';
    } else if (activeTab === 'completed') {
      return appointment.status === 'completed';
    } else if (activeTab === 'cancelled') {
      return appointment.status === 'cancelled';
    }
    return true;
  });

  const renderStarRating = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRatingForm(prev => ({ ...prev, rating: star }))}
            className={`text-2xl ${
              star <= ratingForm.rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">服务预约</h1>
          <p className="text-gray-600 mt-2">
            管理您的服务预约，查看预约历史和评价服务
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            icon={<AiOutlinePlus size={16} />}
            onClick={() => setShowBookingModal(true)}
          >
            新增预约
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-2">
        <div className="flex">
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            <AiOutlineCalendar className="inline mr-1" />
            即将到来
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
              activeTab === 'completed'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            <AiOutlineCheck className="inline mr-1" />
            已完成
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm ${
              activeTab === 'cancelled'
                ? 'bg-primary text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('cancelled')}
          >
            <AiOutlineClose className="inline mr-1" />
            已取消
          </button>
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-32 animate-pulse"></div>
          ))}
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <h3 className="font-bold text-gray-800 mr-2">{appointment.serviceType}</h3>
                    {appointment.status === 'upcoming' && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        即将到来
                      </span>
                    )}
                    {appointment.status === 'completed' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        已完成
                      </span>
                    )}
                    {appointment.status === 'cancelled' && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        已取消
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <AiOutlineCalendar className="mr-1" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <AiOutlineClockCircle className="mr-1" />
                      <span>{appointment.time} ({appointment.duration})</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <AiOutlineUser className="mr-1" />
                      <span>{appointment.staffName}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <AiOutlineEnvironment className="mr-1" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">备注: </span>
                      {appointment.notes}
                    </div>
                  )}

                  {appointment.rating && (
                    <div className="mt-2 flex items-center">
                      <span className="text-sm text-gray-600 mr-1">评分:</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < appointment.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {appointment.comment && (
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">评价: </span>
                      {appointment.comment}
                    </div>
                  )}

                  {appointment.cancelReason && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">取消原因: </span>
                      {appointment.cancelReason}
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 md:ml-4 flex flex-col space-y-2">
                  {appointment.status === 'upcoming' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<AiOutlineEdit size={14} />}
                        className="w-full"
                      >
                        修改
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<AiOutlineDelete size={14} />}
                        className="w-full"
                        onClick={() => openCancelModal(appointment)}
                      >
                        取消
                      </Button>
                    </>
                  )}

                  {appointment.status === 'completed' && !appointment.rating && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<AiOutlineStar size={14} />}
                      className="w-full"
                      onClick={() => openRatingModal(appointment)}
                    >
                      评价
                    </Button>
                  )}

                  {appointment.status === 'completed' && appointment.rating && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<AiOutlineEdit size={14} />}
                      className="w-full"
                      onClick={() => openRatingModal(appointment)}
                    >
                      修改评价
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <AiOutlineSchedule size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">暂无预约</h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'upcoming' && '您目前没有即将到来的预约'}
              {activeTab === 'completed' && '您目前没有已完成的预约'}
              {activeTab === 'cancelled' && '您目前没有已取消的预约'}
            </p>
            {activeTab !== 'upcoming' && (
              <Button
                variant="outline"
                onClick={() => setActiveTab('upcoming')}
              >
                查看即将到来的预约
              </Button>
            )}
            {activeTab === 'upcoming' && (
              <Button
                variant="primary"
                onClick={() => setShowBookingModal(true)}
              >
                预约服务
              </Button>
            )}
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
              label="服务类型"
              type="select"
              name="serviceType"
              value={bookingForm.serviceType}
              onChange={handleBookingChange}
              options={[
                { value: '日常生活照料', label: '日常生活照料' },
                { value: '健康评估', label: '健康评估' },
                { value: '康复训练', label: '康复训练' },
                { value: '心理疏导', label: '心理疏导' },
                { value: '陪同就医', label: '陪同就医' },
                { value: '用药指导', label: '用药指导' },
              ]}
              required
            />
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

      {/* Rating Modal */}
      <Modal
        isOpen={showRatingModal}
        onClose={() => !ratingSuccess && setShowRatingModal(false)}
        title="服务评价"
        size="md"
      >
        {ratingSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">评价成功</h3>
            <p className="mt-1 text-sm text-gray-500">
              感谢您的反馈，我们将不断改进服务质量。
            </p>
          </div>
        ) : (
          <form onSubmit={handleRatingSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                服务评分
              </label>
              {renderStarRating(ratingForm.rating)}
            </div>
            <FormField
              label="评价内容"
              type="textarea"
              name="comment"
              value={ratingForm.comment}
              onChange={handleRatingChange}
              placeholder="请分享您对本次服务的评价和建议"
              rows={4}
              required
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setShowRatingModal(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                提交评价
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => !cancelSuccess && setShowCancelModal(false)}
        title="取消预约"
        size="md"
      >
        {cancelSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">取消成功</h3>
            <p className="mt-1 text-sm text-gray-500">
              您的预约已成功取消。
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-gray-600">
              您确定要取消以下预约吗？
            </p>
            {selectedAppointment && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-medium text-gray-800">{selectedAppointment.serviceType}</p>
                <p className="text-sm text-gray-600">
                  {selectedAppointment.date} {selectedAppointment.time} ({selectedAppointment.duration})
                </p>
              </div>
            )}
            <FormField
              label="取消原因"
              type="textarea"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="请简要说明取消原因"
              rows={3}
              required
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => setShowCancelModal(false)}
              >
                返回
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelSubmit}
                disabled={!cancelReason}
              >
                确认取消
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </UserLayout>
  );
}
