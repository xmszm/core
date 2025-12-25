import { NButton, NPopover, NSpace } from 'naive-ui'
import { computed, defineComponent, ref, type VNode } from 'vue'
import type { ActionOption } from '../../../types/components'

import { rowIndexKey } from './useDataColumn'
import OprButton from './useDataColumnButton'
import Pop from './useDataColumnPop'

interface Props {
  options: ActionOption[]
  max: number
  data: any
  index: number
}

export default defineComponent(
  (props: Props) => {
    const leng = props.options.length

    const toggle = ref(false)
    const options = computed(() =>
      props.options.slice(0, toggle.value ? leng : props.max),
    )

    const ellipOptions = computed(() => props.options.slice(props.max))

    function renderOptions(op: ActionOption[]): (VNode | undefined)[] {
      return op
        ?.map(
          (
            {
              isRender = () => true,
              onClick = null,
              mode = null,
              disabled = false,
              type = 'primary',
              ...action
            },
            i,
          ) => {
            return (typeof isRender === 'function' ? isRender(props.data) : isRender)
              ? (
                  mode === 'pop'
                    ? (
                        <Pop
                          onClick={onClick}
                          row={props.data}
                          index={props.index}
                          action={action}
                          key={rowIndexKey(props.data, props.index) + i}
                        >
                          <NButton
                            text
                            disabled={typeof disabled === 'function' ? disabled(props.data) : disabled}
                            type={typeof disabled === 'function' && disabled(props.data) ? 'default' : type}
                            {...action}
                          >
                            {typeof action?.label === 'function'
                              ? action?.label(props.data)
                              : action?.label}
                          </NButton>
                        </Pop>
                      )
                    : (
                        <OprButton
                          row={props.data}
                          action={{
                            ...action,
                            disabled,
                            onClick,
                            type,
                          }}
                          index={props.index}
                          key={rowIndexKey(props.data, props.index) + i}
                        />
                      )
                )
              : undefined
          },
        )
        .filter((v): v is VNode => v !== undefined)
    }

    return () => (
      <NSpace
        style={{ width: '100%' }}
        wrap-item={false}
        justify="center"
        align="center"
      >
        <NSpace wrap-item={false} align="center">
          {renderOptions(options.value)}
        </NSpace>
        <NPopover trigger="click">
          {{
            trigger: () => (
              <NButton text type="info">
                更多
              </NButton>
            ),
            default: () => (
              <NSpace
                wrap-item={false}
                align="center"
                style={{ width: '250px', padding: '5px' }}
              >
                {renderOptions(ellipOptions.value)}
              </NSpace>
            ),
          }}
        </NPopover>
      </NSpace>
    )
  },
  {
    name: 'DataColumnCollet',

    props: {
      options: {
        type: Array,
        default: () => [],
      },
      max: {
        type: Number,
        default: 3,
      },
      data: {
        type: Object,
        default: () => ({}),
      },
      index: {
        type: Number,
        default: 0,
      },
    },
  },
)
