import dayjs from 'dayjs'

export function timeFormat(v, str = 'YYYY-MM-DD', extend = { emptyText: '' }) {
  if (!v)
    return extend?.emptyText || ''
  return dayjs(Number.isNaN(Number(v)) ? v : Number(v)).format(str)
}
