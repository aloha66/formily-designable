import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Designer,
  IconWidget,
  DesignerToolsWidget,
  // ViewToolsWidget,
  Workspace,
  OutlineTreeWidget,
  DragSourceWidget,
  MainPanel,
  // CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from '@designable/react'
import { SettingsForm } from '@designable/react-settings-form'
import {
  createDesigner,
  GlobalRegistry,
  GlobalDragSource,
} from '@designable/core'
import { createDesignableField, createDesignableForm } from '../src'
import {
  LogoWidget,
  ActionsWidget,
  PreviewWidget,
  SchemaEditorWidget,
} from './widgets'
import 'antd/dist/antd.less'
import { CompositePanel } from '../src/coms'

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增组件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
    },
  },
})

const Root = createDesignableForm({
  registryName: 'Root',
})

const DesignableField = createDesignableField({
  registryName: 'DesignableField',
})

const App = () => {
  const engine = useMemo(() => createDesigner(), [])
  const [show, setShow] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      GlobalDragSource.appendSourcesByGroup('table', [
        {
          componentName: 'DesignableField',
          props: {
            type: 'void',
            // 'x-decorator': 'FormItem',
            'x-component': 'Table',
          },
        },
      ])

      setShow(true)
    }, 3000)
  }, [])

  return (
    <Designer engine={engine}>
      <MainPanel logo={<LogoWidget />} actions={<ActionsWidget />}>
        <CompositePanel>
          <CompositePanel.Item
            title="panels.Component"
            icon={<IconWidget infer="Component" />}
          >
            <DragSourceWidget title="sources.Inputs" name="inputs" />
            <DragSourceWidget title="sources.Layouts" name="layouts" />
            <DragSourceWidget title="sources.Arrays" name="arrays" />
          </CompositePanel.Item>
          <CompositePanel.Item
            title="panels.OutlinedTree"
            icon={<IconWidget infer="Outline" />}
          >
            <OutlineTreeWidget />
          </CompositePanel.Item>
          {show && (
            <CompositePanel.Item
              title="panels.OutlinedTree"
              icon={<IconWidget infer="Outline" />}
            >
              <DragSourceWidget title="sources.Inputs" name="table" />
            </CompositePanel.Item>
          )}
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel>
              <DesignerToolsWidget />
              {/* <ViewToolsWidget /> */}
            </ToolbarPanel>
            <ViewportPanel>
              <ViewPanel type="DESIGNABLE">
                {() => (
                  <ComponentTreeWidget
                    components={{
                      Root,
                      DesignableField,
                    }}
                  />
                )}
              </ViewPanel>
              <ViewPanel type="JSONTREE">
                {(tree, onChange) => (
                  <SchemaEditorWidget tree={tree} onChange={onChange} />
                )}
              </ViewPanel>
              <ViewPanel type="PREVIEW">
                {(tree) => <PreviewWidget tree={tree} />}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </MainPanel>
    </Designer>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
