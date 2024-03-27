const { createSchedule } = require('../../handlers/schedule/handler');

module.exports = function (fastify, opts, next) {

    fastify.route({
        url:    '/create',
        method: 'POST',
        schema: {
            body: {
                type:       'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    groupId:     {
                        type: 'number',
                    },
                    userId: {
                        type: 'number',
                    },
                    startDate: {
                        type: 'string'
                    },
                    endDate: {
                        type: 'string'
                    },
                    isDone: {
                        type: 'boolean'
                    },
                    visiting: {
                        type: 'object'
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