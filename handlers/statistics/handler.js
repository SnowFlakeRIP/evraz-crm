const {
    pool
} = require('../../services/libs/pool')

async function getActiveUsers() {
    const data = {
        message: 'error',
        statusCode: 400
    }

    const funcName = 'getActiveUsers'
    const client = await pool.connect()

    try {
        const users = await client.query(`select *
                                          from users
                                          where "userActive" is true`)

        data.message = users.rows
        data.statusCode = 200
    } catch (err) {

    } finally {
        client.release()
    }

    return data
}

module.exports = {
    getActiveUsers: getActiveUsers,

}