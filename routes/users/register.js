const { register } = require(`../../handlers/users/registerhandler.js`)

module.exports = function (fastify, opts, next) {
    fastify.route({
        url: `/register`,
        method: "POST",
        schema: {

        },
        async handler(request, reply) {
            const data = await register(request.body)
            reply.status(data.statusCode).send(data.message)
        }
    })

    next()
}