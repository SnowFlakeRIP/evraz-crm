const { pool } = require('../../dependencies.js')

class Lk {
    async updateUser(request, reply) {
        const funcName = `updateUserFunction`
        const client = await pool.connect()

        try {
            const { id, name, middleName, lastName, age, phone } = request.body

            if (!name || !middleName || !lastName || !age || !phone) {
                return reply.status(400).send({ message: `Вы не указали какие-то данные!` })
            }

            await client.query(`UPDATE users SET "userPhone" = $1 WHERE "userId" = $2`, ["" + phone + "", "" + id + ""])
            await client.query(`UPDATE bio SET "bioName" = $1, "bioMiddleName" = $2, "bioLastName" = $3 WHERE "userId" = $4`, ["" + name + "", ""+ middleName + "", "" + lastName + "", "" + id + ""])

            console.log(`${funcName}: Успешное обновление пользователя!`)
            return reply.status(200).send({ message: `Пользователь успешно обновлен!` })
        } catch(err) {
            console.error(`${funcName} catch error`)
            console.error(err)
            return reply.status(500).send({ message: `Ошибка при обновлении пользователя ${err}` })
        } finally {
            client.release()
        }
    }

    async deactivate(request, reply) {
        const funcName = `deactivateFunction`
        const client = await pool.connect()

        try {
            const id = request.body.id

            await client.query(`UPDATE users SET "userActive" = $1 WHERE "userId" = $2`, [false, "" + id + ""])

            console.log(`${funcName}: Успешная деактивация пользователя!`)
            return reply.status(200).send({ message: `Пользователь успешно деактивирован!` })
        } catch(err) {
            console.error(`${funcName} catch error`)
            console.error(err)
            return reply.status(500).send({ message: `Ошибка при деактивации` })
        } finally {
            client.release()
        }
    }
}

module.exports = new Lk()