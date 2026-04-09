import { useState } from 'react'
import { Card, Select, Tree, Button, Space, Divider, Input, Table, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons'
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
    <Card title="1. 数据表选择" size="small">
      <Select
        mode="multiple"
        placeholder="请选择数据表"
        options={options}
        value={value}
        onChange={onChange}
        style={{ width: '100%' }}
      />
    </Card>
  )
}

function FieldSelector({
  selectedTables,
  value,
  onChange,
}: {
  selectedTables: string[]
  value: string[]
  onChange: (value: string[]) => void
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
    <Card title="2. 字段选择" size="small">
      {selectedTables.length === 0 ? (
        <Text type="secondary">请先选择数据表</Text>
      ) : (
        <Tree
          checkable
          defaultExpandAll
          treeData={treeData}
          checkedKeys={checkedKeys}
          onCheck={handleCheck}
        />
      )}
    </Card>
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
    <Card
      title="3. 筛选条件"
      size="small"
      extra={
        <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addCondition}>
          添加条件
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {value.map((condition, index) => (
          <Space key={condition.id}>
            <Select
              size="small"
              style={{ width: 150 }}
              options={fieldOptions}
              value={condition.field}
              onChange={(v) => updateCondition(condition.id, v, condition.operator, condition.value)}
              placeholder="选择字段"
            />
            <Select
              size="small"
              style={{ width: 80 }}
              options={operators}
              value={condition.operator}
              onChange={(v) => updateCondition(condition.id, condition.field, v, condition.value)}
            />
            <Input
              size="small"
              style={{ width: 120 }}
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
          <Text type="secondary">点击上方按钮添加筛选条件</Text>
        )}
      </Space>
    </Card>
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

  const buildTreeData = () => {
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
    const generatedSql = buildTreeData()
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
    <Card
      title="查询结果"
      size="small"
      extra={
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleRunQuery}
        >
          生成查询
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong>SQL 预览：</Text>
          <Input.TextArea
            value={sql}
            readOnly
            rows={4}
            style={{ marginTop: 8, fontFamily: 'monospace' }}
            placeholder="点击「生成查询」查看 SQL"
          />
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div>
          <Text strong>数据预览：</Text>
          {hasRun ? (
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10 }}
              style={{ marginTop: 8 }}
              size="small"
            />
          ) : (
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              点击「生成查询」查看模拟结果
            </Text>
          )}
        </div>
      </Space>
    </Card>
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
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        数据中台组合查询
      </Title>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 16 }}>
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
        </div>
        <div style={{ width: '70%' }}>
          <ResultPanel
            selectedTables={selectedTables}
            selectedFields={selectedFields}
            conditions={conditions}
          />
        </div>
      </div>
    </div>
  )
}