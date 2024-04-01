const jwt = require(`jsonwebtoken`)

module.exports = function(id) {
    const accessToken = jwt.sign({
        id
    }, process.env.SECRET_KEY, {
        expiresIn: `30m`
    })
    const refreshToken = jwt.sign({
        id
    }, process.env.SUPER_SECRET_KEY, {
        expiresIn: `30d`
    })

    return {
        accessToken, refreshToken
    }
}