Page({
  data: {
    currentTheme: 'default',
    showAddExpense: false,
    animatePopup: false,
    addData: {
      categories: ['餐饮', '交通', '购物', '娱乐', '其他'],
      selectedCategory: '餐饮',
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
      selectedMood: ''
    }
  },

  onLoad() {
    const savedTheme = wx.getStorageSync('app_theme') || 'default';
    this.setData({ currentTheme: savedTheme });
  },

  switchTheme() {
    const { currentTheme } = this.data;
    const newTheme = currentTheme === 'default' ? 'warm' : 'default';
    
    wx.vibrateShort({ type: 'light' });
    
    this.setData({ 
      currentTheme: newTheme 
    });
    
    wx.setStorageSync('app_theme', newTheme);
    
    wx.showToast({
      title: newTheme === 'warm' ? '已切换暖棕主题' : '已恢复默认主题',
      icon: 'none',
      duration: 1500
    });
  },

  goToIndex() {
    wx.navigateBack();
  },

  addExpense() {
    wx.vibrateShort({ type: 'light' });

    this.setData({
      showAddExpense: true,
      animatePopup: false,
      'addData.selectedCategory': '餐饮',
      'addData.amount': '',
      'addData.remark': '',
      'addData.selectedMood': ''
    });

    setTimeout(() => {
      this.setData({ animatePopup: true });
    }, 50);
  },

  closeAdd() {
    this.setData({ animatePopup: false });
    setTimeout(() => {
      this.setData({ showAddExpense: false });
    }, 300);
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      'addData.selectedCategory': category
    });
  },

  onAmountInput(e) {
    let value = e.detail.value;
    value = value.replace(/[^\d.]/g, '');
    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1) {
      const dotCount = value.split('.').length - 1;
      if (dotCount > 1) {
        value = value.substring(0, value.lastIndexOf('.'));
      }
      const decimal = value.substring(dotIndex + 1);
      if (decimal.length > 2) {
        value = value.substring(0, dotIndex + 3);
      }
    }
    this.setData({
      'addData.amount': value
    });
  },

  onRemarkInput(e) {
    this.setData({
      'addData.remark': e.detail.value
    });
  },

  selectMood(e) {
    const mood = e.currentTarget.dataset.mood;
    this.setData({
      'addData.selectedMood': mood
    });
  },

  submitExpense() {
    const { selectedCategory, amount, remark, selectedMood } = this.data.addData;
    
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

    const newExpense = {
      category: selectedCategory,
      amount: parseFloat(amount).toFixed(2),
      description: remark || '未添加备注',
      icon: selectedMood || this.getCategoryIcon(selectedCategory),
      time: this.getCurrentTime()
    };

    let expenseList = wx.getStorageSync('expenseList') || [];
    expenseList = [newExpense, ...expenseList];
    wx.setStorageSync('expenseList', expenseList);

    wx.showToast({
      title: '已记录支出',
      icon: 'success',
      duration: 1500
    });

    this.closeAdd();
  },

  getCategoryIcon(category) {
    const iconMap = {
      '娱乐': '🎮',
      '餐饮': '🍜',
      '交通': '🚗',
      '购物': '🛍️',
      '其他': '📝'
    };
    return iconMap[category] || '💰';
  },

  getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}); 