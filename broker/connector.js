const amqp = require('amqplib');
const logger = { info: console.log, error: console.error };

const endpoint = 'amqp://localhost';

class RabbitConnector {
    constructor(options) {
        this.endpoint = options.endpoint;
        this.conn = null;

        await this.start();
    }
    async start() {
        this.conn = await amqp.connect(this.endpoint);
        logger.info(` [x] RabbitMQ connection on ${this.endpoint} established`);
    }
    async stop() {
        await this.conn.close();
        logger.info(` [x] RabbitMQ connection on ${this.endpoint} closed`);
    }
    get getEndpoint() {
        return this.endpoint;
    }
    onerror(e) {
        logger.error(e);
        throw e;
    }
}