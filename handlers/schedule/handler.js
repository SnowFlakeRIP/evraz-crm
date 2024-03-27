const {pool} = require("../../dependencies")

async function createLesson(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };
    
    const funcName = 'createLesson';
    const client = await pool.connect()
    const log = (m) => console.log(`${funcName}: ${m}`)

    try {
        //авторизация?
        const startDate = new Date(object.startDate)
        if (isNaN(startDate.valueOf())) {
            data.message = 'Неверное время начала'
            log(data.message)
            return data
        }

        const endDate = new Date(object.endDate)
        if (isNaN(endDate.valueOf())) {
            data.message = 'Неверное время конца'
            log(data.message)
            return data
        }

        const group = await client.query(`select * from groups where "groupId" = $1`, [object.groupId])
        if (group.rows.length === 0) {
            data.message = "Группа не найдена"
            log(data.message)
            return data
        }

        const teacher = await client.query(`select * from users where "userId" = $1`, [object.teacherId])
        if (teacher.rows.length === 0) {
            data.message = "Преподователь не найден"
            log(data.message)
            return data
        }

        let visiting = {}

        const groupMembers = await client.query(`select * from usersgroups where "groupId" = $1`, [object.groupId])
        for (const member of groupMembers.rows) {
            visiting[member.userId] = "not_visited"
        }

        const lesson = await client.query(`insert into schedule (name, "groupId", "userId", "startDate", "endDate", visiting) values ($1,$2,$3,$4,$5,$6) returning *`, [object.lessonName, object.groupId, object.teacherId, new Date(object.startDate), new Date(object.endDate), visiting])
        if (lesson.rowCount === 0) {
            data.message = "Занятие не добавлено"
            data.statusCode = 500
            log(data.message)
            return data
        }

        data.message = "Занятие добавлено"
        log(data.message)
        data.lesson = lesson.rows[0]
        data.statusCode = 200
        return data
    } catch (err) {
        log(`CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release()
    }
    
    return data;
}

async function getLesson(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };

    const funcName = 'getLesson';
    const client = await pool.connect()
    const log = (m) => console.log(`${funcName}: ${m}`)

    try {
        const lesson = await client.query(`select * from schedule where id = $1`, [object.lessonId])
        if (lesson.rows.length === 0) {
            data.message = "Занятие не найдено"
            log(data.message)
            return data
        }
        data.message = "Занятие найдено"
        log(data.message)
        data.lesson = lesson.rows[0]
        data.statusCode = 200
        return data
    } catch (err) {
        log(`CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release()
    }

    return data;
}

module.exports = {
    createLesson, getLesson,
};