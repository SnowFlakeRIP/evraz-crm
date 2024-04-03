const { createMessage ,login, updateMessage} = require('../../handlers/chat/handler');
const { pool } = require('../../dependencies');

module.exports = function (fastify, opts, next) {
    
    fastify.route({
        url:    '/create',
        method: 'POST',
        // schema: {
        //     body: {
        //         type:       'object',
        //         properties: {
        //             userId:     {
        //                 type: 'bigint',
        //             },
        //             messageValue: {
        //                 type: 'string',
        //             },
        //         },
        //     },
        // },
        async handler(request, reply) {
            const data = await createMessage(request.body);
            reply.status(data.statusCode)
            reply.send(data)
        },
    });
    fastify.route({
        url:    '/login',
        method: 'POST',
        async handler(request, reply) {
            const data = await createMessage(request.body);
            reply.status(data.statusCode);
            reply.send(data);
        },
    });
    fastify.route({
        url:    '/update',
        method: 'POST',
        async handler(request, reply) {
            const data = await updateMessage(request.body);
            reply.status(data.statusCode);
            reply.send(data);
        },
    });
    next();
};