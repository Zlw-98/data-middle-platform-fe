import { useState, useEffect } from 'react'
import { Card, Select, Tree, Button, Space, Input, Table, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined, PlayCircleOutlined, DatabaseOutlined, FieldBinaryOutlined, FilterOutlined, TableOutlined } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

const { Title, Text } = Typography

interface TableField {
  tableName: string
  tableLabel: string
  fields: { key: string; label: string; type: string }[]
}

interface FilterCondition {
  id: number
  field: string
  operator: string
  value: string
}

interface MockRow {
  [key: string]: string | number
}

const tables: TableField[] = [
  {
    tableName: 'users',
    tableLabel: '用户表',
    fields: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'name', label: '姓名', type: 'string' },
      { key: 'email', label: '邮箱', type: 'string' },
      { key: 'age', label: '年龄', type: 'number' },
      { key: 'created_at', label: '创建时间', type: 'date' },
    ],
  },
  {
    tableName: 'orders',
    tableLabel: '订单表',
    fields: [
      { key: 'id', label: '订单ID', type: 'number' },
      { key: 'user_id', label: '用户ID', type: 'number' },
      { key: 'product', label: '产品', type: 'string' },
      { key: 'amount', label: '金额', type: 'number' },
      { key: 'status', label: '状态', type: 'string' },
      { key: 'created_at', label: '下单时间', type: 'date' },
    ],
  },
  {
    tableName: 'products',
    tableLabel: '产品表',
    fields: [
      { key: 'id', label: '产品ID', type: 'number' },
      { key: 'name', label: '产品名称', type: 'string' },
      { key: 'category', label: '分类', type: 'string' },
      { key: 'price', label: '价格', type: 'number' },
      { key: 'stock', label: '库存', type: 'number' },
    ],
  },
]

