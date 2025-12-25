import { NButton } from 'naive-ui'
import { defineComponent, ref, type VNode } from 'vue'
import type { ActionOption } from '../../../types/components'

interface Props {
  action: ActionOption | null
  row: any
  index: number
}

export default defineComponent(
  ({ action, row, index }: Props) => {
    const {
      onClick,
      disabled,
      type = 'primary',
      loading = false,
      label = null,
      ...other
    } = action || {}
    const oprBtnLoading = ref(false)
    return () => (
      <NButton
        text
        onClick={async () => {
          if (onClick) {
            try {
              if (loading) {
                oprBtnLoading.value = true
              }
              await onClick(row)
            }
            finally {
              setTimeout(() => (oprBtnLoading.value = false), 500)
            }
          }
        }}
        disabled={typeof disabled === 'function' ? disabled(row) : disabled}
        loading={oprBtnLoading.value}
        type={typeof disabled === 'function' && disabled(row) ? 'default' : type}
        {...other}
      >
        {typeof label === 'function' ? label?.(row) : label}
      </NButton>
    )
  },
  {
    props: {
      action: {
        type: [Object, null],
        default: null,
      },
      row: {
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
