const jwt = require('jsonwebtoken')

const isValidToken = token => {
    if (!token) return false

    try {
        jwt.verify(token, 'secret')
        return true
    } catch {
        return false
    }
}

const getTokenFromHeader = header => {
    try {
        return header.split(' ')[1]
    } catch {
        return null
    }
}

const checkTokenFromHeader = header => {
    if (!header) return false

    const token = getTokenFromHeader()
    return isValidToken(token)
}

module.exports = {checkTokenFromHeader, getTokenFromHeader}