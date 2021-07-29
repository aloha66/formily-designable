import React, { useMemo } from 'react'
import { Space, Button, Radio } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { TextWidget, useWorkbench, useTree } from '@designable/react'
import { transformToSchema, transformToTreeNode } from '@designable/formily'
import { GlobalRegistry } from '@designable/core'
import { observer } from '@formily/react'

const Parser = {
  designableFormName: 'Root',
  designableFieldName: 'DesignableField',
}

const value = {
  form: {
    labelCol: 6,
    wrapperCol: 12,
  },
  schema: {
    type: 'object',
    properties: {
      cnhzmmpzaqp: {
        title: 'Select',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-validator': [],
        'x-component-props': {
          defaultOpen: false,
          style: {
            backgroundColor: 'rgba(82,63,180,1)',
          },
        },
        'x-decorator-props': {
          style: {
            backgroundColor: 'rgba(245,166,35,1)',
          },
        },
        _designableId: 'cnhzmmpzaqp',
        'x-index': 0,
        name: 'cnhzmmpzaqp',
        description: 'lkl',
      },
    },
    _designableId: '0p0tglq1iv3',
  },
}

export const ActionsWidget = observer(() => {
  const tree = useTree()
  const handleSave = () => {
    return JSON.stringify(transformToSchema(tree, Parser), null, 2)
  }
  const handlePublish = () => {
    const payload = transformToTreeNode(value, Parser)
    tree.from(payload)
    tree.takeSnapshot()
  }
  const workbench = useWorkbench()
  const previewText = useMemo(() => {
    return workbench.type === 'DESIGNABLE' ? '编辑' : '预览'
  }, [workbench.type])
  return (
    <Space style={{ marginRight: 10 }}>
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: 'Engligh', value: 'en-US' },
          { label: '简体中文', value: 'zh-CN' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value)
        }}
      />
      <Button href="https://github.com/alibaba/formily" target="_blank">
        <GithubOutlined />
        Github
      </Button>
      <Button onClick={handleSave}>
        <TextWidget>Save</TextWidget>
      </Button>
      <Button type="primary" onClick={handlePublish}>
        <TextWidget>import</TextWidget>
      </Button>
      <Button
        onClick={() => {
          workbench.type =
            workbench.type === 'DESIGNABLE' ? 'PREVIEW' : 'DESIGNABLE'
        }}
      >
        {previewText}
      </Button>
    </Space>
  )
})