const operators = [
  { value: '=', label: '=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: 'LIKE', label: 'LIKE' },
]

const mockData: Record<string, MockRow[]> = {
  users: [
    { id: 1, name: '张三', email: 'zhangsan@example.com', age: 28, created_at: '2024-01-15' },
    { id: 2, name: '李四', email: 'lisi@example.com', age: 35, created_at: '2024-02-20' },
    { id: 3, name: '王五', email: 'wangwu@example.com', age: 22, created_at: '2024-03-10' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', age: 31, created_at: '2024-04-05' },
  ],
  orders: [
    { id: 101, user_id: 1, product: '笔记本电脑', amount: 5999, status: '已完成', created_at: '2024-05-01' },
    { id: 102, user_id: 2, product: '无线鼠标', amount: 159, status: '处理中', created_at: '2024-05-02' },
    { id: 103, user_id: 1, product: '机械键盘', amount: 399, status: '已完成', created_at: '2024-05-03' },
    { id: 104, user_id: 3, product: '显示器', amount: 1299, status: '已取消', created_at: '2024-05-04' },
  ],
  products: [
    { id: 1, name: '笔记本电脑', category: '电子产品', price: 5999, stock: 50 },
    { id: 2, name: '无线鼠标', category: '配件', price: 159, stock: 200 },
    { id: 3, name: '机械键盘', category: '配件', price: 399, stock: 150 },
    { id: 4, name: '显示器', category: '电子产品', price: 1299, stock: 80 },
  ],
}

const cssVariables = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg-primary: #0f1419;
    --bg-secondary: #1a2332;
    --bg-card: #1e2a3a;
    --bg-card-hover: #243447;
    --accent-primary: #f59e0b;
    --accent-secondary: #fb923c;
    --accent-glow: rgba(245, 158, 11, 0.15);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --border-subtle: rgba(148, 163, 184, 0.1);
    --border-accent: rgba(245, 158, 11, 0.3);
    --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
    --shadow-glow: 0 0 40px rgba(245, 158, 11, 0.1);
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background: var(--bg-primary);
    font-family: 'Outfit', sans-serif;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }

  .animate-slide-in {
    animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
  }

  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }

  .query-builder-page {
    min-height: 100vh;
    background: var(--bg-primary);
    padding: 48px;
    position: relative;
    overflow: hidden;
  }

  .query-builder-page::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 30% 20%, var(--accent-glow) 0%, transparent 50%);
    pointer-events: none;
  }

  .page-header {
    margin-bottom: 48px;
    position: relative;
    z-index: 1;
  }

  .page-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 42px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
  }

  .page-subtitle {
    font-size: 16px;
    color: var(--text-muted);
    margin: 0;
    font-weight: 300;
  }

  .main-layout {
    display: flex;
    gap: 32px;
    position: relative;
    z-index: 1;
  }

  .config-panel {
    width: 380px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .result-panel {
    flex: 1;
    min-width: 0;
  }

  .config-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--shadow-card);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .config-card:hover {
    border-color: var(--border-accent);
    box-shadow: var(--shadow-card), var(--shadow-glow);
  }

  .config-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .config-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .config-card-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .result-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    padding: 28px;
    box-shadow: var(--shadow-card);
  }

  .result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .result-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .run-button {
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    border: none;
    padding: 12px 28px;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    font-size: 15px;
    color: #0f1419;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .run-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
  }

  .run-button:active {
    transform: translateY(0);
  }

  .sql-preview {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid var(--border-subtle);
  }

  .sql-preview-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--accent-primary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
  }

  .sql-preview-content {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    white-space: pre-wrap;
    margin: 0;
  }

  .table-section-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
    display: block;
  }

  .data-table-wrapper {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid var(--border-subtle);
    overflow: hidden;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .empty-state-text {
    font-size: 15px;
  }

  .ant-select-selector {
    background: var(--bg-secondary) !important;
    border-color: var(--border-subtle) !important;
    border-radius: 8px !important;
  }

  .ant-select-selection-item {
    color: var(--text-primary) !important;
  }

  .ant-select-placeholder {
    color: var(--text-muted) !important;
  }

  .ant-select-arrow {
    color: var(--text-muted) !important;
  }

  .ant-tree {
    background: transparent !important;
    color: var(--text-secondary);
  }

  .ant-tree-node-content-wrapper {
    color: var(--text-secondary) !important;
  }

  .ant-tree-node-content-wrapper:hover {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
  }

  .ant-tree-checkbox-inner {
    background: var(--bg-secondary) !important;
    border-color: var(--text-muted) !important;
  }

  .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
    background: var(--accent-primary) !important;
    border-color: var(--accent-primary) !important;
  }

  .ant-input {
    background: var(--bg-secondary) !important;
    border-color: var(--border-subtle) !important;
    border-radius: 8px !important;
    color: var(--text-primary) !important;
  }

  .ant-input::placeholder {
    color: var(--text-muted) !important;
  }

  .ant-input:hover, .ant-input:focus {
    border-color: var(--accent-primary) !important;
    box-shadow: 0 0 0 2px var(--accent-glow) !important;
  }

  .ant-input-textarea textarea {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
  }

  .ant-btn-dashed {
    background: var(--bg-secondary);
    border-color: var(--border-subtle);
    color: var(--text-secondary);
    border-radius: 8px;
  }

  .ant-btn-dashed:hover {
    border-color: var(--accent-primary) !important;
    color: var(--accent-primary) !important;
  }

  .ant-table {
    background: transparent !important;
  }

  .ant-table-thead > tr > th {
    background: var(--bg-card) !important;
    color: var(--text-primary) !important;
    border-bottom: 1px solid var(--border-subtle) !important;
    font-weight: 500;
  }

  .ant-table-tbody > tr > td {
    background: transparent !important;
    color: var(--text-secondary) !important;
    border-bottom: 1px solid var(--border-subtle) !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: var(--bg-card-hover) !important;
  }

  .ant-pagination {
    margin-top: 16px;
  }

  .ant-pagination-item {
    background: var(--bg-secondary) !important;
    border-color: var(--border-subtle) !important;
  }

  .ant-pagination-item a {
    color: var(--text-secondary) !important;
  }

  .ant-pagination-item-active {
    border-color: var(--accent-primary) !important;
  }

  .ant-pagination-item-active a {
    color: var(--accent-primary) !important;
  }
