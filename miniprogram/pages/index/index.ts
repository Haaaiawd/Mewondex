// 支出记录类型定义
interface ExpenseRecord {
  category: string;
  amount: string;
  description: string;
  icon: string;
  time: string;
}

Page({
  data: {
    currentTheme: 'default',
    showAddExpense: false,
    showRecordDetail: false,
    animatePopup: false,
    animateDetail: false,
    selectedExpenseIndex: -1,
    detailExpense: null as ExpenseRecord | null,
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
    },
    categories: ['全部', '餐饮', '交通', '购物', '娱乐', '其他'],
    activeCategory: '全部',
    totalExpense: '0.00',
    expenseCount: 0,
    expenseList: [] as ExpenseRecord[]
  },

  onLoad() {
    // 加载保存的主题设置
    const savedTheme = wx.getStorageSync('app_theme') || 'default';
    
    // 加载保存的支出记录
    const savedExpenseList = wx.getStorageSync('expenseList') || [];
    const totalExpense = savedExpenseList.reduce((sum: number, item: ExpenseRecord) => sum + parseFloat(item.amount), 0).toFixed(2);
    
    this.setData({ 
      currentTheme: savedTheme,
      expenseList: savedExpenseList,
      expenseCount: savedExpenseList.length,
      totalExpense
    });
  },

  onShow() {
    // 同步主题
    const savedTheme = wx.getStorageSync('app_theme') || 'default';
    if (this.data.currentTheme !== savedTheme) {
      this.setData({ currentTheme: savedTheme });
    }
    // 同步支出记录，并重新计算总支出和记录数
    const savedExpenseList = wx.getStorageSync('expenseList') || [];
    const totalExpense = savedExpenseList.reduce((sum: number, item: ExpenseRecord) => sum + parseFloat(item.amount), 0).toFixed(2);
    this.setData({
      expenseList: savedExpenseList,
      expenseCount: savedExpenseList.length,
      totalExpense
    });

    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
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
    
    // 保存设置到全局存储
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

  // 打开添加支出页面
  addExpense() {
    // 添加触感反馈
    wx.vibrateShort({ type: 'light' });

    // 重置数据并显示弹出层，初始动画状态设置为 false（即处于 slide-down 状态）
    this.setData({
      showAddExpense: true,
      animatePopup: false,
      'addData.selectedCategory': '餐饮',
      'addData.amount': '',
      'addData.remark': '',
      'addData.selectedMood': ''
    });

    // 延迟设置 animatePopup 为 true，触发 slide-up 动画
    setTimeout(() => {
      this.setData({ animatePopup: true });
    }, 50);
  },

  // 关闭添加支出页面
  closeAdd() {
    // 设置动画状态为 false，触发 slide-down 动画
    this.setData({ animatePopup: false });
    setTimeout(() => {
      this.setData({ 
        showAddExpense: false
      });
    }, 300);
  },

  // 选择分类
  selectCategory(e: any) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      'addData.selectedCategory': category
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
      'addData.amount': value
    });
  },

  // 备注输入
  onRemarkInput(e: any) {
    this.setData({
      'addData.remark': e.detail.value
    });
  },

  // 选择心情
  selectMood(e: any) {
    const mood = e.currentTarget.dataset.mood;
    this.setData({
      'addData.selectedMood': mood
    });
  },

  // 打开记录详情
  openRecordDetail(e: any) {
    // 将 index 转换为数字
    const index = parseInt(e.currentTarget.dataset.index, 10);
    const detailExpense = this.data.expenseList[index];
    
    this.setData({
      showRecordDetail: true,
      animateDetail: false,
      selectedExpenseIndex: index,
      detailExpense
    });

    setTimeout(() => {
      this.setData({ animateDetail: true });
    }, 50);
  },

  // 关闭记录详情
  closeRecordDetail() {
    this.setData({ animateDetail: false });
    setTimeout(() => {
      this.setData({ 
        showRecordDetail: false,
        selectedExpenseIndex: -1,
        detailExpense: null
      });
    }, 300);
  },

  // 修改记录
  modifyRecord() {
    const { detailExpense } = this.data;
    if (!detailExpense) return;
    
    this.setData({
      showAddExpense: true,
      animatePopup: false,
      'addData.selectedCategory': detailExpense.category,
      'addData.amount': detailExpense.amount,
      'addData.remark': detailExpense.description,
      'addData.selectedMood': detailExpense.icon
    });

    setTimeout(() => {
      this.setData({ animatePopup: true });
    }, 50);
    
    // 直接关闭记录详情弹窗，但不重置 selectedExpenseIndex
    this.setData({
      showRecordDetail: false,
      animateDetail: false,
      detailExpense: null
    });
  },

  // 删除记录
  deleteRecord() {
    const that = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      success(res) {
        if (res.confirm) {
          const { expenseList, selectedExpenseIndex } = that.data;
          expenseList.splice(selectedExpenseIndex, 1);
          const totalExpense = expenseList.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);

          // 更新数据
          that.setData({
            expenseList,
            totalExpense,
            expenseCount: expenseList.length
          });

          // 保存到存储
          wx.setStorageSync('expenseList', expenseList);

          // 关闭详情弹窗
          that.closeRecordDetail();

          // 提示删除成功
          wx.showToast({
            title: '已删除记录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 提交支出（新增或修改）
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

    // 准备新记录
    const newExpense = {
      category: selectedCategory,
      amount: parseFloat(amount).toFixed(2),
      description: remark || '未添加备注',
      icon: selectedMood || this.getCategoryIcon(selectedCategory),
      time: this.getCurrentTime()
    };

    let { expenseList, selectedExpenseIndex } = this.data;
    let newExpenseList = [...expenseList]; // 创建数组的副本

    // 如果是修改现有记录
    if (selectedExpenseIndex !== -1) {
      // 使用 splice 替换指定位置的记录
      newExpenseList.splice(selectedExpenseIndex, 1, newExpense);
    } else {
      // 如果是新增记录，添加到数组开头
      newExpenseList = [newExpense, ...newExpenseList];
    }

    // 计算总支出
    const totalExpense = newExpenseList.reduce((sum: number, item: ExpenseRecord) => sum + parseFloat(item.amount), 0).toFixed(2);

    // 更新数据
    this.setData({
      expenseList: newExpenseList,
      totalExpense,
      expenseCount: newExpenseList.length,
      selectedExpenseIndex: -1, // 重置选中索引
      'addData.selectedCategory': '餐饮', // 重置表单
      'addData.amount': '',
      'addData.remark': '',
      'addData.selectedMood': ''
    });

    // 保存到存储
    wx.setStorageSync('expenseList', newExpenseList);

    // 提示成功
    wx.showToast({
      title: selectedExpenseIndex !== -1 ? '已更新记录' : '已记录支出',
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
      '交通': '🚗',
      '购物': '🛍️',
      '其他': '📝'
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

  // 跳转到统计页面
  goToStats() {
    wx.vibrateShort({ type: 'light' });
    wx.switchTab({
      url: '/pages/statistics/statistics'
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 什么都不做，仅阻止事件冒泡
  }
}); 