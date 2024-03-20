const { pool } = require('../../dependencies');

/**
 * Создание расписания
 * @param object
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function createSchedule(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };

    const funcName = 'createSchedule';
    const client = await pool.connect();

    try {
        const createSchedule = await client.query(`INSERT INTO schedule ("groupId", "userId")
                                                   VALUES ($1, $2)`,
            [
                object.groupId,
                object.userId,
            ]
        );

        if (createSchedule.rowCount === 0 || createSchedule.rows.length === 0) {
            console.log(`${ funcName }: Запрос на создание расписания не выполнен`);
            data.message = 'Запрос на создание расписания не выполнен';
            return data;
        }

        data.message = 'Successful'
        data.statusCode = '200'
    } catch (err) {
        console.log(`${ funcName }: CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release();
        console.log(`${ funcName }: client release()`);
    }

    return data;
}

module.exports = {
    createSchedule,
};