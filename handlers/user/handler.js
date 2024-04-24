const {pool} = require('../../dependencies')

async function createUser(object){
    const data ={
        message:'Япиии!',
        statusCode: 200
    }

    const funcName = 'createUser';
    const client = await pool.connect()

    const createUser= await client.query(`INSERT INTO users ("userEmail", "userPassword", "userPhone", "userTelegramChatId", "userActive", "userRole") VALUES($1,$2,$3,$4,$5,$6) returning "userId"`,
        [
            object.userEmail,
            object.userPassword,
            object.userPhone,
            object.userTelegramChatId,
            object.userActive,
            object.userRole
        ],
    );

    console.log(createUser)

    if(createUser.rowCount === 0 || createUser.rows.length === 0){
        console.log(`${funcName}: Запрос на создание пользователя не выполнился`)

        data.message = 'Запрос на создание пользователя не выполнился'
        data.statusCode = 404
        return data
    }

    return data;
}

module.exports = {
    createUser: createUser,
}