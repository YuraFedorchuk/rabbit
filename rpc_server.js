const amqp = require('amqplib');

let con = null;

async function init() {
    try {
        con = await amqp.connect('amqp://localhost');

        const ch = await con.createChannel();

        const q = 'rpc_queue';
        
        await ch.assertQueue(q, { exclusive: true });
        await ch.prefetch(1);

        ch.consume(q, async (msg) => {

            console.log(` [x] Message received ${msg.content.toString()}`);

            await ch.sendToQueue(msg.properties.replyTo, 
                Buffer.from('Hi from server'), {
                    correlationId: msg.properties.correlationId
                });

            console.log(' [x] Sent response');

            await ch.ack(msg);

        }, { noAck: false });  

    } catch (e) {
        throw e;
    }
}

init().catch(e => { console.log(e); process.exit(1) });