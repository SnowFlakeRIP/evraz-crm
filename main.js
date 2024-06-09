require('dotenv').config();
const autoload = require('@fastify/autoload');
const path = require('path');
const cors = require('@fastify/cors');
const fastify = require('fastify')({
    logger: true,
});
fastify.register(autoload, {
    dir: path.join(__dirname, './routes'),
    options: { prefix: '/api' },
});
fastify.register(cors, {
    origin: 'http://localhost:3000', // Разрешить запросы только с этого происхождения
    methods: ['GET', 'POST'], // Разрешить только определенные методы
    allowedHeaders: ['Content-Type'], // Разрешить только определенные заголовки
    credentials: true // Если необходимо передавать куки
});

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