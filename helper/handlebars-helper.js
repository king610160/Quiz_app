const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime') // import now's time parameter
dayjs.extend(relativeTime) // compare with past time

module.exports = {
    inc: function (value) {
        return parseInt(value) + 1
    },
    ifCond: function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this)
    },
    currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
    relativeTimeFromNow: a => dayjs(a).fromNow(),
}