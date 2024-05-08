const Admin = require(`../../handlers/users/admin.js`)
const checker = require(`../../hooks/admin.js`)

module.exports = function (fastify, options, next) {
    fastify.put(`/admin/updateUser`, { preHandler: checker }, Admin.updateUser)

    fastify.post(`/admin/createUser`, { preHandler: checker }, Admin.createUser)

    fastify.post(`/admin/deleteUser`, { preHandler: checker }, Admin.deleteUser)

    fastify.get(`/admin/getUserInfo`, { preHandler: checker }, Admin.getUserInfo)

    fastify.post(`/admin/createRole`, { preHandler: checker }, Admin.createRole)

    fastify.get(`/admin/getRoles`, { preHandler: checker }, Admin.getRoles)

    fastify.get(`/admin/allUsers/:page`, { preHandler: checker }, Admin.allUsers)

    fastify.get(`/admin/students`, { preHandler: checker }, Admin.getStudents)

    fastify.get(`/admin/teachers`, { preHandler: checker }, Admin.getTeachers)

    next()
}