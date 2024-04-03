const { pool } = require('../../dependencies');

// Дополнить
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
        if (addEventToSchedule.rowCount === 0) {
            console.log(`${funcName}: Запрос на добавление мероприятия не выполнен`);
            data.message = 'Запрос на добавление мероприятия не выполнен';
            return data;
        }

        data.message = 'Successful';
        data.statusCode = '200';
    } catch (err) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release();
        console.log(`${funcName}: client release()`);
    }

    return data;
}

async function checkAllEventsFromSchedule() {
    const data = {
        message: 'error',
        statusCode: 400
    };

    const funcName = 'checkAllEventsFromSchedule';
    const client = await pool.connect();

    try {
        const checkAllEventsFromSchedule = await client.query(`SELECT *
                                                               FROM schedule`);

        if (checkAllEventsFromSchedule.rowCount === 0) {
            console.log(`${ funcName }: Запрос на просмотр расписания не выполнен`);
            data.message = 'Запрос на просмотр расписания не выполнен'
            return data;
        }

        data.message = checkAllEventsFromSchedule.rows;
        data.statusCode = '200';
    } catch (err) {
        console.log(`${ funcName }: CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release();
        console.log(`${ funcName }: client release()`);
    }

    return data;
}

// Фикс
async function checkEventFromScheduleById(object) {
    const data = {
        message: 'error',
        statusCode: 400
    };

    const funcName = 'checkEventFromScheduleById';
    const client = await pool.connect();
    console.log(object)

    try {
        const checkEventFromScheduleById = await client.query(`SELECT *
                                                           FROM schedule
                                                           WHERE "id" = $1`,
            [
                object.eventId,
            ]
        );

        if (checkEventFromScheduleById.rowCount === 0) {
            console.log(`${ funcName }: Запрос на просмотр мероприятия не выполнен`);
            data.message = 'Запрос на просмотр мероприятия не выполнен'
            return data;
        }

        data.message = checkEventFromScheduleById.rows;
        data.statusCode = '200';
    } catch (err) {
        console.log(`${ funcName }: CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release();
        console.log(`${ funcName }: client release()`);
    }

    return data;
}

// Доделать
// async function deleteEventOfSchedule(object) {
//     const data = {
//         message: 'error',
//         statusCode: 400
//     };
//
//     const funcName = "deleteEventOfSchedule";
//     const client = await pool.connect();
// }

module.exports = {
    addEventToSchedule: addEventToSchedule,
    checkAllEventsFromSchedule: checkAllEventsFromSchedule,
    checkEventFromScheduleById: checkEventFromScheduleById,
    // deleteEventOfSchedule: deleteEventOfSchedule,
};