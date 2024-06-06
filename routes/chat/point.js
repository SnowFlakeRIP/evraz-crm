const { createMessage ,login, updateMessage} = require('../../handlers/chat/handler');
const { pool } = require('../../dependencies');

module.exports = function (fastify, opts, next) {
    
    fastify.route({
        url:    '/create',
        method: 'POST',
        async handler(request, reply) {
            const data = await createMessage(request.body);
            reply.status(data.statusCode)
            reply.send(data)
        },
        wsHandler: (conn, req) => {
            // WebSocket message
            conn.socket.send('Hello Fastify WebSockets');
        }
    });
    fastify.route({
        method: 'GET',
        url: '/hello',
        handler: (req, reply) => {
            // HTTP response
            reply.send({ message: 'Hello Fastify' });
        },
        wsHandler: (conn, req) => {
            // WebSocket message
            console.log(conn)
            conn.socket.send('Hello Fastify WebSockets');
        }
    });
    fastify.route({
        url:    '/login',
        method: 'POST',
        async handler(request, reply) {
            const data = await createMessage(request.body);
            reply.status(data.statusCode);
            reply.send(data);
        },
    });
    fastify.route({
        url:    '/update',
        method: 'POST',
        async handler(request, reply) {
            const data = await updateMessage(request.body);
            reply.status(data.statusCode);
            reply.send(data);
        },
    });
    next();
};