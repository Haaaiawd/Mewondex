# 喵汪记账 (Mewondex)

## 项目简介

喵汪记账是一款基于微信小程序的个人记账应用，采用 TypeScript 开发。这是我在学习小程序开发过程中的实践项目，通过跟随[0基础教你做小程序](https://raw.githubusercontent.com/Haaaiawd/Mewondex/refs/heads/main/introduce_img/0%E5%9F%BA%E7%A1%80%E5%81%9A%E4%B8%80%E6%AC%BE%E5%B0%8F%E7%A8%8B%E5%BA%8F.jpg)教程，从零开始学习并实现。

### 技术栈

- 框架：微信小程序
- 语言：TypeScript、WXSS、WXML
- 数据存储：小程序本地存储
- 图表：Canvas 2D
- 动画：CSS3 Transitions & Animations

### 开发目标

1. 掌握小程序开发基础知识
2. 学习 TypeScript 在实际项目中的应用
3. 理解数据状态管理和持久化存储
4. 实践 CSS3 动画和交互效果
5. 体验数据可视化开发

## 核心功能

### 1. 记账管理
- 支持添加、修改、删除支出记录
- 记录包含金额、分类、备注、状态和时间
- 支持表情符号标记消费状态
- 实时统计总支出和记录数量

### 2. 数据统计
- 饼图展示各类支出占比
- 支持按分类查看支出明细
- 展示支出趋势和分布
- 支持查看历史记录

### 3. 主题定制
- 内置中国古典主题（默认）
- 支持切换日系暖棕主题
- 主题切换带有平滑过渡效果
- 主题配色统一且优雅

### 4. 交互体验
- 添加记录时弹出层动画流畅
- 支持触感反馈（震动）
- 果冻按压效果
- 页面切换动画平滑

## 项目结构

```
miniprogram/
├── app.json           # 小程序配置文件
├── app.ts             # 小程序入口文件
├── app.wxss          # 全局样式文件
└── pages/
    ├── index/        # 首页（记账页）
    │   ├── index.wxml    # 页面结构
    │   ├── index.wxss    # 页面样式
    │   └── index.ts      # 页面逻辑
    └── statistics/   # 统计页
        ├── statistics.wxml
        ├── statistics.wxss
        └── statistics.ts
```

## 开发环境

- 微信开发者工具
- Node.js 环境
- TypeScript 支持
- Cursor 编程工具

## 运行说明

1. 克隆项目到本地
2. 使用微信开发者工具打开项目
3. 在项目根目录执行 `npm install`
4. 开发者工具中点击"编译"

## 开发心得

1. **TypeScript 的应用**
   - 类型定义提高了代码可维护性
   - 接口定义让数据结构更清晰
   - 编译时错误检查减少了运行时错误

2. **状态管理**
   - 使用本地存储实现数据持久化
   - 页面间数据同步与共享
   - 状态更新与视图更新的处理

3. **动画实现**
   - CSS3 transition 实现平滑过渡
   - transform 配合动画提升性能
   - 动画时机的把控

4. **样式开发**
   - 使用 CSS 变量实现主题切换
   - flex 布局实现灵活布局
   - 统一的视觉风格设计

## 未来计划

- [ ] 添加数据导出功能
- [ ] 支持自定义主题
- [ ] 添加预算管理
- [ ] 支持多设备数据同步
- [ ] 优化统计图表展示

## 贡献

欢迎提交 Issue 或 Pull Request 来帮助改进项目。

## 许可证

本项目采用 [MIT License](LICENSE) 许可协议。

## 致谢

感谢[0基础教你做小程序](https://raw.githubusercontent.com/Haaaiawd/Mewondex/refs/heads/main/introduce_img/0%E5%9F%BA%E7%A1%80%E5%81%9A%E4%B8%80%E6%AC%BE%E5%B0%8F%E7%A8%8B%E5%BA%8F.jpg)教程的指导，帮助我完成了这个学习项目。
