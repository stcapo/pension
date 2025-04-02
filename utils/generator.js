const fs = require('fs');
const path = require('path');

// 中国常见姓名
const firstNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '郑', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗'];
const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英'];

// 健康状态
const healthStatus = ['良好', '稳定', '需关注', '需治疗', '恢复中'];

// 常见疾病
const commonDiseases = ['高血压', '糖尿病', '冠心病', '关节炎', '骨质疏松', '白内障', '帕金森', '老年痴呆', '脑梗塞', '慢性支气管炎'];

// 医疗专业人员
const medicalStaff = ['医生', '护士', '护工', '理疗师', '营养师', '心理咨询师', '社工'];

// 药物类型
const medicationTypes = ['降压药', '降糖药', '心脏药', '消炎药', '止痛药', '镇静药', '抗抑郁药', '维生素', '钙片', '眼药'];

// 药物服用时间
const medicationTime = ['早餐前', '早餐后', '午餐前', '午餐后', '晚餐前', '晚餐后', '睡前'];

// 药物剂量单位
const dosageUnits = ['片', '粒', '毫克', '毫升', '克', '包'];

// 活动类型
const activityTypes = ['棋牌活动', '文艺表演', '健康讲座', '手工制作', '户外散步', '园艺活动', '太极拳', '歌唱活动', '舞蹈活动', '书法活动'];

// 饮食类型
const dietTypes = ['普通饮食', '低盐饮食', '糖尿病饮食', '软食', '流质饮食', '高蛋白饮食', '无乳糖饮食'];

// 访客关系
const visitorRelations = ['子女', '配偶', '孙辈', '亲戚', '朋友', '邻居', '社工'];

// 警报级别
const alertLevels = ['紧急', '高', '中', '低'];

// 警报类型
const alertTypes = ['健康异常', '摔倒', '走失', '药物漏服', '情绪异常', '饮食异常', '生活设施故障'];

