import { NPopconfirm } from 'naive-ui'
import { defineComponent, ref, type VNode } from 'vue'
import type { ActionOption } from '../../../types/components'

interface Props {
  onClick: ((row: any, index: number) => void | Promise<void>) | null
  row: any
  index: number
  action: ActionOption | null
}

export default defineComponent(
  ({ onClick, row, index, action }: Props, { slots }) => {
    const popLoading = ref(false)
    return () => (
      <NPopconfirm
        positive-button-props={{
          type: 'warning',
          loading: popLoading.value,
        }}
        onPositiveClick={async () => {
          try {
            if (onClick) {
              popLoading.value = true
              await onClick(row, index)
              popLoading.value = false
              return true
            }
          }
          catch {
            popLoading.value = false
            return false
          }
          return false
        }}
      >
        {{
          trigger: slots.default,
          default: () =>
            action?.popProps?.content || (action as any)?.content || '确定删除该记录？',
        }}
      </NPopconfirm>
    )
  },
  {
    props: {
      onClick: {
        type: Function as any,
        default: null,
      },
      row: {
        type: [Object, null],
        default: null,
      },
      action: {
        type: [Object, null],
        default: null,
      },
      index: {
        type: Number,
        default: 0,
      },
    },
  },
)
