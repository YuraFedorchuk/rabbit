const amqp = require('amqplib');

let con = null;

async function init() {
    try {
        con = await amqp.connect('amqp://localhost');

        const ch = await con.createChannel();

        const message = 'Hello world!';
        const ex = 'logs3';

        const arg = process.argv.slice(2).join('.');

        await ch.assertExchange(ex, 'topic', { durable: false });
        
        /**
         * Empty string as second parameter means that it
         * doesn't matter what queue we use
         */
        await ch.publish(ex, arg, new Buffer(message));

        console.log(` [x] Sent message: ${message}`);

    } catch (e) {
        throw e;
    }
}

init().catch(e => { console.log(e); process.exit(1) });

setTimeout(function () { con.close(); process.exit(0) }, 500);