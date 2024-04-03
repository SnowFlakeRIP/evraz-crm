// const { pool } = require('../../dependencies');
const fs = require('fs')
async function getTestData(object) {
    const data = {
        message:    'error',
        statusCode: 400,
    };
    
    const funcName = 'getTestData';
    // const client = await pool.connect();
    
    try {
        // const dataFromDatabase = await client.query(``)
        
        const dataFromDatabase = {
            rows: [
                {
                    id:   1,
                    name: 'test',
                },
            ],
        };
        
        if (dataFromDatabase.rows.length === 0) {
            console.log(`${ funcName }: Ошибка при получении данных для генерации документа`);
            
            return data;
        }
        else {
            console.log(`${ funcName }: Данные для формирования документа успешно получены`);
        }
        
        data.message = dataFromDatabase.rows[0];
        data.statusCode = 200;
    }
    catch (err) {
        console.log(`${ funcName }: CATCH ERROR`);
        console.log(err.message, err.stack);
    }
    finally {
        // client.release();
        console.log(`${ funcName }: client release()`);
    }
    
    return data;
}

async function docFileFromStream(document, path, isUpload, isHand = false) {
    const chunks = [];
    let result = null;
    return new Promise(function (resolve, reject) {
        try {
            document.on('data', function (chunk) {
                chunks.push(chunk);
            });
            document.on('end', async function () {
                result = Buffer.concat(chunks);
                console.log('end');
                if (isUpload)
                    resolve(result);
                else {
                    console.log('saving file by path');
                    fs.writeFileSync(path, result);
                    if (isHand) {
                        resolve(result);
                    }
                    else {
                        resolve(result.toString('base64'));
                    }
                }
            });

            document.on('error', reject);
            document.end();

        }
        catch (error) {
            console.log('docFileFromStream ERROR');
            console.log(error);
            reject(null);
        }
    });
}

module.exports = {
    getTestData:       getTestData,
    docFileFromStream: docFileFromStream,
    
};