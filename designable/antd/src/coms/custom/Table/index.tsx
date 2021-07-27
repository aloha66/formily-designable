import React, { FC } from 'react'
import { connect, mapProps } from '@formily/react'
import { Table as ATable } from 'antd'

const Table: FC = ({ ...props }) => {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ]

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  return (
    <div>
      children
      <ATable {...props} dataSource={dataSource} columns={columns} />
    </div>
  )
}

const CTable = connect(
  Table,
  mapProps((props) => {
    return {
      ...props,
    }
  })
)

export default CTable
