Page({
  data: {
    currentTheme: 'default',
    categories: ['全部', '餐饮', '交通', '购物', '娱乐', '其他'],
    activeCategory: '全部',
    totalExpense: '1337.50',
    expenseCount: 3,
    expenseList: [
      {
        icon: '🍜',
        category: '餐饮',
        description: '午餐面条',
        amount: '28.50',
        time: '12:30'
      },
      {
        icon: '🚌',
        category: '交通',
        description: '公交车',
        amount: '2.00',
        time: '09:15'
      },
      {
        icon: '🛍️',
        category: '购物',
        description: '超市日用品',
        amount: '76.80',
        time: '16:45'
      }
    ]
  },

  onLoad() {
    // 加载保存的主题设置
    const savedTheme = wx.getStorageSync('app_theme') || 'default';
    this.setData({ currentTheme: savedTheme });
  },

  // 切换主题
  switchTheme() {
    const { currentTheme } = this.data;
    const newTheme = currentTheme === 'default' ? 'warm' : 'default';
    
    // 添加触感反馈
    wx.vibrateShort({ type: 'light' });
    
    // 更新主题状态
    this.setData({ 
      currentTheme: newTheme 
    });
    
    // 保存设置
    wx.setStorageSync('app_theme', newTheme);
    
    // 显示切换提示
    wx.showToast({
      title: newTheme === 'warm' ? '已切换暖棕主题' : '已恢复默认主题',
      icon: 'none',
      duration: 1500
    });
  },

  // 切换分类
  switchCategory(e: any) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    });
  },

  // 添加支出
  addExpense() {
    // 添加支出的逻辑
  },

  // 查看统计
  viewStats() {
    // 查看统计的逻辑
  }
}); 