`

function TableSelector({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) {
  const options = tables.map((t) => ({
    value: t.tableName,
    label: t.tableLabel,
  }))

  return (
    <div className="config-card animate-slide-in delay-1">
      <div className="config-card-header">
        <div className="config-card-icon">
          <DatabaseOutlined style={{ color: '#0f1419' }} />
        </div>
        <h3 className="config-card-title">数据表</h3>
      </div>
      <Select
        mode="multiple"
        placeholder="选择数据表..."
        options={options}
        value={value}
        onChange={onChange}
        style={{ width: '100%' }}
      />
    </div>
  )
}

function FieldSelector({
  selectedTables,
  value,
  onChange,
}: {
  selectedTables: string[]
  value: { table: string; field: string }[]
  onChange: (value: { table: string; field: string }[]) => void
}) {
  const treeData: DataNode[] = tables
    .filter((t) => selectedTables.includes(t.tableName))
    .map((table) => ({
      title: table.tableLabel,
      key: table.tableName,
      selectable: false,
      children: table.fields.map((field) => ({
        title: field.label,
        key: `${table.tableName}.${field.key}`,
      })),
    }))

  const checkedKeys = value.map((f) => `${f.table}.${f.field}`)

  const handleCheck = (checked: any) => {
    const newSelected = (checked.checked || checked).map((k: string) => {
      const [table, field] = k.split('.')
      return { table, field }
    })
    onChange(newSelected)
  }

  return (
    <div className="config-card animate-slide-in delay-2">
      <div className="config-card-header">
        <div className="config-card-icon">
          <FieldBinaryOutlined style={{ color: '#0f1419' }} />
        </div>
        <h3 className="config-card-title">字段</h3>
      </div>
      {selectedTables.length === 0 ? (
        <Text style={{ color: 'var(--text-muted)' }}>请先选择数据表</Text>
      ) : (
        <Tree
          checkable
          defaultExpandAll
          treeData={treeData}
          checkedKeys={checkedKeys}
          onCheck={handleCheck}
        />
      )}
    </div>
  )
}

function FilterConditions({
  selectedFields,
  value,
  onChange,
}: {
  selectedFields: { table: string; field: string }[]
  value: FilterCondition[]
  onChange: (value: FilterCondition[]) => void
}) {
  const addCondition = () => {
    onChange([
      ...value,
      {
        id: Date.now(),
        field: selectedFields.length > 0 ? `${selectedFields[0].table}.${selectedFields[0].field}` : '',
        operator: '=',
        value: '',
      },
    ])
  }

  const removeCondition = (id: number) => {
    onChange(value.filter((c) => c.id !== id))
  }

  const updateCondition = (id: number, field: string, operator: string, val: string) => {
    onChange(
      value.map((c) =>
        c.id === id ? { ...c, field, operator, value: val } : c
      )
    )
  }

  const fieldOptions = selectedFields.map((f) => ({
    value: `${f.table}.${f.field}`,
    label: `${f.table}.${f.field}`,
  }))

  return (
    <div className="config-card animate-slide-in delay-3">
      <div className="config-card-header">
        <div className="config-card-icon">
          <FilterOutlined style={{ color: '#0f1419' }} />
        </div>
        <h3 className="config-card-title">筛选</h3>
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          onClick={addCondition}
          style={{ marginLeft: 'auto' }}
        >
          添加
        </Button>
      </div>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {value.map((condition) => (
          <Space key={condition.id}>
            <Select
              size="small"
              style={{ width: 130 }}
              options={fieldOptions}
              value={condition.field}
              onChange={(v) => updateCondition(condition.id, v, condition.operator, condition.value)}
              placeholder="字段"
            />
            <Select
              size="small"
              style={{ width: 70 }}
              options={operators}
              value={condition.operator}
              onChange={(v) => updateCondition(condition.id, condition.field, v, condition.value)}
            />
            <Input
              size="small"
              style={{ width: 100 }}
              placeholder="值"
              value={condition.value}
              onChange={(e) =>
                updateCondition(condition.id, condition.field, condition.operator, e.target.value)
              }
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeCondition(condition.id)}
            />
          </Space>
        ))}
        {value.length === 0 && (
          <Text style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            点击按钮添加筛选条件
          </Text>
        )}
      </Space>
    </div>
  )
}

function ResultPanel({
  selectedTables,
  selectedFields,
  conditions,
}: {
  selectedTables: string[]
  selectedFields: { table: string; field: string }[]
  conditions: FilterCondition[]
}) {
  const [sql, setSql] = useState('')
  const [data, setData] = useState<MockRow[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [hasRun, setHasRun] = useState(false)

  const buildSql = () => {
    const selectedTablesSet = new Set(selectedTables)
    const filteredTables = tables.filter((t) => selectedTablesSet.has(t.tableName))

    const joinClauses = filteredTables.map((t) => `FROM ${t.tableName}`).join(' ')
    const selectClause =
      selectedFields.length > 0
        ? selectedFields.map((f) => `${f.table}.${f.field}`).join(', ')
        : '*'

    let whereClause = ''
    if (conditions.length > 0) {
      const whereParts = conditions
        .filter((c) => c.field && c.value)
        .map((c) => {
          if (c.operator === 'LIKE') {
            return `${c.field} LIKE '%${c.value}%'`
          }
          return `${c.field} ${c.operator} '${c.value}'`
        })
      if (whereParts.length > 0) {
        whereClause = 'WHERE ' + whereParts.join(' AND ')
      }
    }

    return `SELECT ${selectClause}\n${joinClauses}\n${whereClause}`.trim()
  }

  const handleRunQuery = () => {
    const generatedSql = buildSql()
    setSql(generatedSql)
    setHasRun(true)

    const resultData: MockRow[] = []
    const cols: any[] = []

    if (selectedFields.length > 0) {
      selectedFields.forEach((f) => {
        cols.push({
          title: f.field,
          dataIndex: f.field,
          key: f.field,
        })
      })
      selectedTables.forEach((tableName) => {
        const tableMock = mockData[tableName] || []
        tableMock.forEach((row) => {
          const newRow: MockRow = { key: row.id || Math.random() }
          selectedFields.forEach((f) => {
            if (mockData[f.table]) {
              const fieldKey = tables.find((t) => t.tableName === f.table)?.fields.find((tf) => tf.key === f.field)?.key || f.field
              newRow[f.field] = row[fieldKey]
            }
          })
          resultData.push(newRow)
        })
      })
    } else if (selectedTables.length > 0) {
      const firstTable = selectedTables[0]
      const tableFields = tables.find((t) => t.tableName === firstTable)?.fields || []
      tableFields.forEach((f) => {
        cols.push({
          title: f.label,
          dataIndex: f.key,
          key: f.key,
        })
      })
      resultData.push(...(mockData[firstTable] || []).map((r) => ({ ...r, key: r.id })))
    }

    setColumns(cols)
    setData(resultData)
  }

  return (
    <div className="result-card animate-fade-in-up delay-2">
      <div className="result-header">
        <h2 className="result-title">
          <TableOutlined />
          查询结果
        </h2>
        <button className="run-button" onClick={handleRunQuery}>
          <PlayCircleOutlined />
          生成查询
        </button>
      </div>

      <div className="sql-preview">
        <div className="sql-preview-label">SQL 预览</div>
        <pre className="sql-preview-content">
          {sql || '点击「生成查询」查看 SQL 语句'}
        </pre>
      </div>

      <span className="table-section-label">数据预览</span>
      <div className="data-table-wrapper">
        {hasRun ? (
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">⬡</div>
            <div className="empty-state-text">配置查询条件后点击「生成查询」查看结果</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QueryBuilderPage() {
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [selectedFields, setSelectedFields] = useState<{ table: string; field: string }[]>([])
  const [conditions, setConditions] = useState<FilterCondition[]>([])

  const handleFieldsChange = (newFields: { table: string; field: string }[]) => {
    setSelectedFields(newFields)
    setConditions([])
  }

  return (
    <>
      <style>{cssVariables}</style>
      <div className="query-builder-page">
        <header className="page-header animate-fade-in-up">
          <h1 className="page-title">数据中台组合查询</h1>
          <p className="page-subtitle">可视化查询构建 · 简化版 BI 工具</p>
        </header>

        <div className="main-layout">
          <aside className="config-panel">
            <TableSelector value={selectedTables} onChange={setSelectedTables} />
            <FieldSelector
              selectedTables={selectedTables}
              value={selectedFields}
              onChange={handleFieldsChange}
            />
            <FilterConditions
              selectedFields={selectedFields}
              value={conditions}
              onChange={setConditions}
            />
          </aside>

          <main className="result-panel">
            <ResultPanel
              selectedTables={selectedTables}
              selectedFields={selectedFields}
              conditions={conditions}
            />
          </main>
        </div>
      </div>
    </>
  )
}