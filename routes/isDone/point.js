const { getIsDoneSchedule } = require('../../handlers/isDone/handler');

module.exports = function (fastify, opts, next) {

    fastify.route({
        url:    '/schedule/isDone',
        method:'GET',
        async handler(request, reply) {
            const data = await getIsDoneSchedule();
            reply.status(data.statusCode)
            reply.send(data);
        },
    });

    next();
};