import 'dotenv/config';

import Fastify from "fastify";
import { migration } from "./database.js";
import * as Routes from './routes.js';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3030;

const fastify = Fastify({
    logger: true
});

fastify.register(Routes.activitiesRoutes);
fastify.register(Routes.todosRoutes);

fastify.get('/', async (req, res) => {
    res.send("Hello World")
})

const startServer = async () => {
    try {
        await fastify.listen({ host: HOST, port: PORT })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

const run = async () => {
    await migration();
    await startServer();
}

run();
