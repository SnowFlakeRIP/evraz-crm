const {pool} = require('../../dependencies')

async function createCourse(object) {
    let data = {
        message: 'err',
        statusCode: 400
    }

    const funcName = 'createUser'
    const client = await pool.connect()

    try {
        const createCourse = await client.query(`insert into courses ("courseName", "courseDescription", "numberOfHours", "schedule")
                                                 values ($1, $2, $3, $4)
                                                 returning "courseId"`,
            [
                object.courseName,
                object.courseDescription,
                object.numberOfHours,
                object.schedule
            ]
        )

        //todo: проверка результата запроса
        console.log(createCourse.rows[0].courseId)

        data.message = {courseId: createCourse.rows[0].courseId}
        data.statusCode = 200
    }
    catch (err) {
        console.log(`${funcName}:error`)
        console.log(err.message, err.stack)
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }

    return data
}

async function deleteCourse(object){
    let data = {
        message:'error',
        statusCode:400
    }

    let client = await pool.connect()
    let funcName = 'deleteCourse'

    try {
        const deleteCourse = await client.query(`delete from courses where "courseId" = $1`,[object.courseId])
        data.message = 'good'
        data.statusCode = 200
    }
    catch (err) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(err.message, err.stack);
    }
    finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }
    return data
}


async function getCourses(){
    let data = {
        message: 'error',
        statusCode: 400
    }
    let client = await pool.connect()
    let funcName = 'getCourses'
    try {
        const getCourses = await client.query(`select "courseName","courseDescription" from courses`)
        data.message =   getCourses.rows
        data.statusCode = 200

    } catch (err) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }
    return data
}
async function getCourse(object){
    let data = {
        message: 'error',
        statusCode: 400
    }
    let client = await pool.connect()
    let funcName = 'getCourse'
    try {
        const getCourse = await client.query(`select * from courses where "courseId" = $1`,[object.courseId])
        data.message =   getCourse.rows
        data.statusCode = 200

    } catch (err) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }
    return data
}

async function updateCourse(object){
    let data = {
        message: 'error',
        statusCode: 400
    }
    let client = await pool.connect()
    let funcName = 'updateCourse'
    try {
        const updateCourse = await client.query(`update courses set "courseName" = $1,"courseDescription" = $2, "numberOfHours"=$3,"schedule"=$4 where "courseId"=$5`,[
            object.courseName,
            object.courseDescription,
            object.numberOfHours,
            object.schedule,
            object.courseId
        ])//ПЛЛУЧИЛОСЬ
        data.statusCode = 200

    } catch (err) {
        console.log(`${funcName}: CATCH ERROR`);
        console.log(err.message, err.stack);
    } finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }
    return data
}
module.exports = {
    createCourse:createCourse,
    deleteCourse:deleteCourse,
    getCourses:getCourses,
    getCourse:getCourse,
    updateCourse:updateCourse
}