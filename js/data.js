var CAR_DATA = [
  {
    id: 1,
    model: '星耀 EV Pro',
    booth: 'A-01',
    slots: [
      { start: '09:00', end: '10:00', presenter: '李明' },
      { start: '10:00', end: '11:00', presenter: '王芳' },
      { start: '11:00', end: '12:00', presenter: '赵磊' },
      { start: '13:00', end: '14:00', presenter: '李明' },
      { start: '14:00', end: '15:00', presenter: '王芳' },
      { start: '15:00', end: '16:00', presenter: '赵磊' },
      { start: '16:00', end: '17:00', presenter: '李明' }
    ]
  },
  {
    id: 2,
    model: '领航者 PHEV',
    booth: 'A-02',
    slots: [
      { start: '09:00', end: '10:00', presenter: '陈静' },
      { start: '10:00', end: '11:00', presenter: '刘洋' },
      { start: '11:00', end: '12:00', presenter: '张薇' },
      { start: '13:00', end: '14:00', presenter: '陈静' },
      { start: '13:30', end: '14:30', presenter: '李明' },
      { start: '14:00', end: '15:00', presenter: '刘洋' },
      { start: '15:00', end: '16:00', presenter: '张薇' },
      { start: '16:00', end: '17:00', presenter: '陈静' }
    ]
  },
  {
    id: 3,
    model: '云端 SUV',
    booth: 'B-01',
    slots: [
      { start: '09:00', end: '10:00', presenter: '周涛' },
      { start: '10:00', end: '11:00', presenter: '吴娜' },
      { start: '11:00', end: '12:00', presenter: '孙凯' },
      { start: '13:00', end: '14:00', presenter: '周涛' },
      { start: '14:00', end: '15:00', presenter: '吴娜' },
      { start: '15:00', end: '16:00', presenter: '孙凯' },
      { start: '16:00', end: '17:00', presenter: '周涛' }
    ]
  },
  {
    id: 4,
    model: '极光轿跑',
    booth: 'B-02',
    slots: [
      { start: '09:00', end: '10:00', presenter: '郑宇' },
      { start: '10:00', end: '11:00', presenter: '黄莉' },
      { start: '11:00', end: '12:00', presenter: '马超' },
      { start: '13:00', end: '14:00', presenter: '郑宇' },
      { start: '14:00', end: '15:00', presenter: '黄莉' },
      { start: '15:00', end: '16:00', presenter: '马超' },
      { start: '16:00', end: '17:00', presenter: '郑宇' }
    ]
  },
  {
    id: 5,
    model: '锐行 MPV',
    booth: 'C-01',
    slots: [
      { start: '09:00', end: '10:00', presenter: '林峰' },
      { start: '10:00', end: '11:00', presenter: '何雪' },
      { start: '11:00', end: '12:00', presenter: '徐刚' },
      { start: '13:00', end: '14:00', presenter: '林峰' },
      { start: '14:00', end: '15:00', presenter: '何雪' },
      { start: '15:00', end: '16:00', presenter: '徐刚' },
      { start: '16:00', end: '17:00', presenter: '林峰' }
    ]
  },
  {
    id: 6,
    model: '翼展越野',
    booth: 'C-02',
    slots: [
      { start: '09:00', end: '10:00', presenter: '高远' },
      { start: '10:00', end: '11:00', presenter: '罗敏' },
      { start: '11:00', end: '12:00', presenter: '谢辉' },
      { start: '13:00', end: '14:00', presenter: '高远' },
      { start: '14:00', end: '15:00', presenter: '罗敏' },
      { start: '15:00', end: '16:00', presenter: '谢辉' },
      { start: '16:00', end: '17:00', presenter: '高远' }
    ]
  }
];

var SELLING_POINTS = {
  1: [
    '续航超 700km，同级别领先',
    '全域 OTA 升级，持续进化',
    'L2+ 级智能驾驶辅助'
  ],
  2: [
    '纯电续航 150km，日常零油耗',
    '双电机四驱，百公里加速 5.8s',
    '可油可电，长途无忧'
  ],
  3: [
    '全景天幕 + 空气悬架',
    '6/7 座灵活布局',
    'NVH 静音达到图书馆级'
  ],
  4: [
    '溜背造型，风阻系数 0.23',
    '电动尾翼自动升降',
    '碳纤维内饰，运动氛围拉满'
  ],
  5: [
    '航空级座椅，第二排独立',
    '双侧电动滑门，上下车优雅',
    '三区恒温空调，全家舒适'
  ],
  6: [
    '全地形模式，涉水深度 800mm',
    '非承载式车身 + 三把锁',
    '越野蠕行 + 透明底盘'
  ]
};
