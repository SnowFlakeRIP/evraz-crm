const { getActiveUsers } = require('../../handlers/statistics/handler');

module.exports = function (fastify, opts, next) {

    fastify.route({
        url:    '/users/active',
        method:'GET',
        async handler(request, reply) {
            const data = await getActiveUsers();
            reply.status(data.statusCode)
            reply.send(data);
        },
    });

    next();
};