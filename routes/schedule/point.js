const { createLesson, getLesson } = require('../../handlers/schedule/handler');

module.exports = function (fastify, opts, next) {
    
    fastify.route({
        url:    '/',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    lessonName: {type: 'string'},
                    teacherId: {type: 'number'},
                    groupId: {type: 'number'},
                    startDate: {type: 'number'},
                    endDate: {type: 'number'},
                },
                required: ['lessonName', 'teacherId', 'groupId', 'startDate', 'endDate']
            }
        },
        async handler(request, reply) {
            const data = await createLesson(request.body);
            reply.status(data.statusCode)
            reply.send(data);
        },
    });

    fastify.route({
        url:    '/',
        method: 'GET',
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    lessonId: {type: 'number'},
                },
                required: ['lessonId']
            }
        },
        async handler(request, reply) {
            const data = await getLesson(request.query);
            reply.status(data.statusCode)
            reply.send(data);
        },
    });
    
    next();
};