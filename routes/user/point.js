const { createUser } = require('../../handlers/user/handler');

module.exports = function (fastify, opts, next) {

    fastify.route({

        url:    '/create',
        method:'POST',
        async handler(request, reply) {
            const data = await createUser(request.body);
            reply.status(data.statusCode)
            reply.send(data);
        },
    });

    next();
};