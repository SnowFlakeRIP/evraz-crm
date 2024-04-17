const bcrypt = require(`bcryptjs`)
const { pool } = require('../../dependencies.js')
const { randomUUID } = require(`crypto`)
const userDto = require(`../../dtos/userDto.js`)
require(`dotenv`).config()

async function checkAdminStatus(id) {
    const funcName = `checkAdminStatusFunction`
    const client = await pool.connect()

    try {
        const User = await client.query(`SELECT * FROM users WHERE "userId" = $1`, ["" + id + ""])

        return !(User.rows.length < 1 || User.rows[0].userRole !== `3`)
    } catch(err) {
        console.error(`${funcName}: Ошибка при проверке админ-статуса!`)
        console.error(err)
        return false
    } finally {
        client.release()
    }
}

class Admin {

    async updateUser(request, reply) {
        const funcName = `AdminUpdateUserFunction`
        const client = await pool.connect()

        try {
            const { email, password, name, middleName, lastName, age, role, phone, tgId } = request.body
            const id = request.user

            if (!await checkAdminStatus(id)) {
                return reply.status(403).send({ message: `Нет доступа!` })
            }

            if (!email || !password || !name || !middleName || !lastName || !age || !role || !phone) {
                return reply.status(400).send({ message: `Вы не указали какие-то данные!` })
            }

            if (password.length < 5) {
                return reply.status(400).send({ message: `Короткий новый пароль!` })
            }

            const UpdatedUser = await client.query(`SELECT * FROM users WHERE "userEmail" = $1`, ["" + email + ""])

            if (UpdatedUser.rows.length < 1) {
                return reply.status(404).send({ message: `Пользователь не найден!` })
            }

            if (UpdatedUser.rows[0].userPhone === phone) {
                return reply.status(409).send({ message: "Данный телефон уже занят!" })
            }

            const hashPassword = await bcrypt.hash(password, 3)

            await client.query(`UPDATE users SET "userPhone" = $1, "userEmail" = $2, "userRole" = $3, "userPassword" = $4, "updatedAt" = $6, "userTelegramChatId" = $7 WHERE "userEmail" = $5  RETURNING "userId"`, ["" + phone + "", "" + email + "", "" + role + "", "" + hashPassword + "", "" + email + "", new Date(), "" + tgId + ""])
            await client.query(`UPDATE bio SET "bioName" = $1, "bioMiddleName" = $2, "bioLastName" = $3, "updatedAt" = $5, "bioAge" = $6 WHERE "userId" = $4`, ["" + name + "", "" + middleName + "", "" + lastName + "", UpdatedUser.rows[0].userId, new Date(), "" + age + ""])

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
            const { userEmail, userPassword, userPhone, userName, userAge, userMiddleName, userLastName, role, tgId } = request.body
            const id = request.user

            if (!await checkAdminStatus(id)) {
                return reply.status(403).send({ message: `У вас нет доступа!` })
            }

            if (!userPassword || !userEmail || !userPhone || !userName || !userAge || !userMiddleName || !userLastName || !role) {
                return reply.status(400).send({ message: `Вы не указали какие-то данные` })
            }

            if (role === -1) {
                return reply.status(400).send({ message: "Недопустимая роль!" })
            }

            if (userPassword.length < 5) {
                return reply.status(400).send({ message: `Слишком короткий пароль!` })
            }

            const isUserFind = await client.query(`SELECT * FROM "users" where "userEmail" = $1  OR "userPhone" = $2`, ["" + userEmail + "", "" + userPhone + ""])

            if (isUserFind.rows[0]) {
                return reply.status(409).send({ message: `Пользователь с такой почтой или телефоном уже зарегестрирован!` })
            }
            const hashedPassword = await bcrypt.hash(userPassword, 5)
            const userInviteCode = randomUUID()

            const createdId = await client.query(`INSERT INTO "users"("userEmail", "userPassword", "userPhone", "userTelegramChatId", "userActive", "userRole") VALUES($1, $2, $3, $4, $5, $6)  RETURNING "userId"`, ["" + userEmail + "", "" + hashedPassword + "", "" + userPhone + "", "" + tgId + "" , true, "" + role + ""])

            await client.query(`INSERT INTO bio("userId", "bioName", "bioLastName", "bioMiddleName", "bioInviteCode", "bioAge") VALUES ($1, $2, $3, $4, $5, $6)`, [createdId.rows[0].userId, "" + userName + "", "" + userLastName + "", "" + userMiddleName + "", "" + userInviteCode + "", "" + userAge + ""])

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
            const { email } = request.body
            const id = request.user

            if (!await checkAdminStatus(id)) {
                return reply.status(403).send({ message: `Нет доступа!` })
            }

            const userCheck = await client.query(`SELECT * FROM users WHERE "userEmail" = $1`, ["" + email + ""])

            if (userCheck.rows.length < 1) {
                return reply.status(404).send({ message: `Пользователь не найден!` })
            }

            const DeleteUserId = await client.query(`DELETE FROM users WHERE "userEmail" = $1 RETURNING "userId"`, ["" + email + ""])
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

    async getUserInfo(request, reply) {
        const funcName = `getUserInfoFromAdminFunction`
        const client = await pool.connect()

        try {
            const id = request.user
            const email = request.query.email

            if(!await checkAdminStatus(id)) {
                return reply.status(403).send({ message: "Нет доступа!" })
            }

            if (!email) {
                return reply.status(400).send({ message: "Вы не указали email!" })
            }

            const User = await client.query(`SELECT * FROM users WHERE "userEmail" = $1`, ["" + email + ""])

            if (User.rows.length < 1) {
                return reply.status(404).send({ message: "Пользователь не найден!" })
            }

            const UserBio = await client.query(`SELECT * FROM bio WHERE "userId" = $1`, [User.rows[0].userId])

            const object = {User, UserBio}
            const UserInfo = userDto(object)

            console.log(`${funcName}: Получение данных о пользователе админом завершено!`)
            return reply.status(200).send({ UserInfo })
        } catch(err) {
            console.error(`${funcName}: Ошибка при получении данных о пользователе Админом`)
            console.error(err)
            return reply.status(500).send({ message: `Ошибка при получении данных о пользователе Админом: ${err}` })
        } finally {
            client.release()
        }
    }

    async createRole(request, reply) {
        const funcName = `createRoleFromAdminFunction`
        const client = await pool.connect()

        try {
            const {roleName} = request.body
            const id = request.user

            if (!await checkAdminStatus(id)) {
                return reply.status(403).send({ message: "Нет доступа!" })
            }

            if (!roleName) {
                return reply.status(400).send({ message: "Не указано название роли!" })
            }

            await client.query(`INSERT INTO roles("roleValue") VALUES($1)`, ["" + roleName + ""])

            return reply.status(201).send({ message: `Роль ${roleName} успешно создана!` })
        } catch(err) {
            console.error(`${funcName}: Ошибка при создании роли Админом`)
            console.error(err)
            return reply.status(500).send({ message: `Произошла ошибка при создании роли Админом: ${err}` })
        } finally {
            client.release()
        }
    }

    async getRoles(request, reply) {
        const funcName = `getRolesToAdmin`
        const client = await pool.connect()

        try {
            const id = request.user

            if (!await checkAdminStatus(id)) {
                return reply.status(403).send({ message: "Нет доступа!" })
            }

            const roles = await client.query(`SELECT * FROM roles`)
            const sendRoles = roles.rows

            return reply.status(200).send({ sendRoles })
        } catch(err) {
            console.error(`${funcName}: Ошибка при получении ролей Админом`)
            console.error(err)
            return reply.status(500).send({ message: `Произошла ошибка при получении ролей: ${err}` })
        } finally {
            client.release()
        }
    }

    async allUsers(request, reply) {
        const funcName = `getAllUsersToAdmin`
        const client = await pool.connect()

        try {
            const id = request.user
            const needPage = request.params.page
            let page = 1
            const result = {
                1: []
            }

            if (!await checkAdminStatus(id)) {
                return reply.status(403).send({ message: "Нет доступа!" })
            }

            const Users = await client.query(`SELECT * FROM users`)
            const Bio = await client.query(`SELECT * FROM bio`)

            for (let i in Users.rows) {
                const currentUser = Users.rows[i]
                const currentBio = Bio.rows[i]
                const object = {
                    currentUser, currentBio
                }

                if (result[page].length < 10) {
                    result[page].push(object)
                }
                else {
                    page += 1
                    result[page] = [object]
                }
            }

            const sendResult = result[needPage]
            const totalPages = Object.keys(result).length

            if (needPage === ``) {
                return reply.status(200).send({ result, totalPages })
            }

            if (!sendResult) {
                return reply.status(404).send({ message: "Количество пользоваетелей меньше чем указанный запрос" })
            }

            return reply.status(200).send({ sendResult, totalPages })
        } catch(err) {
            console.error(`${funcName}:  Ошибка при получении всех юзеров Админом`)
            console.error(err)
            return reply.status(500).send({ message: `Ошибка при получении данных админом: ${err}` })
        } finally {
            client.release()
        }
    }
}

module.exports = new Admin()