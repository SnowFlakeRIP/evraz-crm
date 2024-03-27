const {pool} = require('../../dependencies');

/**
 * Создание расписания
 * @param object
 * @returns {Promise<{message: string, statusCode: number}>}
 */
async function addEventToSchedule(object) {
    const data = {
        message: 'error',
        statusCode: 400,
    };

    const funcName = 'addEventToSchedule';
    const client = await pool.connect();

    try {
        const addEventToSchedule = await client.query(`INSERT INTO schedule ("name", "groupId", "userId", "startDate", "endDate", "isDone", "visiting")
                                                       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                object.name,
                object.groupId,
                object.userId,
                object.startDate,
                object.endDate,
                object.isDone,
                object.visiting,
            ]
        );

        //исправь это чудо, оно работает всегда
        if (addEventToSchedule.rowCount === 0 || addEventToSchedule.rows.length === 0) {
            console.log(`${funcName}: Запрос на добавление мероприятия не выполнен`);
            data.message = 'Запрос на добавление мероприятия не выполнен';
            return data;
        }

        data.message = 'Successful'
        data.statusCode = '200'
    } catch (err) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release();
        console.log(`${funcName}: client release()`);
    }

    return data;
}

module.exports = {
    addEventToSchedule: addEventToSchedule,
};