// 支出记录类型定义
interface ExpenseRecord {
  category: string;
  amount: string;
  description: string;
  icon: string;
  time: string;
}

interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

Page({
  data: {
    currentTheme: 'default',
    currentDateRange: '',
    totalExpense: '0.00',
    categoryExpenses: [] as CategoryExpense[],
    expenseList: [] as ExpenseRecord[],
    showRecordDetail: false,
    animateDetail: false,
    selectedExpenseIndex: -1,
    detailExpense: null as ExpenseRecord | null,
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
      selectedMood: '',
      isModifying: false,
      modifyIndex: -1
    },
    categoryColors: [
      '#B58F67', // 暖棕色
      '#C04851', // 玫瑰红
      '#8B7355', // 深棕色
      '#9D5353', // 红棕色
      '#8E4155', // 酒红色
    ],
    pieChartContext: null as WechatMiniprogram.CanvasContext | null,
    selectedCategoryIndex: -1,
  },

  onLoad() {
    // 从本地存储读取主题设置
    const savedTheme = wx.getStorageSync('app_theme') || 'default';
    this.setData({ currentTheme: savedTheme });

    // 从本地存储读取支出记录
    const expenseList = wx.getStorageSync('expenseList') || [];
    this.setData({ expenseList });

    // 初始化当前周期
    this.initCurrentWeek();
    // 计算统计数据
    this.calculateStatistics();
  },

  onShow() {
    // 同步主题
    const savedTheme = wx.getStorageSync('app_theme') || 'default';
    if (this.data.currentTheme !== savedTheme) {
      this.setData({ currentTheme: savedTheme });
    }
    // 同步支出记录，并重新计算统计数据
    const expenseList = wx.getStorageSync('expenseList') || [];
    this.setData({ expenseList }, () => {
      this.calculateStatistics();
    });

    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  // 初始化当前周期
  initCurrentWeek() {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 7));
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    this.setData({
      currentDateRange: `${formatDate(weekStart)} ~ ${formatDate(weekEnd)}`
    });
  },

  // 切换日期范围
  switchDateRange() {
    // 这里可以添加日期选择器的逻辑
    wx.showToast({
      title: '日期选择功能开发中',
      icon: 'none'
    });
  },

  // 计算统计数据
  calculateStatistics() {
    const { expenseList, categoryColors } = this.data;
    
    // 计算总支出
    const total = expenseList.reduce((sum, item) => {
      return sum + Number(item.amount);
    }, 0);

    // 按分类统计支出
    const categoryMap = new Map<string, number>();
    expenseList.forEach(item => {
      const current = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, current + Number(item.amount));
    });

    // 转换为数组并计算百分比
    const categoryExpenses: CategoryExpense[] = Array.from(categoryMap.entries()).map(([category, amount], index) => ({
      category,
      amount,
      percentage: Math.round((amount / total) * 100),
      color: categoryColors[index % categoryColors.length]
    }));

    // 更新数据
    this.setData({
      totalExpense: total.toFixed(2),
      categoryExpenses: categoryExpenses.sort((a, b) => b.amount - a.amount)
    }, () => {
      this.drawPieChart();
    });
  },

  // 绘制饼图
  drawPieChart() {
    try {
      const query = wx.createSelectorQuery();
      query.select('#pieChart')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]) {
            console.error('Failed to get canvas node');
            return;
          }

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const { categoryExpenses, selectedCategoryIndex } = this.data;
          
          console.log('Drawing pie chart, categoryExpenses:', categoryExpenses);
          
          // 设置canvas尺寸
          const width = res[0].width;
          const height = res[0].height;
          canvas.width = width;
          canvas.height = height;
          
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(centerX, centerY) * 0.8;

          let startAngle = -Math.PI / 2;

          // 清空画布
          ctx.clearRect(0, 0, width, height);

          categoryExpenses.forEach((category, index) => {
            const endAngle = startAngle + (category.percentage / 100) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();

            if (index === selectedCategoryIndex) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
              ctx.shadowOffsetX = 5;
              ctx.shadowOffsetY = 5;
            }

            ctx.fillStyle = category.color;
            ctx.fill();

            if (index === selectedCategoryIndex) {
              ctx.shadowBlur = 0;
              ctx.shadowColor = 'transparent';
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
            }

            startAngle = endAngle;
          });

          // 绘制中心白色圆形
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
        });
    } catch (error) {
      console.error('绘制饼图失败:', error);
    }
  },

  // 高亮显示分类
  highlightCategory(e: any) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedCategoryIndex: index }, () => {
      this.drawPieChart();
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

  // 返回首页
  goToIndex() {
    wx.vibrateShort({ type: 'light' });
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 打开新增支出记录弹窗（直接在统计页面打开）
  addExpense() {
    console.log('统计页面 addExpense triggered');
    wx.vibrateShort({ type: 'light' });
    
    // 先重置状态
    this.setData({
      showAddExpense: false,
      animatePopup: false
    }, () => {
      // 延迟显示弹窗，确保状态重置
      setTimeout(() => {
        this.setData({
          showAddExpense: true,
          'addData.selectedCategory': '餐饮',
          'addData.amount': '',
          'addData.remark': '',
          'addData.selectedMood': ''
        }, () => {
          // 确保弹窗显示后再添加动画
          setTimeout(() => {
            console.log('准备设置动画状态');
            this.setData({ 
              animatePopup: true 
            }, () => {
              console.log('动画状态已设置');
            });
          }, 50);
        });
      }, 50);
    });
  },

  // 关闭新增支出记录弹窗
  closeAdd() {
    this.setData({ 
      animatePopup: false,
      'addData.isModifying': false,
      'addData.modifyIndex': -1
    });
    setTimeout(() => {
      this.setData({ showAddExpense: false });
    }, 300);
  },

  // 选择分类
  selectCategory(e: any) {
    const category = e.currentTarget.dataset.category;
    this.setData({ 'addData.selectedCategory': category });
  },

  // 金额输入
  onAmountInput(e: any) {
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
    this.setData({ 'addData.amount': value });
  },

  // 备注输入
  onRemarkInput(e: any) {
    this.setData({ 'addData.remark': e.detail.value });
  },

  // 选择心情
  selectMood(e: any) {
    const mood = e.currentTarget.dataset.mood;
    this.setData({ 'addData.selectedMood': mood });
  },

  // 提交支出记录
  submitExpense() {
    const { selectedCategory, amount, remark, selectedMood, isModifying, modifyIndex } = this.data.addData;
    if (!selectedCategory) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }
    if (!amount) {
      wx.showToast({ title: '请输入金额', icon: 'none' });
      return;
    }

    const newExpense: ExpenseRecord = {
      category: selectedCategory,
      amount: Number(amount).toFixed(2),  // 转换为number后再转为固定小数位的string
      description: remark || '未添加备注',
      icon: selectedMood || this.getCategoryIcon(selectedCategory),
      time: isModifying ? this.data.expenseList[modifyIndex].time : this.getCurrentTime()
    };

    let expenseList = [...this.data.expenseList];
    
    if (isModifying) {
      // 修改现有记录
      expenseList[modifyIndex] = newExpense;
    } else {
      // 添加新记录
      expenseList = [newExpense, ...expenseList];
    }

    this.setData({ 
      expenseList,
      'addData.isModifying': false,
      'addData.modifyIndex': -1
    });
    
    wx.setStorageSync('expenseList', expenseList);
    this.calculateStatistics();
    this.closeAdd();
    
    wx.showToast({ 
      title: isModifying ? '修改成功' : '记录成功', 
      icon: 'success', 
      duration: 1500 
    });
  },

  // 获取分类对应默认图标
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

  // 打开记录详情
  openRecordDetail(e: any) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      showRecordDetail: true,
      selectedExpenseIndex: index,
      detailExpense: this.data.expenseList[index]
    }, () => {
      setTimeout(() => {
        this.setData({ animateDetail: true });
      }, 50);
    });
  },

  // 关闭记录详情
  closeRecordDetail() {
    this.setData({
      animateDetail: false
    });
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
    const expense = this.data.detailExpense;
    const index = this.data.selectedExpenseIndex;
    
    if (!expense) return;  // 添加null检查
    
    // 先关闭详情弹窗
    this.setData({
      animateDetail: false
    });
    
    setTimeout(() => {
      this.setData({
        showRecordDetail: false,
        selectedExpenseIndex: -1,
        detailExpense: null,
        // 打开修改弹窗
        showAddExpense: true,
        animatePopup: false,
        'addData.selectedCategory': expense.category,
        'addData.amount': expense.amount,
        'addData.remark': expense.description === '未添加备注' ? '' : expense.description,
        'addData.selectedMood': expense.icon,
        'addData.isModifying': true,
        'addData.modifyIndex': index
      }, () => {
        setTimeout(() => {
          this.setData({ animatePopup: true });
        }, 50);
      });
    }, 300);
  },

  // 删除记录
  deleteRecord() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmText: '删除',
      confirmColor: '#ff6b6b',
      success: (res) => {
        if (res.confirm) {
          const expenseList = this.data.expenseList;
          expenseList.splice(this.data.selectedExpenseIndex, 1);
          this.setData({ expenseList });
          wx.setStorageSync('expenseList', expenseList);
          
          // 重新计算统计数据
          this.calculateStatistics();
          
          this.closeRecordDetail();
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  // 添加 onReady 方法
  onReady() {
    // 如果没有支出记录，添加一条测试数据
    if (this.data.expenseList.length === 0) {
      this.setData({
        expenseList: [{
          category: '测试',
          amount: '100.00',
          description: '测试数据',
          icon: '💰',
          time: '12:00'
        }]
      }, () => {
        console.log('Test expense data inserted');
        this.calculateStatistics();
      });
    } else {
      this.drawPieChart();
    }
  },
}); 