// 随机生成数字
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机选择数组中的一项
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 随机生成日期
function randomDate(start = new Date(2023, 0, 1), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// 格式化日期
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// 随机生成电话号码
function randomPhone() {
  const prefixes = ['138', '139', '156', '187', '136', '135', '158', '151'];
  const prefix = randomItem(prefixes);
  let number = '';
  for (let i = 0; i < 8; i++) {
    number += randomInt(0, 9);
  }
  return prefix + number;
}

// 随机生成地址
function randomAddress() {
  const provinces = ['北京市', '上海市', '广东省', '江苏省', '浙江省', '四川省', '湖北省', '湖南省', '河南省', '河北省'];
  const cities = ['市辖区', '南京市', '广州市', '深圳市', '杭州市', '成都市', '武汉市', '长沙市', '郑州市', '石家庄市'];
  const districts = ['东区', '西区', '南区', '北区', '中心区', '高新区', '开发区'];
  const streets = ['人民路', '解放路', '建设路', '和平路', '长江路', '黄河路', '中山路', '北京路', '上海路', '广州路'];
  
  const province = randomItem(provinces);
  const city = randomItem(cities);
  const district = randomItem(districts);
  const street = randomItem(streets);
  const number = randomInt(1, 100);
  const building = randomInt(1, 20);
  const room = randomInt(101, 2505);
  
  return `${province}${city}${district}${street}${number}号${building}栋${room}室`;
}

// 随机生成ID卡号
function randomIdCard() {
  // 简化版的随机18位号码
  let id = '';
  for (let i = 0; i < 18; i++) {
    id += randomInt(0, 9);
  }
  return id;
}

// 随机挑选多个项目
function randomMultiple(array, max = 3) {
  const count = randomInt(1, Math.min(max, array.length));
  const result = [];
  const copy = [...array];
  
  for (let i = 0; i < count; i++) {
    const index = randomInt(0, copy.length - 1);
    result.push(copy[index]);
    copy.splice(index, 1);
  }
  
  return result;
}

// 生成老年人档案数据
function generateElderlyProfiles(count = 100) {
  const profiles = [];
  const bloodTypes = ['A型', 'B型', 'AB型', 'O型'];
  const genders = ['男', '女'];
  const emergencyContactTypes = ['子女', '配偶', '亲戚', '朋友'];
  
  for (let i = 0; i < count; i++) {
    const birthYear = randomInt(1930, 1960);
    const birthMonth = randomInt(1, 12);
    const birthDay = randomInt(1, 28);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const name = firstName + lastName;
    
    profiles.push({
      id: i + 1,
      name,
      gender: randomItem(genders),
      age: new Date().getFullYear() - birthYear,
      birthDate: formatDate(birthDate),
      idCard: randomIdCard(),
      phone: randomPhone(),
      address: randomAddress(),
      bloodType: randomItem(bloodTypes),
      entryDate: formatDate(randomDate(new Date(2020, 0, 1))),
      healthStatus: randomItem(healthStatus),
      chronicDiseases: randomMultiple(commonDiseases),
      dietaryRestrictions: randomMultiple(dietTypes, 2),
      emergencyContact: {
        name: randomItem(firstNames) + randomItem(lastNames),
        relationship: randomItem(emergencyContactTypes),
        phone: randomPhone(),
      },
      careLevel: randomInt(1, 5),
      roomNumber: `${randomInt(1, 6)}0${randomInt(1, 9)}`,
      medications: randomMultiple(medicationTypes, 4),
      notes: `${name}老人${randomItem(['性格开朗', '喜欢安静', '热爱下棋', '擅长书法', '喜欢园艺', '爱看电视', '健谈'])}，${randomItem(['行动能力良好', '需要轮椅辅助', '行动略有不便', '可以自理生活'])}。`,
    });
  }
  
  return profiles;
}

// 生成健康监测数据
function generateHealthData(elderlyProfiles, days = 30) {
  const data = [];
  const currentDate = new Date();
  
  elderlyProfiles.forEach(elderly => {
    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      // 为每个老人生成随机健康数据
      data.push({
        id: data.length + 1,
        elderlyId: elderly.id,
        elderlyName: elderly.name,
        date: formatDate(date),
        bloodPressureHigh: randomInt(100, 160),
        bloodPressureLow: randomInt(60, 100),
        heartRate: randomInt(55, 100),
        bloodSugar: (randomInt(40, 120) / 10).toFixed(1),
        temperature: (36 + randomInt(0, 20) / 10).toFixed(1),
        weight: (45 + randomInt(0, 40)).toFixed(1),
        sleepHours: randomInt(4, 10),
        moodStatus: randomItem(['良好', '平稳', '低落', '焦虑', '烦躁']),
        painLevel: randomInt(0, 5),
        medications: randomMultiple(medicationTypes, 3),
        notes: randomItem(['一切正常', '睡眠质量较差', '食欲不佳', '情绪波动', '有轻微不适', '精神状态良好', ''])
      });
    }
  });
  
  return data;
}

// 生成护理服务数据
function generateCareServices(elderlyProfiles, days = 30) {
  const data = [];
  const currentDate = new Date();
  const serviceTypes = ['日常照护', '药物管理', '健康检查', '康复训练', '心理辅导', '陪同就医', '个人卫生'];
  
  elderlyProfiles.forEach(elderly => {
    // 每个老人每天可能有0-3项服务
    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      const serviceCount = randomInt(0, 3);
      for (let j = 0; j < serviceCount; j++) {
        data.push({
          id: data.length + 1,
          elderlyId: elderly.id,
          elderlyName: elderly.name,
          serviceType: randomItem(serviceTypes),
          serviceDate: formatDate(date),
          startTime: `${randomInt(8, 20)}:${randomInt(0, 5)}${randomInt(0, 9)}`,
          duration: `${randomInt(10, 90)}分钟`,
          staffName: randomItem(firstNames) + randomItem(lastNames),
          staffRole: randomItem(medicalStaff),
          status: randomItem(['已完成', '已取消', '待执行']),
          notes: randomItem(['按计划完成', '老人状态良好', '需要加强关注', '服务调整', '老人很满意', '老人情绪不佳', ''])
        });
      }
    }
  });
  
  return data;
}

