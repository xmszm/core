```javascript


const opr = createActionColumnJsx([
  {
    label: '编辑',
    type: 'primary',
    onClick: row => onAdd(row, 'edit'),
  },
  {
    label: '删除',
    type: 'error',
    mode: 'pop',
    content: '确定删除该记录？',
    onClick: (row) => {
      $message.success('删除成功')
      pageState.data = pageState.data.filter(item => item.id !== row.id)
      pageState.itemCount--
    },
  },
])

function onAdd(row = null, str = 'add') {

  commonDialogMethod({
    title: `示例`,
    mode:str,
    options: [
      {
        label: '名称',
        key: 'name',
        required: true,
      },
      {
        label: '类型',
        key: 'type',
        way: 'select',
        options: [
          { label: '类型1', value: 'type1' },
          { label: '类型2', value: 'type2' },
        ],
      },
      {
        label: '状态',
        key: 'status',
        way: 'switch',
      },
    ],
    valueData: { ...row },
    isRead: dialogState?.[str].isRead,
    interfaceFn: (data, { hideLoading, close }) => {
      // 模拟接口调用
      setTimeout(() => {
        $message.success(`${dialogState?.[str]?.title}成功`)
        if (str === 'add') {
          pageState.data.unshift({
            id: Date.now(),
            ...data,
            createTime: new Date().toLocaleString(),
          })
          pageState.itemCount++
        }
        else {
          const index = pageState.data.findIndex(item => item.id === data.id)
          if (index > -1) {
            pageState.data[index] = { ...pageState.data[index], ...data }
          }
        }
        close()
        hideLoading()
      }, 500)
    },
  })
}


```