import { h } from 'vue'
import { ChevronDown, ChevronUp, Code } from '@vicons/ionicons5'

interface OrderEnumItem {
  title: string
  value: boolean | null
  Icon: any
  fn: (listQuery: any, key?: string) => void
}

interface OrderEnum {
  ascend: OrderEnumItem
  descend: OrderEnumItem
  false: OrderEnumItem
}

export const orderEnum: OrderEnum = {
  ascend: {
    title: '升序',
    value: true,
    Icon: h(ChevronUp),
    fn: (listQuery: any, key: string) => {
      listQuery.desc = true
      listQuery.sortFieldName = key
    },
  },
  descend: {
    title: '降序',
    value: false,
    Icon: h(ChevronDown),
    fn: (listQuery: any) => {
      listQuery.sortFieldName = ''
      listQuery.desc = true
    },
  },
  false: {
    title: '默认',
    value: null,
    Icon: h(Code, { style: 'transform:rotateZ(90deg)' }),
    fn: (listQuery: any) => {
      listQuery.desc = false
      listQuery.sortFieldName = ''
    },
  },
}
