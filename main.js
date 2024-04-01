require('dotenv').config();
const autoload = require('@fastify/autoload');
const path = require('path');
const fastify = require('fastify')({
    logger: true,
});
fastify.register(autoload, {
    dir: path.join(__dirname, './routes'),
});
fastify.register(require(`./hooks/authorization.js`))
fastify.register(require(`@fastify/cors`), {
    origin: `${process.env.API_CLIENT_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"]
})

const start = async () => {
    try {
        await fastify.listen({ port: process.env.H_PORT, host: process.env.H_IP });
        console.log(`start server on ${ process.env.H_IP }:${ process.env.H_PORT } success`);
    }
    catch (err) {
        console.log('start_server_error', err);
        process.exit(1);
    }
};

start();