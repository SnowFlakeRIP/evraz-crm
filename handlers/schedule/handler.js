
async function createSchedule(object){
    const data ={
        message:'Япиии!',
        statusCode: 200
    }

    const funcName = 'createSchedule';

    const createSchedule= await client.query(`INSERT INTO schedule ("name", "userEmail", "userPassword") VALUES($1,$2,$3) returning "userId"`,
        [
            object.userPhone,
            object.userEmail,
            password
        ],
    );

}
