import dayjs from 'dayjs';

/**
 * @description 转换成一个通用的时间
 * @param {string | null | undefined} date
 * @param {string} formatType
 * @returns {string}
 */
export default function useTransformDate(date: string | null | undefined, formatType: string = 'YYYY-MM-DD HH:mm:ss') {
  if (date) {
    return dayjs(date).format(formatType);
  }
  return '';
}
