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
    currentTheme: 'cool',
    showAddExpense: false,
    animatePopup: false,
    isClosing: false,
    expenseList: [] as any[],
    addData: {
      categories: ['餐饮', '购物', '交通', '娱乐', '居家', '通讯', '服饰', '医疗'],
      selectedCategory: '',
      amount: '',
      remark: '',
      moods: [
        { icon: '😊', name: '开心' },
        { icon: '😢', name: '难过' },
        { icon: '😡', name: '生气' },
        { icon: '😌', name: '放松' },
        { icon: '🤔', name: '思考' },
        { icon: '😴', name: '疲惫' },
        { icon: '🥳', name: '兴奋' },
        { icon: '😎', name: '得意' }
      ],
      selectedMood: ''
    },
    showRecordDetail: false,
    animateDetail: false,
    selectedExpenseIndex: -1,
    detailExpense: null as any
  },

  onLoad() {
    // 从本地存储读取主题设置
    const theme = wx.getStorageSync('theme') || 'cool';
    this.setData({ currentTheme: theme });

    // 从本地存储读取支出记录
    const expenseList = wx.getStorageSync('expenseList') || [];
    this.setData({ expenseList });
  },

  // 切换主题
  switchTheme() {
    const newTheme = this.data.currentTheme === 'cool' ? 'warm' : 'cool';
    this.setData({ currentTheme: newTheme });
    wx.setStorageSync('theme', newTheme);
  },

  // 返回首页
  goToIndex() {
    wx.navigateBack();
  },

  // 打开添加支出弹窗
  addExpense() {
    this.setData({
      showAddExpense: true,
      isClosing: false,
      'addData.selectedCategory': '',
      'addData.amount': '',
      'addData.remark': '',
      'addData.selectedMood': ''
    }, () => {
      setTimeout(() => {
        this.setData({ animatePopup: true });
      }, 50);
    });
  },

  // 关闭添加支出弹窗
  closeAdd() {
    this.setData({
      animatePopup: false,
      isClosing: true
    });
    setTimeout(() => {
      this.setData({
        showAddExpense: false,
        isClosing: false
      });
    }, 300);
  },

  // 选择支出分类
  selectCategory(e: any) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      'addData.selectedCategory': category
    });
  },

  // 输入金额
  onAmountInput(e: any) {
    let value = e.detail.value;
    // 限制只能输入数字和小数点
    value = value.replace(/[^\d.]/g, '');
    // 限制只能有一个小数点
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    // 限制小数点后最多两位
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    this.setData({
      'addData.amount': value
    });
  },

  // 输入备注
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

  // 提交支出记录
  submitExpense() {
    const { selectedCategory, amount, remark, selectedMood } = this.data.addData;
    
    if (!selectedCategory) {
      wx.showToast({
        title: '请选择支出分类',
        icon: 'none'
      });
      return;
    }
    
    if (!amount) {
      wx.showToast({
        title: '请输入支出金额',
        icon: 'none'
      });
      return;
    }

    const newExpense = {
      category: selectedCategory,
      amount: parseFloat(amount).toFixed(2),
      description: remark || '未添加备注',
      icon: selectedMood || '🤔',
      time: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const expenseList = [newExpense, ...this.data.expenseList];
    this.setData({ expenseList });
    wx.setStorageSync('expenseList', expenseList);

    this.closeAdd();
    wx.showToast({
      title: '记录成功',
      icon: 'success'
    });
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
    this.setData({
      showRecordDetail: false,
      showAddExpense: true,
      isClosing: false,
      'addData.selectedCategory': expense.category,
      'addData.amount': expense.amount,
      'addData.remark': expense.description === '未添加备注' ? '' : expense.description,
      'addData.selectedMood': expense.icon
    }, () => {
      setTimeout(() => {
        this.setData({ animatePopup: true });
      }, 50);
    });

    // 删除原记录
    const expenseList = this.data.expenseList;
    expenseList.splice(this.data.selectedExpenseIndex, 1);
    this.setData({ expenseList });
    wx.setStorageSync('expenseList', expenseList);
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
  }
}); 