// 生成药物管理数据
function generateMedications(elderlyProfiles) {
  const data = [];
  
  elderlyProfiles.forEach(elderly => {
    // 每个老人有1-5种药物
    const medicationCount = randomInt(1, 5);
    for (let i = 0; i < medicationCount; i++) {
      const medicationType = randomItem(medicationTypes);
      
      data.push({
        id: data.length + 1,
        elderlyId: elderly.id,
        elderlyName: elderly.name,
        medicationName: medicationType,
        dosage: `${randomInt(1, 3)}${randomItem(dosageUnits)}`,
        frequency: randomItem(['每天一次', '每天两次', '每天三次', '需要时服用', '每周三次']),
        timeOfDay: randomMultiple(medicationTime, 3),
        startDate: formatDate(randomDate(new Date(2022, 0, 1))),
        endDate: randomInt(1, 5) > 1 ? formatDate(randomDate(new Date(), new Date(2025, 11, 31))) : '长期服用',
        prescribedBy: randomItem(firstNames) + randomItem(lastNames) + '医生',
        notes: randomItem(['饭后服用', '忌酒', '不可嚼碎', '需空腹服用', '可能导致嗜睡', '']),
        sideEffects: randomItem(['头晕', '恶心', '疲劳', '无明显副作用', '轻微胃部不适', '']),
        stock: randomInt(10, 100),
        status: randomItem(['正在使用', '即将耗尽', '已停用', '需要补充'])
      });
    }
  });
  
  return data;
}

// 生成活动管理数据
function generateActivities(days = 30) {
  const data = [];
  const currentDate = new Date();
  const locations = ['活动室', '花园', '多功能厅', '康复中心', '户外场地', '阅览室'];
  
  for (let i = -5; i < days; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    
    // 每天1-3个活动
    const activityCount = randomInt(1, 3);
    for (let j = 0; j < activityCount; j++) {
      const activityType = randomItem(activityTypes);
      const startHour = randomInt(9, 16);
      const endHour = startHour + randomInt(1, 2);
      
      data.push({
        id: data.length + 1,
        activityName: activityType,
        description: `为老年人提供${activityType}，增强身心健康。`,
        date: formatDate(date),
        startTime: `${startHour}:${randomInt(0, 5)}0`,
        endTime: `${endHour}:${randomInt(0, 5)}0`,
        location: randomItem(locations),
        organizer: randomItem(firstNames) + randomItem(lastNames),
        maxParticipants: randomInt(10, 30),
        currentParticipants: randomInt(5, 20),
        status: i < 0 ? '已结束' : (i === 0 ? '进行中' : '未开始'),
        equipmentNeeded: randomItem(['无特殊要求', '需准备座椅', '需准备投影设备', '需准备音响设备']),
        notes: randomItem(['适合各年龄段老人', '行动不便老人需陪同', '需提前报名', '欢迎家属参加', ''])
      });
    }
  }
  
  return data;
}

