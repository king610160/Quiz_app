const getUser = req => {
    return req.user || null
}

const ensureAuthticated = req => {
    return req.isAuthenticated()
}

module.exports = {
    getUser,
    ensureAuthticated
}