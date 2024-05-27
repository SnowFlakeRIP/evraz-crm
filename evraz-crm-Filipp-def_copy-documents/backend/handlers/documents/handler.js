const { pool } = require('../../dependencies');
const fs = require('fs')
const ExcelJS = require('exceljs')
async function getDataForDocPDF(object) {
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

async function createBasicXLSX(columns, rows) {
    let data = {
        buffer: null,
        error:  null,
    };

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Лист 1');
        worksheet.columns = columns;
        worksheet.addRows(rows);

        data.buffer = await workbook.xlsx.writeBuffer();
    } catch (e) {
        data.error = e;
    }

    return data;
}

async function act2NotSigned() {
    let data = {
        message:    'error',
        statusCode: 400,
    };
    let client = await pool.connect();

    try {
        const queryProjects = `SELECT "userId" FROM users`;
        const resProjects = await client.query(queryProjects);
        console.log(resProjects.rows)
        if (resProjects.rows.length > 0) {
            const columns = [
                { header: 'ФИО', key: 'fio', width: 45 },
                { header: 'Телефон', key: 'userPhone', width: 13 },
                { header: 'Номер проекта', key: 'projectId', width: 15 },
                { header: 'Дата выдачи займа', key: 'projectDateGiveLoan', width: 20 },
            ];

            const { buffer, error } = await createBasicXLSX(columns, resProjects.rows);

            if (buffer) {
                data.message = { data: buffer };
                data.statusCode = 200;
            }
            else if (error) {
                console.log(error) ;
            }
        }
        else {
            data.message = 'NOT FOUND';
        }
    } catch (e) {
        console.log(e.stack, e.message);
        data = {
            message:    e.message,
            statusCode: 400,
        };
    } finally {
        client.release();
        console.log('Release client');
    }

    return data;
}





module.exports = {
    getDataForDocPDF:  getDataForDocPDF,
    docFileFromStream: docFileFromStream,
    act2NotSigned:     act2NotSigned,
    
};