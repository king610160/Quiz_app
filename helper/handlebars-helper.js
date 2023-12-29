module.exports = {
    inc: function (value) {
        return parseInt(value) + 1
    },
    ifCond: function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this)
    },
}