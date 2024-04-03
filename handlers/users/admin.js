const bcrypt = require(`bcryptjs`)
const { pool } = require('../../dependencies.js')
const { randomUUID } = require(`crypto`)
require(`dotenv`).config()
class Admin {
    async updateUser(request, reply) {
        const funcName = `AdminUpdateUserFunction`
        const client = await pool.connect()

        try {
            const { id, email, password, name, middleName, lastName, age, role, phone } = request.body

            const adminCheck = await client.query(`SELECT * FROM users WHERE "userId" = $1`, [id])

            if (adminCheck.rows[0].userRole !== `3`) {
                return reply.status(403).send({ message: `Нет доступа!` })
            }

            if (!email || !password || !name || !middleName || !lastName || !age || !role || !phone) {
                return reply.status(400).send({ message: `Вы не указали какие-то данные!` })
            }

            if (password.length < 5) {
                return reply.status(400).send({ message: `Короткий новый пароль!` })
            }

            const UpdatedUser = await client.query(`SELECT * FROM users WHERE "userEmail" = $1`, [email])

            if (UpdatedUser.rows.length < 1) {
                return reply.status(404).send({ message: `Пользователь не найден!` })
            }

            const hashPassword = await bcrypt.hash(password, 3)

            await client.query(`UPDATE users SET "userPhone" = $1, "userEmail" = $2, "userRole" = $3, "userPassword" = $4 WHERE "userEmail" = $5 RETURNING "userId"`, [phone, email, role, hashPassword, email])
            await client.query(`UPDATE bio SET "bioName" = $1, "bioMiddleName" = $2, "bioLastName" = $3 WHERE "userId" = $4`, [name, middleName, lastName, UpdatedUser.rows[0].userId])

            console.log(`${funcName}: Успешное обновление пользователя администратором`)
            return reply.status(200).send({ message: `Пользователь успешно обновлен!` })
        } catch(err) {
            console.error(`${funcName} catch error`)
            console.error(err)
            return reply.status(500).send({ message: `Ошибка при обновлении пользователя Администратором: ${err}` })
        } finally {
            client.release()
        }
    }

    async createUser(request, reply) {

        const funcName = `AdminCreateUserFunction`
        const client = await pool.connect()

        try {
            const { userEmail, userPassword, userPhone, userName, userAge, userMiddleName, userLastName, id, role } = request.body

            const adminCheck = await client.query(`SELECT * FROM users WHERE "userId" = $1`, [id])

            if (!adminCheck.rows[0]) {
                return reply.status(404).send({ message: "Admin Not Found" })
            }

            if (adminCheck.rows[0].userRole !== `3`) {
                return reply.status(403).send({ message: `У вас нет доступа!` })
            }

            if (!userPassword || !userEmail || !userPhone || !userName || !userAge || !userMiddleName || !userLastName || !role) {
                return reply.status(400).send({ message: `Вы не указали какие-то данные` })
            }

            if (userPassword.length < 5) {
                return reply.status(400).send({ message: `Слишком короткий пароль!` })
            }

            const isUserFind = await client.query(`SELECT * FROM "users" where "userEmail" = $1`, [userEmail])

            if (isUserFind.rows[0]) {
                return reply.status(400).send({ message: `Пользователь с такой почтой уже зарегестрирован!` })
            }
            const hashedPassword = await bcrypt.hash(userPassword, 5)
            const userInviteCode = randomUUID()

            const createdId = await client.query(`INSERT INTO "users"("userEmail", "userPassword", "userPhone", "userTelegramChatId", "userActive", "userRole") VALUES($1, $2, $3, $4, $5, $6)  RETURNING "userId"`, [userEmail, hashedPassword, userPhone, `none`, true, role])

            await client.query(`INSERT INTO bio("userId", "bioName", "bioLastName", "bioMiddleName", "bioInviteCode") VALUES ($1, $2, $3, $4, $5)`, [createdId.rows[0].userId, userName, userLastName, userMiddleName, userInviteCode])

            if (!createdId) {
                return reply.status(500).send({ message: `Произошла внутреняя ошибка при регистрации!` })
            }

            console.log(`${funcName}: Успешное создание пользователя`)
            return reply.status(201).send({ message: `Пользователь успешно создан!` })
        }
        catch(err) {
            console.error(`${funcName} catch error`)
            console.log(err)
            return reply.status(500).send({ message: `Ошибка при регистрации: ${err}` })
        } finally {
            client.release()
        }

    }

    async deleteUser(request, reply) {
        const funcName = `AdminDeleteUserFunction`
        const client = await pool.connect()

        try {
            const { id, email } = request.body

            const adminCheck = await client.query(`SELECT * FROM users WHERE "userId" = $1`, [id])

            if (adminCheck.rows[0].userRole !== `3`) {
                return reply.status(403).send({ message: `Нет доступа!` })
            }

            const userCheck = await client.query(`SELECT * FROM users WHERE "userEmail" = $1`, [email])

            if (userCheck.rows.length < 1) {
                return reply.status(404).send({ message: `Пользователь не найден!` })
            }

            const DeleteUserId = await client.query(`DELETE FROM users WHERE "userEmail" = $1 RETURNING "userId"`, [email])
            const realId = DeleteUserId.rows[0].userId
            await client.query(`DELETE FROM bio WHERE "userId" = $1`, [realId])
            await client.query(`DELETE FROM balance WHERE "userId" = $1`, [realId])
            await client.query(`DELETE FROM referralsincome WHERE "partnerUserId" = $1`, [realId])

            console.log(`${funcName}: Удаление пользователя администратором завершено!`)
            return reply.status(200).send({ message: `Пользователь успешно удален!` })
        } catch(err) {
            console.error(`${funcName} catch error`)
            console.error(err)
            return reply.status(500).send({ message: `Ошибка при удалении пользователя Админом: ${err}` })
        } finally {
            client.release()
        }
    }
}

module.exports = new Admin()