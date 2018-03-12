const amqp = require('amqplib');

let con = null;

async function init() {
    try {
        const ex = 'logs3';

        con = await amqp.connect('amqp://localhost');

        const ch = await con.createChannel();

        const args = process.argv.slice(2);
        
        /**
         * creating exchange for all subscribers 
         */
        await ch.assertExchange(ex, 'topic', { durable: false });

        /**
         * creating queue with random name
         */
        const q = await ch.assertQueue('', { exclusive: true });

        /**
         * binding queue to an exchange
         */
        args.map(async level => await ch.bindQueue(q.queue, ex, level));

        ch.consume(q.queue, function (msg) {
            console.log(" [x] %s", msg.content.toString());
        }, { noAck: true });

    } catch (e) {
        throw e;
    }
};


init().catch(e => { console.log(e); process.exit(1) });