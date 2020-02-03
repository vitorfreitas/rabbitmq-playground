const open = require('amqplib').connect('amqp://localhost');

const queueName = 'hello';

async function createChannel(conn) {
  const channel = await conn.createChannel();

  return {
    conn,
    channel,
  };
}

async function consumeFromChannel({channel}) {
  await channel.assertQueue(queueName, {durable: false});
  channel.consume(queueName, logQueueMessage, {
    noAck: true,
  });
}

function logQueueMessage(message) {
  console.log(message.content.toString());
}

function init() {
  open
    .then(createChannel)
    .then(consumeFromChannel)
    .catch(err => console.warn(err));
}

init();