// 生成营养管理数据
function generateNutritionPlans(elderlyProfiles) {
  const data = [];
  const mealTypes = ['早餐', '午餐', '晚餐', '加餐'];
  const foodCategories = ['主食', '肉类', '蔬菜', '水果', '汤', '点心', '饮品'];
  const foods = {
    '主食': ['米饭', '面条', '馒头', '粥', '花卷', '面包'],
    '肉类': ['鱼肉', '鸡肉', '瘦猪肉', '牛肉', '豆腐', '鸡蛋'],
    '蔬菜': ['青菜', '胡萝卜', '土豆', '西红柿', '茄子', '白菜', '黄瓜'],
    '水果': ['苹果', '香蕉', '橙子', '梨', '西瓜', '葡萄'],
    '汤': ['蔬菜汤', '鸡汤', '鱼汤', '番茄汤', '紫菜汤'],
    '点心': ['蛋糕', '饼干', '酸奶', '水果沙拉'],
    '饮品': ['牛奶', '豆浆', '茶', '果汁', '温水']
  };
  
  elderlyProfiles.forEach(elderly => {
    // 为每个老人生成一天的营养计划
    const dietPlan = {
      elderlyId: elderly.id,
      elderlyName: elderly.name,
      dietType: elderly.dietaryRestrictions.length > 0 ? elderly.dietaryRestrictions[0] : '普通饮食',
      calorieIntake: `${randomInt(1500, 2200)}千卡`,
      specialRequirements: elderly.dietaryRestrictions.join('、'),
      lastUpdated: formatDate(randomDate()),
      dailyMeals: []
    };
    
    // 三餐+加餐
    mealTypes.forEach(mealType => {
      const meal = {
        type: mealType,
        time: mealType === '早餐' ? '7:30' : (mealType === '午餐' ? '12:00' : (mealType === '晚餐' ? '18:00' : '15:00')),
        items: []
      };
      
      // 根据餐类型添加不同数量的食物
      const categories = mealType === '加餐' ? 
        ['点心', '饮品', '水果'] : 
        ['主食', '肉类', '蔬菜', '汤', '饮品'];
      
      categories.forEach(category => {
        if (Math.random() > 0.2) { // 80%的概率添加这个类别的食物
          meal.items.push({
            category,
            name: randomItem(foods[category]),
            portion: `${randomInt(1, 3)}${category === '饮品' ? '杯' : '份'}`
          });
        }
      });
      
      dietPlan.dailyMeals.push(meal);
    });
    
    data.push(dietPlan);
  });
  
  return data;
}

// 生成警报信息数据
function generateAlerts(elderlyProfiles, days = 30) {
  const data = [];
  const currentDate = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    
    // 每天生成随机数量的警报
    const alertCount = randomInt(0, 5);
    for (let j = 0; j < alertCount; j++) {
      const elderly = randomItem(elderlyProfiles);
      const alertType = randomItem(alertTypes);
      const alertLevel = randomItem(alertLevels);
      
      const hour = randomInt(0, 23);
      const minute = randomInt(0, 59);
      date.setHours(hour, minute);
      
      data.push({
        id: data.length + 1,
        elderlyId: elderly.id,
        elderlyName: elderly.name,
        timestamp: date.toISOString(),
        alertType,
        alertLevel,
        description: `${elderly.name}${randomItem([
          '血压异常，需要关注',
          '出现摔倒情况，已处理',
          '情绪异常波动，建议心理疏导',
          '未按时服药，已提醒',
          '离开区域，已找回',
          '体温异常，需观察',
          '睡眠质量差，建议调整'])}`,
        location: `${randomInt(1, 6)}号楼${randomInt(1, 6)}0${randomInt(1, 9)}房间`,
        status: randomItem(['待处理', '处理中', '已解决', '已关闭']),
        respondedBy: Math.random() > 0.3 ? randomItem(firstNames) + randomItem(lastNames) : '',
        responseTime: Math.random() > 0.3 ? randomInt(1, 30) + '分钟' : '',
        notes: randomItem(['需持续关注', '情况已稳定', '家属已通知', '需转医院检查', '日常波动，属正常范围', ''])
      });
    }
  }
  
  return data;
}

