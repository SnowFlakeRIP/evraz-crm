const Auth = require(`../../handlers/users/auth.js`)

module.exports = function (fastify, opts, next) {

    fastify.post(`/auth/login`, Auth.login)

    fastify.get(`/auth/refresh`, Auth.refresh)

    fastify.get(`/auth/me`, Auth.me)

    next()
}