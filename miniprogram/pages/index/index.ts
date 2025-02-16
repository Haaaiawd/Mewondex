Page({
  data: {
    categories: ['全部', '娱乐', '餐饮', '教育', '日常'],
    activeCategory: '全部',
    totalExpense: 1337.5,
    expenseCount: 6,
    expenseList: [
      {
        icon: '🍽',
        category: '餐饮',
        description: '跟同事中午去吃西餐。',
        amount: 140,
        time: '12:45'
      },
      {
        icon: '📚',
        category: '教育',
        description: '买编程课，投资一下自己。',
        amount: 799,
        time: '09:16'
      },
      {
        icon: '☕',
        category: '餐饮',
        description: '今日份咖啡。',
        amount: 27,
        time: '08:49'
      }
    ]
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  // 切换分类
  switchCategory(e: any) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    });
  },

  // 添加新支出
  addExpense() {
    wx.navigateTo({
      url: '/pages/add/add'
    });
  },

  // 查看统计
  viewStats() {
    wx.navigateTo({
      url: '/pages/stats/stats'
    });
  }
}); 