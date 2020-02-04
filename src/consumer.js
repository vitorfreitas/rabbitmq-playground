const open = require('amqplib').connect('amqp://localhost');

const queueName = 'new_hello';

async function createChannel(conn) {
  const channel = await conn.createChannel();

  return { conn, channel };
}

async function consumeFromChannel({ channel }) {
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, msg => logMessageAndSendAck(msg, channel));
}

function logMessageAndSendAck(message, channel) {
  console.log(message.content.toString());
  channel.ack(message);
}

function init() {
  open
    .then(createChannel)
    .then(consumeFromChannel)
    .catch(err => console.warn(err));
}

init();
