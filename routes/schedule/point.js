const { createSchedule } = require('../../handlers/schedule/handler');
const {test} = require("../../handlers/test/handler");

module.exports = function (fastify, opts, next) {

    fastify.route({
        url:    '/create',
        method: 'POST',
        schema: {
            body: {
                type:       'object',
                properties: {
                    groupId:     {
                        type: 'number',
                    },
                    userId: {
                        type: 'number',
                    },
                },
            },
        },
        async handler(request, reply) {
            const data = await createSchedule(request.body);
            reply.status(data.statusCode)
            reply.send(data)
        },
    });

    next();
};