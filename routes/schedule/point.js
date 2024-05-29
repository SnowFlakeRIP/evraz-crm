const { createLesson, getLesson, getAllLessons, updateLesson, deleteLesson } = require('../../handlers/schedule/handler');

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
                    weekDay: {type: 'number'},
                    startTime: {type: 'number'},
                    endTime: {type: 'number'},
                },
                required: ['lessonName', 'teacherId', 'groupId', 'startDate', 'endDate', 'weekDay', 'startTime', 'endTime']
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

    fastify.route({
        url:    '/all',
        method: 'GET',
        async handler(request, reply) {
            const data = await getAllLessons(request.query);
            reply.status(data.statusCode)
            reply.send(data);
        },
    });

    fastify.route({
        url:    '/',
        method: 'PUT',
        schema: {
            body: {
                type: 'object',
                properties: {
                    lessonId: {type: 'number'},
                    lessonName: {type: 'string'},
                    teacherId: {type: 'number'},
                    groupId: {type: 'number'},
                    startDate: {type: 'number'},
                    endDate: {type: 'number'},
                    isDone: {type: 'boolean'},
                    visiting: {
                        type: 'object',
                        patternProperties: {
                            "^\\d+$": {enum: ["not_visited", "visited", "sick", "good_reason"]}
                        }
                    },
                    updateAll: {type: 'boolean'}
                },
                required: ['lessonId', 'updateAll']
            }
        },
        async handler(request, reply) {
            const data = await updateLesson(request.body);
            reply.status(data.statusCode)
            reply.send(data);
        },
    });

    fastify.route({
        url:    '/',
        method: 'DELETE',
        schema: {
            body: {
                type: 'object',
                properties: {
                    lessonId: {type: 'number'},
                    deleteAll: {type: 'boolean'}
                },
                required: ['lessonId', 'deleteAll']
            }
        },
        async handler(request, reply) {
            const data = await deleteLesson(request.body);
            reply.status(data.statusCode)
            reply.send(data);
        },
    });
    
    next();
};