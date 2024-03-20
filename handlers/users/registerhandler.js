const jwt = require(`jsonwebtoken`)
const bcrypt = require(`bcryptjs`)
const { pool } = require('../../dependencies.js')

async function register(object) {
    const data = {
        message: `error`,
        statusCode: 400
    }

    const funcName = `registerFunction`
    const client = await pool.connect()

    try {
        const { userEmail, userPassword, userPhone } = object

        if (!userEmail || !userPassword || !userPhone) {
            data.message = `Вы не указали какие-то данные!`
            return data
        }

        if (userPassword.length < 5) {
            data.message = `Слишком короткий пароль!`
            return data
        }

        const isUserFind = await client.query(`SELECT * FROM "Users" where "userEmail" = $1`, [userEmail])

        if (isUserFind.rows[0]) {
            data.message = `Пользователь с такой почтой уже зарегестрирован!`
            return data
        }
        const hashedPassword = await bcrypt.hash(userPassword, 5)

        const createdId = await client.query(`INSERT INTO "Users"("userEmail", "userPassword", "userPhone", "userTelegramChatId", "userActive", "userRole") VALUES($1, $2, $3, $4, $5, $6)  RETURNING "userId"`, [userEmail, hashedPassword, userPhone, `none`, true, 1])

        if (!createdId) {
            data.statusCode = 500
            data.message = `Ошибка при регистрации!`

            return data
        }


        const accesstoken = jwt.sign({
            id: createdId.rows[0].userId
        }, process.env.SECRET_KEY, {
            expiresIn: `30min`
        })

        const refreshToken = jwt.sign({
            id: createdId.rows[0].userId
        }, process.env.SUPER_SECRET_KEY, {
            expiresIn: `30d`
        })

        data.message = {
            access: accesstoken,
            refresh: refreshToken
        }
        data.statusCode = 201

        return data
    } catch(err) {
        console.error(`${funcName} catch error`)
        console.log(err)
    }

    return data
}

module.exports = {
    register: register
}