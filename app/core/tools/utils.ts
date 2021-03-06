/**
 * 格式化日期
 * @param d
 * @param format 'YYYY-MM-DD hh:mm:ss:ms'
 */
export function formatDate(date: Date = new Date(), format = 'YYYY-MM-DD hh:mm:ss:ms') {
  const obj = {
    YYYY: fixedStringLength(date.getFullYear(), 4),
    MM: fixedStringLength(date.getMonth() + 1, 2),
    DD: fixedStringLength(date.getDate(), 2),
    hh: fixedStringLength(date.getHours(), 2),
    mm: fixedStringLength(date.getMinutes(), 2),
    ss: fixedStringLength(date.getSeconds(), 2),
    ms: fixedStringLength(date.getMilliseconds(), 3),
  }

  return format.replace(/(YYYY|MM|DD|hh|mm|ss|ms)/g, (_, $1) => {
    return obj[$1]
  })
}

/**
 * 固定字符串长度
 * @param n 要转换的内容
 * @param p 固定长度
 * @param r 补齐字符
 */
export function fixedStringLength(n: number | string, p?: number, r = '0'): string {
  let str = String(n)
  if (p && str.length !== p) {
    if (str.length >= p) {
      str = str.replace(new RegExp(`^(.{${p}})(.*)$`), '$1')
    } else {
      const lost = p - str.length
      if (lost > 0) {
        for (let i = 0; i < lost; i++) {
          str = r + str
        }
      }
    }
  } else {
    str = String(n)
  }

  return str
}

/** 获取 url 参数 */
export function getQuery(search: string): AnyObj {
  const query: AnyObj = {}

  search
    .substr(1)
    .split('&')
    .forEach((str) => {
      const strArr = str.split('=')
      const key = strArr[0]

      if (!key) return query

      let val = decodeURIComponent(strArr[1])

      try {
        val = JSON.parse(val)
      } catch (err) {}

      query[key] = val
    })
  return query
}

/** 转换成 url search */
export function toSearch(obj: AnyObj): string {
  const arr = Object.keys(obj).map((key) => {
    let val = obj[key]

    if (typeof val !== 'string') {
      try {
        val = JSON.stringify(val)
      } catch (err) {
        console.error(err)
      }
    }

    return `${key}=${encodeURIComponent(val)}`
  })
  return '?' + arr.join('&')
}

/** 对象转对象数组 */
export function obj2arr(obj: AnyObj): object[] {
  const arr = []
  for (const [key, value] of Object.entries(obj)) {
    arr.push({ [key]: value })
  }
  return arr
}