// 生成工作人员数据
function generateStaff(count = 30) {
  const data = [];
  const departments = ['医疗部', '护理部', '康复部', '营养部', '活动部', '行政部', '安保部'];
  const positions = {
    '医疗部': ['主任医师', '副主任医师', '主治医师', '住院医师'],
    '护理部': ['护士长', '主管护师', '护师', '护士'],
    '康复部': ['康复师', '理疗师', '按摩师', '康复技师'],
    '营养部': ['营养师', '厨师长', '厨师', '配餐员'],
    '活动部': ['活动主管', '活动策划', '社工', '志愿者协调员'],
    '行政部': ['行政主管', '人事专员', '财务专员', '前台接待'],
    '安保部': ['安保主管', '保安', '设施维护员', '监控员']
  };
  const educations = ['大专', '本科', '硕士', '博士', '中专'];
  const certificates = {
    '医疗部': ['执业医师资格证', '医学专业技术资格证'],
    '护理部': ['护士执业证书', '护理专业技术资格证'],
    '康复部': ['康复治疗师资格证', '物理治疗师证书'],
    '营养部': ['营养师资格证', '食品安全管理证'],
    '活动部': ['社会工作者证书', '心理咨询师证书'],
    '行政部': ['人力资源管理师证', '会计证'],
    '安保部': ['保安员证', '消防安全管理证']
  };
  
  for (let i = 0; i < count; i++) {
    const gender = randomItem(['男', '女']);
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const name = firstName + lastName;
    
    const department = randomItem(departments);
    const position = randomItem(positions[department]);
    
    data.push({
      id: i + 1,
      name,
      gender,
      age: randomInt(22, 55),
      phone: randomPhone(),
      department,
      position,
      hireDate: formatDate(randomDate(new Date(2015, 0, 1))),
      education: randomItem(educations),
      certificates: randomMultiple(certificates[department]),
      workingHours: `${randomItem(['8:00', '9:00'])} - ${randomItem(['17:00', '18:00'])}`,
      workingDays: randomItem(['周一至周五', '周一至周六轮班', '四班三倒']),
      status: randomItem(['在职', '休假', '离职']),
      email: `${name}${randomInt(100, 999)}@example.com`,
      emergencyContact: {
        name: randomItem(firstNames) + randomItem(lastNames),
        relationship: randomItem(['配偶', '父母', '兄弟姐妹', '朋友']),
        phone: randomPhone()
      },
      notes: randomItem(['工作认真负责', '与老人沟通良好', '专业技能突出', '团队合作精神强', ''])
    });
  }
  
  return data;
}

// 生成访客管理数据
function generateVisitors(elderlyProfiles, days = 30) {
  const data = [];
  const currentDate = new Date();
  const visitPurposes = ['家人探访', '亲友聚会', '医疗咨询', '物品递送', '日常关心'];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    
    // 每天随机数量的访客
    const visitorCount = randomInt(1, 10);
    for (let j = 0; j < visitorCount; j++) {
      const elderly = randomItem(elderlyProfiles);
      const relation = randomItem(visitorRelations);
      
      const hour = randomInt(9, 20);
      const minute = randomInt(0, 59);
      const duration = randomInt(30, 180);
      const inTime = `${hour}:${minute < 10 ? '0' + minute : minute}`;
      
      let outHour = hour + Math.floor((minute + duration) / 60);
      let outMinute = (minute + duration) % 60;
      const outTime = outHour <= 20 ? `${outHour}:${outMinute < 10 ? '0' + outMinute : outMinute}` : '未离开';
      
      data.push({
        id: data.length + 1,
        visitorName: randomItem(firstNames) + randomItem(lastNames),
        visitorPhone: randomPhone(),
        elderlyId: elderly.id,
        elderlyName: elderly.name,
        relationship: relation,
        visitDate: formatDate(date),
        checkInTime: inTime,
        checkOutTime: outTime === '未离开' && i > 0 ? randomItem([`${hour+1}:${minute < 10 ? '0' + minute : minute}`, `${hour+2}:${minute < 10 ? '0' + minute : minute}`]) : outTime,
        visitPurpose: randomItem(visitPurposes),
        broughtItems: Math.random() > 0.5 ? randomItem(['水果', '食品', '衣物', '药品', '书籍', '生活用品']) : '',
        approvedBy: randomItem(firstNames) + randomItem(lastNames),
        notes: randomItem(['访客按规定时间探访', '老人情绪良好', '家属对服务表示满意', '建议增加探访时间', ''])
      });
    }
  }
  
  return data;
}

