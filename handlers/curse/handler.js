const {pool} = require('../../dependencies')

async function createCourse(object) {
    let data = {
        message: 'err',
        statusCode: 400
    }

    const funcName = 'createUser'
    const client = await pool.connect()

    try {
        const createCourse = await client.query(`insert into courses ("courseName","courseDescription") 
values ($1,$2) returning "courseId"`,
            [
                object.courseName,
                object.courseDescription
            ])

    } catch (err){
        console.log(`${funcName}:error`)
    } finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }
    return date

}
module.exports = {
    createCourse:createCourse
}