const {pool} = require('../../dependencies')

async function createCourse(object) {
    let data = {
        message: 'err',
        statusCode: 400
    }

    const funcName = 'createUser'
    const client = await pool.connect()

    try {
        const createCourse = await client.query(`insert into courses ("courseName","courseDescription","numberOfHours","schedule") 
values ($1,$2,$3,$4) returning "courseId"`,
            [
                object.courseName,
                object.courseDescription,
                object.numberOfHours,
                object.schedule
            ])
        data =  {
            message: 'все хоршо',
            statusCode: 200
        }

    } catch (err){
        console.log(`${funcName}:error`)
        console.log(err)
    } finally {
        client.release()
        console.log(`${funcName}: client release()`);
    }
    return data

}
module.exports = {
    createCourse:createCourse
}