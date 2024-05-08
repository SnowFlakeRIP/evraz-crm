
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

}
