# 数据中台组合查询页面

一个简化版 BI 查询工具界面，基于 React + TypeScript + Ant Design 构建。

## 功能特性

- **数据表选择**：支持下拉多选 `users`、`orders`、`products` 三张示例表
- **字段选择**：Tree 树形结构，按表分组展示字段，支持多选
- **筛选条件**：可添加/删除条件行，支持 =、>、<、>=、<=、LIKE 操作符
- **SQL 预览**：根据所选配置实时生成 Mock SQL 语句
- **数据表格**：Ant Design Table，根据所选字段动态生成列，展示 Mock 数据

## 技术栈

- React 18.3
- TypeScript 5.5
- Vite 5.4
- Ant Design 5.21

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173/ 查看页面。

## 项目结构

```
data-middle-platform-fe/
├── src/
│   ├── main.tsx              # 入口文件
│   ├── App.tsx               # 根组件
│   └── pages/
│       └── QueryBuilderPage.tsx  # 主页面（含所有子组件）
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .gitignore
```

## 交互流程

1. 在左侧选择数据表 → 字段选择区自动显示对应表的字段
2. 勾选需要查询的字段（可多选）
3. 点击「添加条件」配置筛选条件（可选）
4. 点击右侧「生成查询」→ 右侧显示 SQL 预览和模拟查询结果

## 许可证

MIT