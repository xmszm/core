import { NButton, NPopover, NSpace } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'

import { rowIndexKey } from './useDataColumn'
import OprButton from './useDataColumnButton'
import Pop from './useDataColumnPop'

export default defineComponent(
  (props) => {
    const leng = props.options.length

    const toggle = ref(false)
    const options = computed(() =>
      props.options.slice(0, toggle.value ? leng : props.max),
    )

    const ellipOptions = computed(() => props.options.slice(props.max))

    function renderOptions(op) {
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
            return isRender?.(props.data)
              ? (
                  mode === 'pop'
                    ? (
                        <Pop
                          onClick={onClick}
                          row={props.data}
                          action={action}
                          key={rowIndexKey(props.data, props.index) + i}
                        >
                          <NButton
                            text
                            disabled={disabled && disabled(props.data)}
                            type={disabled && disabled(props.data) ? 'default' : type}
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
                          key={rowIndexKey(props.data, props.index) + i}
                        />
                      )
                )
              : undefined
          },
        )
        .filter(v => v)
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
        default: () => {},
      },
      index: {
        type: Number,
        default: 0,
      },
    },
  },
)
