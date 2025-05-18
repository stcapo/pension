'use client';

import { useState, useEffect } from 'react';
import {
  AiOutlineHeart,
  AiOutlineAreaChart,
  AiOutlineCalendar,
  AiOutlineFileText,
  AiOutlineMedicineBox,
  AiOutlineInfoCircle
} from 'react-icons/ai';
import UserLayout from '../../../components/layout/UserLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HealthManagementPage() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockHealthData = {
        user: {
          name: '张爷爷',
          age: 78,
          gender: '男',
          height: 172,
          weight: 68,
          bloodType: 'A型',
          chronicDiseases: ['高血压', '糖尿病'],
        },
        latestVitals: {
          date: '2025-11-05',
          bloodPressure: {
            systolic: 135,
            diastolic: 85,
          },
          heartRate: 72,
          bloodSugar: 6.2,
          temperature: 36.5,
          weight: 68,
          sleepHours: 7,
        },
        trends: {
          bloodPressure: {
            dates: ['10-01', '10-05', '10-10', '10-15', '10-20', '10-25', '11-01', '11-05'],
            systolic: [142, 138, 140, 136, 138, 135, 132, 135],
            diastolic: [88, 86, 87, 85, 84, 83, 82, 85],
          },
          heartRate: {
            dates: ['10-01', '10-05', '10-10', '10-15', '10-20', '10-25', '11-01', '11-05'],
            values: [75, 73, 74, 72, 70, 71, 73, 72],
          },
          bloodSugar: {
            dates: ['10-01', '10-05', '10-10', '10-15', '10-20', '10-25', '11-01', '11-05'],
            values: [7.1, 6.8, 6.5, 6.3, 6.4, 6.2, 6.3, 6.2],
          },
          weight: {
            dates: ['10-01', '10-05', '10-10', '10-15', '10-20', '10-25', '11-01', '11-05'],
            values: [70, 69.5, 69, 68.5, 68.5, 68, 68, 68],
          },
        },
        medications: [
          {
            name: '降压药',
            dosage: '5mg',
            frequency: '每日一次',
            timeOfDay: '早餐后',
            notes: '请勿空腹服用',
          },
          {
            name: '降糖药',
            dosage: '10mg',
            frequency: '每日两次',
            timeOfDay: '早晚餐后',
            notes: '餐后30分钟服用',
          },
          {
            name: '钙片',
            dosage: '600mg',
            frequency: '每日一次',
            timeOfDay: '晚餐后',
            notes: '',
          },
        ],
        assessments: [
          {
            date: '2025-10-15',
            title: '季度健康评估',
            summary: '整体健康状况良好，血压和血糖控制在目标范围内，建议继续保持当前的药物治疗和生活方式。',
            details: '血压控制良好，平均值为135/85mmHg；血糖控制良好，空腹血糖平均值为6.2mmol/L；体重稳定在68kg；心率正常，平均值为72次/分。建议：1. 继续按时服用降压药和降糖药；2. 保持低盐低糖饮食；3. 每天进行30分钟的适度运动；4. 保持充足的睡眠；5. 三个月后复查。',
          },
          {
            date: '2025-07-10',
            title: '季度健康评估',
            summary: '血压略高，血糖控制良好，建议调整降压药剂量，并增加适度运动。',
            details: '血压偏高，平均值为142/88mmHg；血糖控制良好，空腹血糖平均值为6.5mmol/L；体重70kg，较上次增加1kg；心率正常，平均值为75次/分。建议：1. 调整降压药剂量；2. 严格控制盐分摄入；3. 每天进行30-45分钟的适度运动；4. 控制体重；5. 三个月后复查。',
          },
        ],
        recommendations: [
          {
            category: '饮食建议',
            items: [
              '控制总热量摄入，保持合理体重',
              '减少盐分摄入，每日不超过5g',
              '控制糖分摄入，避免精制糖和甜食',
              '增加蔬菜水果摄入，每日不少于500g',
              '适量摄入优质蛋白质，如鱼、瘦肉、蛋、奶等',
              '选择全谷物食品，减少精制碳水化合物摄入',
            ],
          },
          {
            category: '运动建议',
            items: [
              '每天进行30分钟以上的中等强度有氧运动，如快走、慢跑、游泳等',
              '每周进行2-3次肌肉力量训练',
              '注意运动前热身和运动后拉伸',
              '运动时注意监测心率，保持在安全范围内',
              '如感到不适，应立即停止运动并咨询医生',
            ],
          },
          {
            category: '生活方式建议',
            items: [
              '保持规律作息，每晚保证7-8小时的睡眠',
              '避免熬夜和过度疲劳',
              '保持心情愉快，避免精神紧张和情绪波动',
              '戒烟限酒',
              '定期进行健康检查',
            ],
          },
        ],
      };

      setHealthData(mockHealthData);
      setLoading(false);
    }, 1000);
  }, []);

  const renderOverviewTab = () => {
    if (!healthData) return null;

    return (
      <div className="space-y-6">
        {/* Latest Vitals */}
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">最新健康指标 ({healthData.latestVitals.date})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-500 font-medium">收缩压</div>
              <div className="text-2xl font-bold text-gray-800">{healthData.latestVitals.bloodPressure.systolic}</div>
              <div className="text-sm text-gray-500">mmHg</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-red-500 font-medium">舒张压</div>
              <div className="text-2xl font-bold text-gray-800">{healthData.latestVitals.bloodPressure.diastolic}</div>
              <div className="text-sm text-gray-500">mmHg</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 font-medium">心率</div>
              <div className="text-2xl font-bold text-gray-800">{healthData.latestVitals.heartRate}</div>
              <div className="text-sm text-gray-500">次/分</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-500 font-medium">血糖</div>
              <div className="text-2xl font-bold text-gray-800">{healthData.latestVitals.bloodSugar}</div>
              <div className="text-sm text-gray-500">mmol/L</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-500 font-medium">体重</div>
              <div className="text-2xl font-bold text-gray-800">{healthData.latestVitals.weight}</div>
              <div className="text-sm text-gray-500">kg</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-500 font-medium">睡眠</div>
              <div className="text-2xl font-bold text-gray-800">{healthData.latestVitals.sleepHours}</div>
              <div className="text-sm text-gray-500">小时</div>
            </div>
          </div>
        </Card>

        {/* Blood Pressure Trend */}
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">血压趋势</h3>
          <div className="h-64">
            <Line
              data={{
                labels: healthData.trends.bloodPressure.dates,
                datasets: [
                  {
                    label: '收缩压',
                    data: healthData.trends.bloodPressure.systolic,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3,
                  },
                  {
                    label: '舒张压',
                    data: healthData.trends.bloodPressure.diastolic,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    min: 60,
                    max: 160,
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Other Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heart Rate */}
          <Card>
            <h3 className="text-lg font-bold text-gray-800 mb-4">心率趋势</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: healthData.trends.heartRate.dates,
                  datasets: [
                    {
                      label: '心率',
                      data: healthData.trends.heartRate.values,
                      borderColor: 'rgb(16, 185, 129)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      min: 50,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </Card>

          {/* Blood Sugar */}
          <Card>
            <h3 className="text-lg font-bold text-gray-800 mb-4">血糖趋势</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: healthData.trends.bloodSugar.dates,
                  datasets: [
                    {
                      label: '血糖',
                      data: healthData.trends.bloodSugar.values,
                      borderColor: 'rgb(245, 158, 11)',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      min: 4,
                      max: 10,
                    },
                  },
                }}
              />
            </div>
          </Card>
        </div>

        {/* Latest Assessment */}
        {healthData.assessments.length > 0 && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">最新健康评估</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('assessments')}
              >
                查看全部
              </Button>
            </div>
            <div className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <AiOutlineCalendar className="mr-1" />
                <span>{healthData.assessments[0].date}</span>
              </div>
              <h4 className="font-medium text-gray-800 mb-2">{healthData.assessments[0].title}</h4>
              <p className="text-gray-600">{healthData.assessments[0].summary}</p>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderMedicationsTab = () => {
    if (!healthData) return null;

    return (
      <div>
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">当前用药</h3>
          <div className="space-y-4">
            {healthData.medications.map((medication, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <AiOutlineMedicineBox className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{medication.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                      <div className="text-sm">
                        <span className="text-gray-500">剂量: </span>
                        <span className="text-gray-700">{medication.dosage}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">频率: </span>
                        <span className="text-gray-700">{medication.frequency}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">服用时间: </span>
                        <span className="text-gray-700">{medication.timeOfDay}</span>
                      </div>
                      {medication.notes && (
                        <div className="text-sm md:col-span-2">
                          <span className="text-gray-500">注意事项: </span>
                          <span className="text-gray-700">{medication.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex items-start">
            <AiOutlineInfoCircle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-yellow-700 font-medium">用药提醒</p>
              <p className="text-yellow-600 text-sm mt-1">请按医嘱按时服药，不要擅自调整剂量或停药。如有不适，请及时咨询医生。</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderAssessmentsTab = () => {
    if (!healthData) return null;

    return (
      <div>
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">健康评估记录</h3>
          <div className="space-y-6">
            {healthData.assessments.map((assessment, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <AiOutlineCalendar className="mr-1" />
                  <span>{assessment.date}</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">{assessment.title}</h4>
                <p className="text-gray-600 font-medium mb-2">{assessment.summary}</p>
                <p className="text-gray-600 text-sm whitespace-pre-line">{assessment.details}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderRecommendationsTab = () => {
    if (!healthData) return null;

    return (
      <div>
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">健康建议</h3>
          <div className="space-y-6">
            {healthData.recommendations.map((recommendation, index) => (
              <div key={index}>
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  {index === 0 && <AiOutlineMedicineBox className="mr-2 text-primary" />}
                  {index === 1 && <AiOutlineHeart className="mr-2 text-red-500" />}
                  {index === 2 && <AiOutlineCalendar className="mr-2 text-green-500" />}
                  {recommendation.category}
                </h4>
                <ul className="space-y-2 pl-6">
                  {recommendation.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600 list-disc">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 font-medium">温馨提示</p>
            <p className="text-blue-600 text-sm mt-1">以上建议仅供参考，具体健康管理方案请遵医嘱。如有任何疑问，请咨询您的医生或护理人员。</p>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">健康管理</h1>
        <p className="text-gray-600 mt-2">
          查看您的健康数据、趋势变化和专业健康建议
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm h-64 animate-pulse"></div>
          <div className="bg-white rounded-lg shadow-sm h-80 animate-pulse"></div>
        </div>
      ) : healthData ? (
        <div>
          {/* User Info */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="bg-primary rounded-full w-20 h-20 flex items-center justify-center text-white text-2xl font-bold">
                  {healthData.user.name.charAt(0)}
                </div>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{healthData.user.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">年龄: </span>
                    <span className="text-gray-700">{healthData.user.age}岁</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">性别: </span>
                    <span className="text-gray-700">{healthData.user.gender}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">身高: </span>
                    <span className="text-gray-700">{healthData.user.height}cm</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">体重: </span>
                    <span className="text-gray-700">{healthData.user.weight}kg</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">血型: </span>
                    <span className="text-gray-700">{healthData.user.bloodType}</span>
                  </div>
                  <div className="text-sm md:col-span-3">
                    <span className="text-gray-500">慢性病: </span>
                    <span className="text-gray-700">{healthData.user.chronicDiseases.join('、')}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="mb-6 border-b">
            <div className="flex overflow-x-auto">
              <button
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <AiOutlineHeart className="inline mr-1" />
                健康概览
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'medications'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('medications')}
              >
                <AiOutlineMedicineBox className="inline mr-1" />
                用药管理
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'assessments'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('assessments')}
              >
                <AiOutlineFileText className="inline mr-1" />
                健康评估
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'recommendations'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('recommendations')}
              >
                <AiOutlineInfoCircle className="inline mr-1" />
                健康建议
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'medications' && renderMedicationsTab()}
          {activeTab === 'assessments' && renderAssessmentsTab()}
          {activeTab === 'recommendations' && renderRecommendationsTab()}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">无法加载健康数据，请稍后再试。</p>
        </div>
      )}
    </UserLayout>
  );
}