// 生成库存管理数据
function generateInventory() {
  const data = [];
  const categories = ['医疗用品', '护理用品', '清洁用品', '办公用品', '食品', '活动器材', '家具设备'];
  const units = ['个', '盒', '瓶', '包', '套', '箱', '台'];
  const suppliers = ['安康医疗', '康乐护理', '洁美清洁', '优办文具', '鲜美食品', '乐活器材', '舒适家具'];
  const storageLocations = ['医疗室', '护士站', '仓库A', '仓库B', '厨房', '活动室', '办公室'];
  
  const items = {
    '医疗用品': ['血压计', '血糖仪', '温度计', '听诊器', '创可贴', '绷带', '口罩', '手套', '消毒液'],
    '护理用品': ['尿不湿', '护理垫', '湿巾', '洗发水', '沐浴露', '护手霜', '牙刷', '牙膏', '洗脸盆'],
    '清洁用品': ['洗衣粉', '洗洁精', '拖把', '扫帚', '垃圾袋', '抹布', '洁厕剂', '空气清新剂'],
    '办公用品': ['打印纸', '签字笔', '文件夹', '便利贴', '订书机', '复印纸', '墨盒', '记事本'],
    '食品': ['大米', '面粉', '食用油', '调味料', '饼干', '奶粉', '水果', '蔬菜'],
    '活动器材': ['棋牌', '球类', '画笔', '纸张', '乐器', 'DVD', '投影仪', '音响'],
    '家具设备': ['床', '轮椅', '助行器', '坐便椅', '沙发', '桌椅', '柜子', '灯具']
  };
  
  // 为每个类别生成多个物品
  categories.forEach(category => {
    const categoryItems = items[category];
    categoryItems.forEach(itemName => {
      data.push({
        id: data.length + 1,
        name: itemName,
        category,
        currentStock: randomInt(10, 100),
        unit: randomItem(units),
        minimumStock: randomInt(5, 20),
        purchasePrice: randomInt(5, 500) + Math.random().toFixed(2),
        supplier: randomItem(suppliers),
        storageLocation: randomItem(storageLocations),
        lastRestockDate: formatDate(randomDate(new Date(2023, 0, 1))),
        expiryDate: category === '食品' || category === '医疗用品' ? formatDate(randomDate(new Date(), new Date(2025, 11, 31))) : '',
        status: randomItem(['充足', '需补充', '库存低', '已用尽']),
        notes: randomItem(['常用物品', '易耗品', '需定期检查', '专人管理', ''])
      });
    });
  });
  
  return data;
}

// 生成维护管理数据
function generateMaintenance(days = 60) {
  const data = [];
  const currentDate = new Date();
  const equipmentTypes = ['空调', '电视', '热水器', '洗衣机', '电梯', '水管', '电路', '门窗', '消防设备', '监控设备', '医疗设备', '厨房设备'];
  const locations = ['1号楼', '2号楼', '3号楼', '餐厅', '活动中心', '医疗中心', '办公区'];
  const issueTypes = ['故障报修', '定期检查', '设备更换', '系统升级', '清洁维护'];
  const priorities = ['紧急', '高', '中', '低'];
  const statuses = ['待处理', '处理中', '已完成', '已取消', '延期处理'];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - randomInt(0, 30));
    
    // 每天随机数量的维护任务
    const taskCount = randomInt(0, 3);
    for (let j = 0; j < taskCount; j++) {
      const equipmentType = randomItem(equipmentTypes);
      const issueType = randomItem(issueTypes);
      const priority = randomItem(priorities);
      
      const completionDays = randomInt(1, 7);
      const completionDate = new Date(date);
      completionDate.setDate(completionDate.getDate() + completionDays);
      
      // 确定状态
      let status;
      if (completionDate > currentDate) {
        status = randomItem(['待处理', '处理中', '延期处理']);
      } else {
        status = randomItem(['已完成', '已取消']);
      }
      
      data.push({
        id: data.length + 1,
        equipmentType,
        equipmentId: `${equipmentType.substr(0, 1)}${randomInt(100, 999)}`,
        location: `${randomItem(locations)}-${randomInt(101, 605)}`,
        issueDescription: `${equipmentType}${randomItem(['无法正常工作', '需要更换零件', '定期维护', '运行异常', '老化严重', '影响使用'])}`,
        reportDate: formatDate(date),
        reportedBy: randomItem(firstNames) + randomItem(lastNames),
        issueType,
        priority,
        assignedTo: randomItem(firstNames) + randomItem(lastNames),
        plannedCompletionDate: formatDate(completionDate),
        actualCompletionDate: status === '已完成' ? formatDate(completionDate) : '',
        status,
        cost: status === '已完成' ? `¥${randomInt(50, 2000)}` : '',
        notes: randomItem(['需要专业人员处理', '建议更换新设备', '简单维修即可', '需订购配件', '已联系厂商', ''])
      });
    }
  }
  
  return data;
}

