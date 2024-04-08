const Admin = require(`../../handlers/users/admin.js`)

module.exports = function (fastify, options, next) {
    fastify.put(`/admin/updateUser`, Admin.updateUser)

    fastify.post(`/admin/createUser`, Admin.createUser)

    fastify.post(`/admin/deleteUser`, Admin.deleteUser)

    fastify.get(`/admin/getUserInfo`, Admin.getUserInfo)

    fastify.post(`/admin/createRole`, Admin.createRole)

    next()
}