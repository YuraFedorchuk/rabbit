const amqp = require('amqplib');

let con = null;

async function init() {
    try {

        con = await amqp.connect('amqp://localhost');

        const channel = await con.createChannel();

        const q = 'task_queue';

        await channel.assertQueue(q, { durable: true });
        
        /**
         * channel.prefetch(1)
         * not to give more than one message to a worker at a time
         */
        await channel.prefetch(1);
        
        console.log(` [*] Waiting for messages in ${q}. To exit press CTRL+C`);

        channel.consume(q, (msg) => {
            console.log(` [x] Received: ${msg.content.toString()}`);

            setTimeout(() => { 
                console.log('Done');
                
                /**
                 * channel.ack(message)
                 * confirmation for rabbit from the consumer that the
                 * message is delivered
                 */
                channel.ack(msg); 
            }, 3000);

        /**
         * noAck: false
         * use acknowledgments (that is confirmation)
         */
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