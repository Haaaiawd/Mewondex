Page({
  data: {
    currentTheme: 'default',
    categories: ['餐饮', '交通', '购物', '娱乐', '其他'],
    selectedCategory: '',
    amount: '',
    remark: '',
    moods: [
      { icon: '🍜', name: '用餐' },
      { icon: '☕', name: '咖啡' },
      { icon: '🍷', name: '酒水' },
      { icon: '🎮', name: '游戏' },
      { icon: '⚽', name: '运动' },
      { icon: '🎬', name: '电影' },
      { icon: '📚', name: '学习' },
      { icon: '💡', name: '灵感' }
    ],
    selectedMood: '',
    isClosing: false
  },

  onLoad() {
    // 加载保存的主题设置
    const savedTheme = wx.getStorageSync('app_theme') || 'default';
    this.setData({ 
      currentTheme: savedTheme,
      selectedCategory: '餐饮' // 默认选中餐饮分类
    });
  },

  // 选择分类
  selectCategory(e: any) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: category
    });
  },

  // 金额输入
  onAmountInput(e: any) {
    let value = e.detail.value;
    // 限制只能输入数字和小数点
    value = value.replace(/[^\d.]/g, '');
    // 限制只能有一个小数点
    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1) {
      const dotCount = value.split('.').length - 1;
      if (dotCount > 1) {
        value = value.substring(0, value.lastIndexOf('.'));
      }
      // 限制小数点后两位
      const decimal = value.substring(dotIndex + 1);
      if (decimal.length > 2) {
        value = value.substring(0, dotIndex + 3);
      }
    }
    this.setData({
      amount: value
    });
  },

  // 备注输入
  onRemarkInput(e: any) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 选择心情
  selectMood(e: any) {
    const mood = e.currentTarget.dataset.mood;
    this.setData({
      selectedMood: mood
    });
  },

  // 提交支出
  submitExpense() {
    const { selectedCategory, amount, remark, selectedMood } = this.data;
    
    if (!selectedCategory) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none'
      });
      return;
    }
    
    if (!amount) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      });
      return;
    }

    // 添加新支出记录
    const newExpense = {
      category: selectedCategory,
      amount: parseFloat(amount),
      description: remark,
      icon: selectedMood || this.getCategoryIcon(selectedCategory),
      time: this.getCurrentTime()
    };

    // TODO: 保存到全局数据或存储中
    console.log('新增支出:', newExpense);

    // 提示成功
    wx.showToast({
      title: '已记录支出',
      icon: 'success',
      duration: 1500
    });

    // 关闭页面
    this.closeAdd();
  },

  // 获取分类对应的默认图标
  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      '娱乐': '🎮',
      '餐饮': '🍜',
      '教育': '📚',
      '日常': '📝'
    };
    return iconMap[category] || '💰';
  },

  // 获取当前时间
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  // 关闭页面
  closeAdd() {
    this.setData({ isClosing: true });
    setTimeout(() => {
      wx.navigateBack();
    }, 300);
  }
}); 