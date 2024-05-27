const {pool} = require("../../dependencies")

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}


async function createLesson(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };
    
    const funcName = 'createLesson';
    const client = await pool.connect()
    const log = (m) => console.log(`${funcName}: ${m}`)

    try {
        const startDate = new Date(object.startDate)
        if (isNaN(startDate.valueOf())) {
            data.message = 'Неверная дата начала'
            log(data.message)
            return data
        }

        const endDate = new Date(object.endDate)
        if (isNaN(endDate.valueOf())) {
            data.message = 'Неверная дата конца'
            log(data.message)
            return data
        }

        let startTime = new Date(object.startTime)
        if (isNaN(startTime.valueOf())) {
            data.message = 'Неверное время начала'
            log(data.message)
            return data
        }
        // startTime = new Date(
        //     startTime.getUTCHours() * 3600000
        //     + startTime.getUTCMinutes() * 60000
        //     + startTime.getUTCSeconds() * 1000
        // )

        let endTime = new Date(object.endTime)
        if (isNaN(endTime.valueOf())) {
            data.message = 'Неверное время конца'
            log(data.message)
            return data
        }
        // endTime = new Date(
        //     endTime.getUTCHours() * 3600000
        //     + endTime.getUTCMinutes() * 60000
        //     + endTime.getUTCSeconds() * 1000
        // )

        console.log(startTime, endTime, object.startTime, object.endTime)

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
        let seq
        while (true) {
            seq = crypto.randomUUID()
            let exist = await client.query(`select * from schedule where "sequenceId" = $1`, [seq])
            if (exist.rows.length === 0) break
        }
        let lesson = []
        const period = getDates(startDate, endDate)
        console.log(period)
        for (const date of period) {
            date.setUTCHours(0); date.setUTCMinutes(0); date.setUTCSeconds(0)
            lesson = await client.query(`insert into schedule (name, "sequenceId", "groupId", "userId", "startDate", "endDate", visiting) values ($1,$2,$3,$4,$5,$6,$7) returning *`, [object.lessonName, seq, object.groupId, object.teacherId, new Date(date.valueOf() + startTime.valueOf()), new Date(date.valueOf() + endTime.valueOf()), visiting])
            if (lesson.rowCount === 0) {
                data.message = "Занятие не добавлено"
                data.statusCode = 500
                log(data.message)
                return data
            }
        }
        data.message = "Занятие добавлено"
        log(data.message)
        data.addedLessons = lesson.rowCount
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

async function getAllLessons(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };

    const funcName = 'getAllLessons';
    const client = await pool.connect()
    const log = (m) => console.log(`${funcName}: ${m}`)

    try {
        const lesson = await client.query(`select * from schedule`)
        data.message = "Занятия найдены"
        log(data.message)
        data.lessons = lesson.rows
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

async function updateLesson(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };

    const funcName = 'updateLesson';
    const client = await pool.connect()
    const log = (m) => console.log(`${funcName}: ${m}`)

    try {
        const lesson_find = await client.query(`select * from schedule where id = $1`, [object.lessonId])
        if (lesson_find.rows.length === 0) {
            data.message = "Занятие не найдено"
            log(data.message)
            return data
        }

        let current = lesson_find.rows[0]

        current.name = object.lessonName ?? current.name

        const startDate = object.startDate ? new Date(object.startDate) : undefined
        if (startDate && isNaN(startDate.valueOf())) {
            data.message = 'Неверное время начала'
            log(data.message)
            return data
        }
        current.startDate = startDate ?? current.startDate

        const endDate = object.endDate ? new Date(object.endDate) : undefined
        if (endDate && isNaN(endDate.valueOf())) {
            data.message = 'Неверное время конца'
            log(data.message)
            return data
        }
        current.endDate = endDate ?? current.endDate

        const group = object.groupId ? await client.query(`select * from groups where "groupId" = $1`, [object.groupId]) : undefined
        if (group && group.rows.length === 0) {
            data.message = "Группа не найдена"
            log(data.message)
            return data
        }
        current.groupId = group ? object.groupId : current.groupId

        const teacher = object.teacherId ? await client.query(`select * from users where "userId" = $1`, [object.teacherId]) : undefined
        if (teacher && teacher.rows.length === 0) {
            data.message = "Преподователь не найден"
            log(data.message)
            return data
        }
        current.teacherId = teacher ? object.teacherId : current.teacherId

        current.isDone = object.isDone ?? current.isDone

        let visiting = {}

        const groupMembers = await client.query(`select * from usersgroups where "groupId" = $1`, [object.groupId])
        for (const member of groupMembers.rows) {
            visiting[member.userId] = "not_visited"
        }

        visiting = Object.assign(visiting, current.visiting)

        for (let uid in object.visiting ?? []) {
            if (isNaN(+uid)) continue
            let user_visit = object.visiting[uid]
            const check_user = await client.query(`select * from users inner join usersgroups on usersgroups."userId" = users."userId" where users."userId" = $1 and usersgroups."groupId" = $2` , [uid, current.groupId])
            if (check_user.rows.length === 0) {
                data.message = "Пользователь не найден, или он не в текущей группе"
                data.userId = uid
                log(data.message)
                return data
            }
            visiting[uid] = user_visit
        }
        console.log(visiting)

        const lesson = await client.query(`update schedule set name = $1, "groupId" = $2, "userId" = $3, "startDate" = $4, "endDate" = $5, "isDone" = $6, visiting = $7 where "sequenceId" = $8 returning *`, [current.name, current.groupId, current.teacherId, current.startDate, current.endDate, current.isDone, visiting, current.sequenceId])
        if (lesson.rowCount === 0) {
            data.message = "Занятие не обновлено"
            data.statusCode = 500
            log(data.message)
            return data
        }

        data.message = "Занятие обновлено"
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

async function deleteLesson(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };

    const funcName = 'deleteLesson';
    const client = await pool.connect()
    const log = (m) => console.log(`${funcName}: ${m}`)

    try {
        const del_lesson = await client.query(`delete from schedule where "sequenceId" = (select "sequenceId" from schedule where id = $1)`, [object.lessonId])
        if (del_lesson.rowCount === 0) {
            data.message = "Занятие не найдено или не удалено"
            log(data.message)
            return data
        }

        data.message = "Занятие удалено"
        log(data.message)
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
    createLesson, getLesson, getAllLessons, updateLesson, deleteLesson
};