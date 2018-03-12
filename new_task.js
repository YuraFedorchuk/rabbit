const amqp = require('amqplib');

let con = null;

async function init() {
    try {
        con = await amqp.connect('amqp://localhost');
    
        const channel = await con.createChannel();

        const q = 'task_queue';
        const message = 'Hello world!';
        
        /**
         * { durable: true }
         * if rabbitmq crashes it will not forget the queue
         */
        await channel.assertQueue(q, { durable: true });

        /**
         * { persistant: true }
         * if rabbitmq crashs it will not forget the message 
         */
        await channel.sendToQueue(q, Buffer.from(message), { persistent: true });

        console.log(` [x] Sent message: ${message}`);
    
    } catch(e) {
        throw e;
    }
}

init().catch(e => { console.log(e); });

['SIGINT'].map((event) => {
    process.on(event, () => {
        con.close();
        console.log('Connection closed');
        process.exit(0);
    });
});