const amqp = require('amqplib');

let conn = null;

async function init() {
    try {
        conn = await amqp.connect('amqp://localhost');
        
        const ch = await conn.createChannel();
        const ch1 = await conn.createChannel();
        const ch2 = await conn.createChannel();

        console.log(ch, '\n\n\n\n', ch1, '\n\n\n\n\n', ch2);

        const rpcQueue = 'rpc_queue';

        const q = await ch.assertQueue('', { exclusive: true });
        
        ch.consume(q.queue, async (msg) => {
            console.log(` [x] Received response ${msg.content.toString()}`);
            
            setTimeout(function () { conn.close(); process.exit(0) }, 500);
        }, { noAck: true });
        
        
        // await ch.sendToQueue(rpcQueue, 
        //     Buffer.from('Hi from client'), {
        //         correlationId: Math.random().toString(),
        //         replyTo: q.queue
        //     });

        // console.log(` [x] Sent message`);

    } catch (e) {
        throw e;
    }
}

init().catch(e => { console.log(e); process.exit(1) });