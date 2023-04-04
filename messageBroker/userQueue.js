const amqp = require("amqplib/callback_api");
const Account = require("../models/accountModel");

const uri = process.env.MESSAGE_BROKER;
const port = process.env.MESSAGE_BROKER_PORT;

// Memproduksi detail kos
const userQueuePublishUser = () => {
  amqp.connect(`${uri}:${port}`, (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, channel) => {
      if (err) throw err;

      const queueName = "user_queue";

      channel.assertQueue(queueName, {
        durable: false,
      });

      channel.consume(queueName, async (msg) => {
        const userId = msg.content.toString();

        // Process the request and send response back to message broker
        const user = await Account.findById(userId);

        // if(!account) return ...

        channel.assertQueue(msg.properties.replyTo, { durable: false });

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(user))
        );

        channel.ack(msg);
      });
    });
  });
};

module.exports = { userQueuePublishUser };
