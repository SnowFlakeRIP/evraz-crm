const { getDataForDocPDF, docFileFromStream } = require('../../handlers/documents/handler');
const pdfMakePrinter = require('pdfmake/src/printer');
const { constants } = require('../../dependencies');
const { firstForm } = require('../../services/documents/create');


module.exports = function (fastify, opts, next) {
    
    fastify.route({
        url:    '/test',
        method: 'GET',
        async handler(request, reply) {
            const data = await getDataForDocPDF(request.body);
            
            if (data.statusCode !== 200) {
                reply.status(data.statusCode);
                reply.send(data.message);
                
                return;
            }
            
            const path = './test.pdf';
            const printer = new pdfMakePrinter(constants.fonts);
            const doc = printer.createPdfKitDocument(firstForm(data.message));
            // true - если хотим файл отдать на фронт, false если хотим файл сохранить в систему
            const upload = true;
            
            const docFile = await docFileFromStream(doc, path, upload);
            console.log(docFile);
            if (upload) {
                reply.header('Content-Type', 'application/pdf');
                reply.send(docFile);
            }
            else {
                reply.status(data.statusCode);
                reply.send({ message: 'success', statusCode: 200 });
            }
        },
    });

    fastify.route({
        method: 'POST',
        url:    '/act2',
        schema: {
            response: {
                400: {
                    type:       'object',
                    properties: {
                        message:    { type: 'string' },
                        statusCode: { type: 'integer' },
                    },
                },
            },
        },
        async handler(request, reply) {
            let data = {
                message:    'error',
                statusCode: 400,
            };
            try {
                data = await job.act2NotSigned();
                if (data.statusCode !== 200) {
                    reply.status(400);
                    reply.send(data);
                }
                else {
                    reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    reply.send(data.message.data);
                }
            } catch (e) {
                winston.infoLog(e);
                reply.code(400);
                reply.send(data);
            }
        },
    });
    next();
};