const { getTestData, docFileFromStream } = require('../../handlers/documents/handler');
const pdfMakePrinter = require('pdfmake/src/printer');
const { constants } = require('../../dependencies');
const { firstForm } = require('../../services/documents/create');


module.exports = function (fastify, opts, next) {
    
    fastify.route({
        url:    '/test',
        method: 'GET',
        async handler(request, reply) {
            const data = await getTestData(request.body);
            
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
    
    next();
};