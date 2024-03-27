const { createCourse } = require('../../handlers/curse/handler');

module.exports = function (fastify, opts, next) {

    fastify.route({
        url: '/create',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    courseName:{
                        type:'string',
                    },
                    courseDescription:{
                        type:'string',
                    },
                    numberOfHours:{
                        type:'integer',
                    },
                    schedule:{
                        type:'string',
                    },
                },
            },
        },
        async handler(request,reply) {
            const data = await createCourse(request.body);
            reply.status(data.statusCode)
            reply.send(data)
        }
    })
    
    next();
};