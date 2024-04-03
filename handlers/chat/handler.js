const bcrypt = require('bcryptjs')
const { pool } = require('../../dependencies');
const jwt =require("jsonwebtoken")
async function createMessage(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };
    
    const funcName = 'createMessage';
    const client = await pool.connect();
    
    try {
        console.log(object.userId)
        // Проверяем, что пользователя с такой почтой нет на платформе
        
        // const checkUser = await client.query(`SELECT *
        //                                       FROM users
        //                                       WHERE "userEmail" = $1`, [ object.userEmail ]);
        
        // if (checkUser.rows.length > 0) {
        //     console.log(`${funcName}: Пользователь с такой почтой уже зарегистрирован`);
        //
        //     data.message = 'Пользователь с такой почтой уже зарегистрирован'
        //     return data
        // }
        // const password = await bcrypt.hashSync(object.userPassword, 10);
        const createUser = await  client.query(`INSERT INTO message("userId","messageValue")
                                               VALUES ($1, $2)
                                               RETURNING "messageId"`,
            [
                object.userId,
                object.messageValue,
            ],
        );
        // if (checkUser.rows.length > 0) {
        //     console.log(`${funcName}: Запрос не выполнен`);
        //
        //     data.message = 'Запрос не выполнен'
        //     return data
        // }
        // const {userId}=createUser.rows[0]
        // const createBio = await  client.query(`INSERT INTO bio("bioName","bioMiddleName","bioLastName","bioBirthDay","userId")
        //                                        VALUES ($1, $2, $3, $4, $5)
        //                                        RETURNING "bioName"`,
        //     [
        //         object.bioName,
        //         object.bioMiddleName,
        //         object.bioLastName,
        //         object.bioBirthDay,
        //         userId,
        //     ],
        // );
        // console.log(createBio.rows[0].bioName);
        // console.log(password)
        console.log("все зашибись")
        // const createUser = await  client.query(`INSERT INTO chat("userPhone","userEmail","userPassword")
        //                                         VALUES `)
        data.message="excellent"
        data.statusCode=200
    }
    catch (err) {
        console.log(`${ funcName }: CATCH ERROR`);
        console.log(err.message, err.stack);
    }
    finally {
        client.release();
        console.log(`${ funcName }: client release()`);
    }
    
    return data;
}
async function updateMessage(object){
    const data = {
        message:    'error',
        statusCode: 400,
        messageValue:[]
    };
    const  funcName = 'updateMessage'
    const client = await pool.connect()
    try {
        const message = await client.query(`select "messageValue"
                                         from message
                                         where "userId"=$1`,[object.userId])

        data.message="excellent"
        data.statusCode=200
        data.messageValue=message.rows
    }
    catch (err) {
        console.log(`${ funcName }: CATCH ERROR`);
        console.log(err.message, err.stack);
    }
    finally {
        client.release();
        console.log(`${ funcName }: client release()`);
    }

    return data;

}
async function login(object){
    const data={
        message:"error",
        StatusCode:400,
    }
    const  funcNam = 'login'
    const client = await pool.connect()
    try{
        const login=object.login
        const password =object.password
        const user = await client.query(`select "userPassword","userEmail","userTelegramChatId","userId"
                                         from users
                                         where "userPhone"=$1`,[login])
        if (user.rows.length===0){
            console.log(`${funcNam}:жопа чел userPhone ${login} не найден`)
            return data
        }else{
            console.log("чел найден")
        }
        const {userPassword,
            userEmail,
            userTelegramChatId,
            userId
        } = user.rows[0]
        const pas = await bcrypt.compare(password,userPassword)
        if (!pas){
            console.log("ура с новым годом")
        }else{
            console.log("поражение")
        }
        const token=await jwt.sign({userEmail,userTelegramChatId,userId},'1234',{expiresIn: 60000})
        data.message={
            access:token
        }
        data.StatusCode=200
    } catch (e) {

    }
    finally {
        client.release()
        console.log(`${funcNam}:client release`)
    }
    return data
}
module.exports = {
    createMessage: createMessage,
    login:login,
    updateMessage: updateMessage
};