const {
    pool
} = require('../../services/libs/pool')

async function getIsDoneSchedule() {
    const data = {
        isDoneTrue: 'error',
        isDoneFalse: 'error',
        statusCode: 400,
        message: 'error'
    }

    const funcName = 'getIsDoneSchedule'
    const client = await pool.connect()

    try {
        const isDoneTrue = await client.query(`select count(*) from schedule where "isDone" = $1`,[true])
        const isDoneFalse = await client.query(`select count(*) from schedule where "isDone" = $1`, [false])
        console.log(isDoneFalse.rows)
        data.isDoneTrue = isDoneTrue.rows
        data.isDoneFalse = isDoneFalse.rows
        data.statusCode = 200
        data.message = 'япии'
    } catch (err) {

    } finally {
        client.release()
    }

    return data
}

module.exports = {
    getIsDoneSchedule: getIsDoneSchedule,
}