const Lk = require(`../../handlers/users/lk.js`)

module.exports = function(fastify, options, next) {
    fastify.put(`/lk/userUpdate`, Lk.updateUser)

    fastify.put(`/lk/deactivate`, Lk.deactivate)

    next()
}