const jwt = require(`jsonwebtoken`)
const {jwtDecode} = require("jwt-decode");
require(`dotenv`).config()

class TokenService {
    create(id, role) {
        const accessToken = jwt.sign({
            id, role
        }, process.env.SECRET_KEY, {
            expiresIn: `30m`
        })
        const refreshToken = jwt.sign({
            id, role
        }, process.env.SUPER_SECRET_KEY, {
            expiresIn: `30d`
        })

        return {
            accessToken, refreshToken
        }
    }

    refresh(refreshToken) {
        try {
            jwt.verify(refreshToken, process.env.SUPER_SECRET_KEY)

            const decoded = jwtDecode(refreshToken)

            return this.create(decoded.id, decoded.role)
        } catch(err) {
            return `Refresh Token Invalid`
        }
    }
}

module.exports = new TokenService()