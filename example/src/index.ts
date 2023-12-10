import i18n from 'i18n'
// log should be ingore
console.log('sds我的家sadsa')

// i18n-disable-next-line
export const c = '萨达是'

export const d = '啥第四十' // i18n-disable-line

/* i18n-disable */
export const e = '爱仕达'
export const f = '撒旦'
/* i18n-disable */

/**
 * test
 */
export const a = i18n('sad搜索')

export const b = `asd${a}${i18n('是的')}`

/* i18n-disable */
export const g = '洒点水搜索'

export const h = '呜呜呜'
