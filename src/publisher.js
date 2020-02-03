const open = require('amqplib').connect('amqp://localhost');

const queueName = 'hello';

async function createChannel(conn) {
  const channel = await conn.createChannel();

  return {
    conn,
    channel,
  };
}

async function publishDefaultMessage({conn, channel}) {
  await channel.assertQueue(queueName, {durable: false});
  channel.sendToQueue(queueName, Buffer.from('Incredible message'));

  return {
    conn,
    channel,
  };
}

async function closeConnection({conn, channel}) {
  await channel.close();
  await conn.close();
}

function init() {
  open
    .then(createChannel)
    .then(publishDefaultMessage)
    .then(closeConnection)
    .then(() => process.exit(0))
    .catch(err => console.warn(err));
}

init();
