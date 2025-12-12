export const ellipsis = {
  style: {
    cursor: 'pointer',
  },
  tooltip: {
    flip: true,
    arrowPointToCenter: true,
    contentStyle: {
      minWidth: '100px',
      maxWidth: '300px',
      maxHeight: '300px',
      overflowY: 'auto',
      whiteSpace: 'pre-line',
      boxSizing: 'border-box',
      margin: '0 -14px',
      padding: '0 14px',
    },
    arrowStyle: {
      backgroundColor: '--n-color',
    },
  },
} as const
