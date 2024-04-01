const { jwtDecode } = require(`jwt-decode`)
const jwt = require(`jsonwebtoken`)
const fp = require(`fastify-plugin`)


module.exports = fp((fastify, options, next) => {
    fastify.addHook(`preHandler`, (request, reply, next) => {
        if (request.method === `OPTIONS` || request.url === `/users/auth/register` || request.url === `/users/auth/login` || request.url === `/users/auth/refresh`) {
            return next()
        }

        const header = request.headers.authorization

        if (!header) {
            return reply.status(401).send({ message: `No Access Token` })
        }

        try {
            const token = header.split(` `)[1]

            jwt.verify(token, process.env.SECRET_KEY)

            const parsed = jwtDecode(token)

            if (request.method === "GET") {
                request.body = {}
                request.body.id = parsed.id
            }
            else {
                request.body.id = parsed.id
            }
            next()
        } catch(err) {
            return reply.status(403).send({ message: `Access Token Invalid` })
        }
    })

    next()
})
