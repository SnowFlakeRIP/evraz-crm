const { createCourse,deleteCourse, getCourses,getCourse} = require('../../handlers/curse/handler');

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
    fastify.route({
        url: '/delete',
        method:'DELETE',
        async handler(request,reply){
            const data = await deleteCourse(request.body);
            reply.status(data.statusCode)
            reply.send(data)
        }
    })
    fastify.route({
        url: '/get',
        method: 'GET',
        async handler(request,reply){
            const data = await getCourses();
            reply.status(data.statusCode)
            reply.send(data.message)
        }})
    fastify.route({
        url: '/getOne',
        method: 'POST',
        async handler(request,reply){
            const data = await getCourse(request.body);
            reply.status(data.statusCode)
            reply.send(data.message)
        }})
    next();
};