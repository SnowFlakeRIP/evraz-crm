const bcrypt = require(`bcryptjs`)
const { pool } = require('../../dependencies.js')
const tokenService = require(`../../services/tokenService.js`)
const { randomUUID } = require(`crypto`)
const jwt = require(`jsonwebtoken`)
const {jwtDecode} = require("jwt-decode");
require(`dotenv`).config()

class Auth {
    async login(request, reply) {
        const funcName = `loginFunction`
        const client = await pool.connect()

        const { email, password, phone } = request.body

        if (!password || (!email && !phone)) {
            return reply.status(400).send({ message: `Вы не указали какие-то данные!` })
        }

        try {
            const type = email || phone

            switch (type) {
                case email:
                    var User = await client.query(`SELECT * FROM "users" where "userEmail" = $1`, [email])
                    break
                case phone:
                    User = await client.query(`SELECT * FROM "users" where "userPhone" = $1`, [phone])
                    break
            }

            if (!User.rows[0]) {
                return reply.status(404).send({ message: `Пользователь не найден!` })
            }

            const check = await bcrypt.compare(password, User.rows[0].userPassword)

            if (!check) {
                return reply.status(400).send({ message: `Неверное имя пользователя или пароль!` })
            }

            const { accessToken, refreshToken } = tokenService(User.rows[0].userId)

            console.log(`${funcName}: Успешный вход пользователя`)
            return reply.status(200).send({ accessToken, refreshToken })
        } catch(err) {
            console.error(`${funcName} catch error`)
            console.error(err)
           return reply.status(500).send({ message: `Ошибка при входе: ${err}` })
        } finally {
            client.release()
        }
    }

    async me(request, reply) {
        const id = request.body.id
        const client = await pool.connect()

        const User = await client.query(`SELECT * FROM users where "userId" = $1`, [id])

        const UserInfo = User.rows[0]
        client.release()

        reply.send({ UserInfo })
    }

    async refresh(request, reply) {
        const funcName = `refreshFunction`
        const header = request.headers.authorization

        if (!header) {
            return reply.status(401).send({ message: `Не указан Refresh Token!` })
        }

        try {
            const token = header.split(` `)[1]

            jwt.verify(token, process.env.SUPER_SECRET_KEY)

            const decoded = jwtDecode(token)

            const { accessToken, refreshToken } = tokenService(decoded.id)

            console.log(`${funcName}: Refresh токенов завершен!`)
            return reply.status(200).send({ accessToken, refreshToken })
        } catch(err) {
            return reply.status(403).send({ message: `Refresh Token Invalid!` })
        }
    }
}


module.exports = new Auth()