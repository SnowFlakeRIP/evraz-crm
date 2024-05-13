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
        const usersTrue = await client.query(`select count(*) from users where "userActive" = $1`,[true])
        data.message = usersTrue.rows
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