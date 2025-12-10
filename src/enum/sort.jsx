import { ChevronDown, ChevronUp, Code } from '@vicons/ionicons5'

export const orderEnum = {
    ascend: {
      title: '升序',
      value: true,
      Icon: <ChevronUp />,
      fn: (listQuery, key) => {
        listQuery.desc = true
        listQuery.sortFieldName = key
      },
    },
    descend: {
      title: '降序',
      value: false,
      Icon: <ChevronDown />,
      fn: (listQuery) => {
        listQuery.sortFieldName = ''
        listQuery.desc = true
      },
    },
    false: {
      title: '默认',
      value: null,
      Icon: <Code style="transform:rotateZ(90deg)" />,
      fn: (listQuery) => {
        listQuery.desc = false
        listQuery.sortFieldName = ''
      },
    },
  }