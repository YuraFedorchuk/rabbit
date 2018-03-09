const amqp = require('amqplib');

let con = null;

async function init() {
    try {

        con = await amqp.connect('amqp://localhost');

        const channel = await con.createChannel();

        const q = 'task_queue';

        await channel.assertQueue(q, { durable: true });
        await channel.prefetch(1);
        
        console.log(` [*] Waiting for messages in ${q}. To exit press CTRL+C`);

        channel.consume(q, (msg) => {
            console.log(` [x] Received: ${msg.content.toString()}`);

            setTimeout(() => { 
                console.log('Done'); 
                channel.ack(msg); 
            }, 3000);
        }, { noAck: false });

    } catch(e) {
        throw e;
    }
};

init().catch(e => { console.log(e); });

['SIGINT'].map((event) => {
    process.on(event, () => {
        con.close();
        console.log('Connection closed');
        process.exit(0);
    });
})