// 生成文档管理数据
function generateDocuments() {
  const data = [];
  const documentTypes = ['规章制度', '合同协议', '医疗记录', '活动计划', '政策文件', '工作报告', '培训材料', '操作手册'];
  const fileFormats = ['PDF', 'Word', 'Excel', 'Image', 'PPT'];
  const securityLevels = ['公开', '内部', '保密', '机密'];
  const statuses = ['已审批', '待审批', '需修订', '已归档', '已过期'];
  
  documentTypes.forEach(type => {
    // 每种类型生成多个文档
    const docCount = randomInt(3, 8);
    for (let i = 0; i < docCount; i++) {
      const creationDate = randomDate(new Date(2020, 0, 1));
      const expiryDate = new Date(creationDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + randomInt(1, 5));
      
      data.push({
        id: data.length + 1,
        title: `${type}-${randomItem(['管理', '操作', '规范', '流程', '要求', '计划', '总结', '指南'])}`,
        documentType: type,
        fileFormat: randomItem(fileFormats),
        author: randomItem(firstNames) + randomItem(lastNames),
        creationDate: formatDate(creationDate),
        lastUpdated: formatDate(randomDate(creationDate)),
        expiryDate: formatDate(expiryDate),
        version: `${randomInt(1, 3)}.${randomInt(0, 9)}`,
        securityLevel: randomItem(securityLevels),
        status: randomItem(statuses),
        location: randomItem(['系统存储', '主任办公室', '档案室', '行政部', '医疗部']),
        keywords: randomMultiple(['养老', '医疗', '护理', '管理', '安全', '服务', '质量', '标准', '评估', '应急'], 3).join('、'),
        description: `关于${type}的详细说明文档，包含相关规范和指导。`,
        notes: randomItem(['需定期更新', '重要参考文档', '操作指导使用', '需全员培训', ''])
      });
    }
  });
  
  return data;
}

// 生成dashboard数据摘要
function generateDashboardSummary(elderlyProfiles, healthData, careServices, alerts) {
  // 计算一些统计数据
  const totalElderly = elderlyProfiles.length;
  const todayAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.timestamp);
    const today = new Date();
    return alertDate.getDate() === today.getDate() &&
           alertDate.getMonth() === today.getMonth() &&
           alertDate.getFullYear() === today.getFullYear();
  }).length;
  
  const pendingServices = careServices.filter(service => service.status === '待执行').length;
  
  // 统计各健康状态的老人数量
  const healthStatusCounts = {};
  elderlyProfiles.forEach(elderly => {
    if (!healthStatusCounts[elderly.healthStatus]) {
      healthStatusCounts[elderly.healthStatus] = 0;
    }
    healthStatusCounts[elderly.healthStatus]++;
  });
  
  // 统计各警报类型数量
  const alertTypeCounts = {};
  alerts.forEach(alert => {
    if (!alertTypeCounts[alert.alertType]) {
      alertTypeCounts[alert.alertType] = 0;
    }
    alertTypeCounts[alert.alertType]++;
  });
  
  // 生成最近7天每天的健康异常数量
  const last7Days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    
    // 模拟该天的健康异常数量
    last7Days.push({
      date: dateStr,
      count: randomInt(0, 10)
    });
  }
  
  return {
    elderlyCount: totalElderly,
    todayAlerts,
    pendingServices,
    healthStatusDistribution: Object.entries(healthStatusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / totalElderly) * 100)
    })),
    alertTypeDistribution: Object.entries(alertTypeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / alerts.length) * 100)
    })),
    healthAnomalies7Days: last7Days,
    currentOccupancyRate: Math.round(totalElderly / randomInt(totalElderly, totalElderly + 20) * 100),
    avgCareHoursPerElderly: Math.round(randomInt(20, 50) / 10) + '小时/天',
    medicationCompliance: randomInt(85, 98) + '%',
    residentSatisfaction: randomInt(85, 98) + '%',
    quickStats: {
      activeActivities: randomInt(3, 8),
      bedsAvailable: randomInt(5, 15),
      staffOnDuty: randomInt(8, 20),
      mealsServedToday: totalElderly * 3
    }
  };
}

