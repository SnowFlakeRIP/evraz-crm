
async function createSchedule(object){
    const data ={
        message:'Япиии!',
        statusCode: 200
    }

    const funcName = 'createSchedule';

    const createSchedule= await client.query(`INSERT INTO schedule ("name", "groupId", "userId", "startDate", "endDate", "isDone", "visiting") VALUES($1,$2,$3,$4,$5,$6,$7) returning "userId"`,
        [
            object.name,
            object.groupId,
            object.userId,
            object.startDate,
            object.endDate,
            object.isDone,
            object.visiting
        ],
    );

    console.log(createSchedule)

    if(createSchedule.rowCount === 0 || createSchedule.rows.length === 0){
        console.log(`${funcName}: Запрос на создание занятия не выполнился`)

        data.message = 'Запрос на создание занятия не выполнился'
        data.statusCode = 404
        return data
    }

    return data;

}

module.exports = {
    createSchedule: createSchedule,
}
