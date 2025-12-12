import dayjs from 'dayjs'

export function timeFormat(
  v: string | number | null | undefined,
  str: string = 'YYYY-MM-DD',
  extend: { emptyText?: string } = { emptyText: '' },
): string {
  if (!v) return extend?.emptyText || ''
  return dayjs(Number.isNaN(Number(v)) ? v : Number(v)).format(str)
}
