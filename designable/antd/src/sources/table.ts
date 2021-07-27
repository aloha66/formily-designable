import { GlobalDragSource } from '@designable/core'

GlobalDragSource.appendSourcesByGroup('table', [
  {
    componentName: 'DesignableField',
    props: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Table',
    },
  },
])
