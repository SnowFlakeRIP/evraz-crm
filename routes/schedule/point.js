const { addEventToSchedule } = require('../../handlers/schedule/handler');
const { checkAllEventsOfSchedule } = require('../../handlers/schedule/handler');

module.exports = function (fastify, opts, next) {

    fastify.route({
        url:    '/add',
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
            const data = await addEventToSchedule(request.body);
            reply.status(data.statusCode)
            reply.send(data)
        },
    });

    fastify.route({
        url: '/check',
        method: 'GET',
        async handler(request, reply) {
            const data = await checkAllEventsOfSchedule();
            reply.status(data.statusCode)
            reply.send(data)
        },
    });

    next();
};