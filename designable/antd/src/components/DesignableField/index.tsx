import React from 'react'
import { FormPath } from '@formily/core'
import { GlobalRegistry, TreeNode } from '@designable/core'
import { useDesigner, useTreeNode } from '@designable/react'
import {
  ArrayField,
  Field,
  ObjectField,
  VoidField,
  observer,
  Schema,
  ISchema,
} from '@formily/react'
import {
  DataSourceSetter,
  ReactionsSetter,
  ValidatorSetter,
} from '@formily/designable-setters'
import { FormTab } from '@formily/antd'
import { clone } from '@formily/shared'
import { FormItemSwitcher } from '../FormItemSwitcher'
import { DesignableObject } from '../DesignableObject'
import { createOptions } from './options'
import { IDesignableFieldProps } from './types'
import { includesComponent } from '../../shared'
import * as defaultSchemas from '../../schemas'

Schema.silent()

export const createDesignableField = (options: IDesignableFieldProps) => {
  const realOptions = createOptions(options)

  const tabs = {}

  const getFieldPropsSchema = (node: TreeNode): ISchema => {
    const decorator = node.props['x-decorator']
    const component = node.props['x-component']
    const decoratorSchema =
      decorator &&
      (FormPath.getIn(realOptions.componentsPropsSchema, decorator) ||
        FormPath.getIn(defaultSchemas, decorator))
    const componentSchema =
      component &&
      (FormPath.getIn(realOptions.componentsPropsSchema, component) ||
        FormPath.getIn(defaultSchemas, component))
    // 改造成水平tab
    // TODO 引入tab后，通用tab的启用容器选项，启用后不能切换到容器tab（tab内容渲染问题）
    // 通用配置
    const commonProperties = {
      name: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          defaultValue: node.id,
        },
        'x-index': 0,
      },
      title: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-index': 1,
      },
      description: {
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
        'x-index': 2,
      },
      'x-display': {
        type: 'string',
        enum: ['visible', 'hidden', 'none', ''],
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          defaultValue: 'visible',
        },
        'x-index': 3,
      },
      'x-pattern': {
        type: 'string',
        enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          defaultValue: 'editable',
        },
        'x-index': 4,
      },
    }

    const base = {
      type: 'object',
      properties: {
        propsTab: {
          type: 'void',
          'x-component': 'FormTab',
          'x-component-props': {
            formTab: FormTab.createFormTab(),
            style: {
              overflow: 'visible',
            },
          },
          properties: {
            commonPane: {
              type: 'void',
              'x-component': 'FormTab.TabPane',
              'x-component-props': {
                tab: GlobalRegistry.getDesignerMessage(
                  `settings.x-component-props.common_property`
                ),
              },
              properties: commonProperties,
            },
            // 要动态加载所以只能在这里用&&
            propsPane: componentSchema && {
              type: 'void',
              'x-component': 'FormTab.TabPane',
              'x-component-props': {
                tab: GlobalRegistry.getDesignerMessage(
                  `settings.x-component-props.tab_property`
                ),
              },
              properties: {
                'x-component-props': {
                  // 组件相关的props
                  type: 'object',
                  properties: componentSchema.properties,
                },
              },
            },
            stylePane: componentSchema && {
              type: 'void',
              'x-component': 'FormTab.TabPane',
              'x-component-props': {
                tab: GlobalRegistry.getDesignerMessage(
                  `settings.x-component-props.tab_style`
                ),
              },
              properties: {
                'x-component-props': {
                  // 组件相关的props
                  type: 'object',
                  properties: {
                    style: defaultSchemas.CSSStyle,
                  },
                },
              },
            },
            propsPane2: decoratorSchema && {
              type: 'void',
              'x-component': 'FormTab.TabPane',
              'x-component-props': {
                tab: GlobalRegistry.getDesignerMessage(
                  `settings.x-decorator-props.tab_property`
                ),
              },
              properties: {
                'x-decorator-props': {
                  // 容器相关的props
                  type: 'object',
                  properties: decoratorSchema.properties,
                },
              },
            },
            stylePane2: decoratorSchema && {
              type: 'void',
              'x-component': 'FormTab.TabPane',
              'x-component-props': {
                tab: GlobalRegistry.getDesignerMessage(
                  `settings.x-decorator-props.tab_style`
                ),
              },
              properties: {
                'x-decorator-props': {
                  // 容器相关的props
                  type: 'object',
                  properties: {
                    style: defaultSchemas.CSSStyle,
                  },
                },
              },
            },
          },
        },
      },
    }

    if (node.props.type === 'void') {
      if (!includesComponent(node, realOptions.dropReactionComponents)) {
        Object.assign(commonProperties, {
          'x-reactions': {
            'x-decorator': 'FormItem',
            'x-index': 5,
            'x-component': ReactionsSetter,
          },
        })
      }
      if (!includesComponent(node, realOptions.dropFormItemComponents)) {
        Object.assign(commonProperties, {
          'x-decorator': {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': FormItemSwitcher,
            'x-index': 10,
            'x-reactions': {
              target: '*(title,description)',
              fulfill: {
                state: {
                  hidden: '{{$self.value !== "FormItem"}}',
                },
              },
            },
          },
        })
      } else {
        delete commonProperties.title
        delete commonProperties.description
      }
    } else {
      if (!includesComponent(node, realOptions.dropReactionComponents)) {
        Object.assign(commonProperties, {
          'x-reactions': {
            'x-decorator': 'FormItem',
            'x-index': 7,
            'x-component': ReactionsSetter,
          },
        })
      }
      Object.assign(commonProperties, {
        default: {
          'x-decorator': 'FormItem',
          'x-component': 'ValueInput',
          'x-index': 5,
        },
        enum: {
          'x-decorator': 'FormItem',
          'x-component': DataSourceSetter,
          'x-index': 6,
        },
        'x-validator': {
          type: 'array',
          'x-component': ValidatorSetter,
          'x-index': 8,
        },
        required: {
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          'x-index': 9,
        },
      })
    }

    return base
  }

  const calculateRestricts = (target: TreeNode, source: TreeNode[]) => {
    const targetComponent = target.props['x-component']
    const restrictChildrenComponents =
      realOptions.restrictChildrenComponents?.[targetComponent]
    if (restrictChildrenComponents?.length) {
      if (
        source.every((node) =>
          includesComponent(node, restrictChildrenComponents, target)
        )
      ) {
        return true
      }
      return false
    }
    return true
  }

  if (!realOptions.registryName) throw new Error('Can not found registryName')

  GlobalRegistry.registerDesignerProps({
    [realOptions.registryName]: (node) => {
      const componentName = node.props?.['x-component']
      const message = GlobalRegistry.getDesignerMessage(
        `components.${componentName}`
      )
      const isObjectNode = node.props.type === 'object'
      const isArrayNode = node.props.type === 'array'
      const isVoidNode = node.props.type === 'void'
      const title = typeof message === 'string' ? message : message?.title
      const nodeTitle =
        title ||
        (isObjectNode
          ? GlobalRegistry.getDesignerMessage('components.Object')
          : isVoidNode
          ? GlobalRegistry.getDesignerMessage('components.Void')
          : '')
      return {
        title: nodeTitle,
        draggable: true,
        droppable: isObjectNode || isArrayNode || isVoidNode,
        selfRenderChildren:
          isArrayNode ||
          includesComponent(node, realOptions.selfRenderChildrenComponents),
        inlineLayout: includesComponent(
          node,
          realOptions.inlineLayoutComponents
        ),
        inlineChildrenLayout: includesComponent(
          node,
          realOptions.inlineChildrenLayoutComponents
        ),
        allowAppend(target, source) {
          return (
            (target.props.type === 'void' ||
              target.props.type === 'array' ||
              target.props.type === 'object') &&
            calculateRestricts(target, source)
          )
        },
        propsSchema: getFieldPropsSchema(node),
      }
    },
  })

  const DesignableField: React.FC<ISchema> = observer((props) => {
    const designer = useDesigner()
    const node = useTreeNode()
    if (!node) return null

    const getFieldProps = () => {
      const base = new Schema(clone(props)).compile()
      const fieldProps = base.toFieldProps({
        components: realOptions.components,
      })
      if (fieldProps.decorator?.[0]) {
        fieldProps.decorator[1] = fieldProps.decorator[1] || {}
        FormPath.setIn(
          fieldProps.decorator[1],
          designer.props.nodeIdAttrName,
          node.id
        )
      } else if (fieldProps.component?.[0]) {
        fieldProps.component[1] = fieldProps.component[1] || {}
        FormPath.setIn(
          fieldProps.component[1],
          designer.props.nodeIdAttrName,
          node.id
        )
      }
      fieldProps.value = fieldProps.initialValue
      return fieldProps as any
    }

    const fieldProps = getFieldProps()
    if (props.type === 'object') {
      return (
        <DesignableObject>
          <ObjectField {...fieldProps} name={node.id}>
            {props.children}
          </ObjectField>
        </DesignableObject>
      )
    } else if (props.type === 'array') {
      return <ArrayField {...fieldProps} name={node.id} />
    } else if (node.props.type === 'void') {
      return (
        <VoidField {...fieldProps} name={node.id}>
          {props.children}
        </VoidField>
      )
    }
    return <Field {...fieldProps} name={node.id} />
  })

  return DesignableField
}
