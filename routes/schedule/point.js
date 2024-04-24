const { createSchedule } = require('../../handlers/schedule/handler');

module.exports = function (fastify, opts, next) {
    
    fastify.route({
        url:    '/create',
        method:'GET',
        async handler(request, reply) {
            const data = await createSchedule(request.body);
            reply.status(data.statusCode)
            reply.send(data);
        },
    });
    
    next();
};