// 创建目录（如果不存在）
function ensureDirectoryExists(directory) {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  } catch (err) {
    console.error(`Error creating directory ${directory}: ${err.message}`);
  }
}

// 保存数据到文件
function saveDataToFile(data, fileName) {
  const dataDirectory = path.join(__dirname, '../data');
  ensureDirectoryExists(dataDirectory);
  
  const filePath = path.join(dataDirectory, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data saved to ${filePath}`);
  } catch (err) {
    console.error(`Error saving data to ${filePath}: ${err.message}`);
  }
}

// 生成所有数据
function generateAllData() {
  console.log('Generating data...');
  
  // 生成老人档案
  const elderlyProfiles = generateElderlyProfiles(50);
  saveDataToFile(elderlyProfiles, 'elderly-profiles.json');
  
  // 生成健康监测数据
  const healthData = generateHealthData(elderlyProfiles.slice(0, 10), 30);
  saveDataToFile(healthData, 'health-data.json');
  
  // 生成护理服务数据
  const careServices = generateCareServices(elderlyProfiles, 3);
  saveDataToFile(careServices, 'care-services.json');
  
  // 生成药物管理数据
  const medications = generateMedications(elderlyProfiles);
  saveDataToFile(medications, 'medications.json');
  
  // 生成活动管理数据
  const activities = generateActivities(30);
  saveDataToFile(activities, 'activities.json');
  
  // 生成营养管理数据
  const nutritionPlans = generateNutritionPlans(elderlyProfiles);
  saveDataToFile(nutritionPlans, 'nutrition-plans.json');
  
  // 生成警报信息数据
  const alerts = generateAlerts(elderlyProfiles, 30);
  saveDataToFile(alerts, 'alerts.json');
  
  // 生成工作人员数据
  const staff = generateStaff(30);
  saveDataToFile(staff, 'staff.json');
  
  // 生成访客管理数据
  const visitors = generateVisitors(elderlyProfiles, 30);
  saveDataToFile(visitors, 'visitors.json');
  
  // 生成库存管理数据
  const inventory = generateInventory();
  saveDataToFile(inventory, 'inventory.json');
  
  // 生成维护管理数据
  const maintenance = generateMaintenance(60);
  saveDataToFile(maintenance, 'maintenance.json');
  
  // 生成文档管理数据
  const documents = generateDocuments();
  saveDataToFile(documents, 'documents.json');
  
  // 生成仪表盘摘要数据
  const dashboardSummary = generateDashboardSummary(elderlyProfiles, healthData, careServices, alerts);
  saveDataToFile(dashboardSummary, 'dashboard-summary.json');
  
  console.log('All data generated successfully!');
}

// 导出函数
module.exports = {
  generateAllData,
  generateElderlyProfiles,
  generateHealthData,
  generateCareServices,
  generateMedications,
  generateActivities,
  generateNutritionPlans,
  generateAlerts,
  generateStaff,
  generateVisitors,
  generateInventory,
  generateMaintenance,
  generateDocuments,
  generateDashboardSummary
};