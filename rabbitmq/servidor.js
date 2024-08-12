const express = require('express');
const amqp = require('amqplib');

const app = express();
const PORT = 3000;
const QUEUE = 'show';

app.use(express.json());

let channel, connection;

// Conecta ao RabbitMQ
async function connectRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

// Rota para enviar mensagem
app.post('/send', async (req, res) => {
  const message = req.body.message;
  if (!message) {
    return res.status(400).send({ error: 'Message is required' });
  }
  try {
    channel.sendToQueue(QUEUE, Buffer.from(message));
    res.send({ message: 'Message sent to queue' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to send message' });
  }
});

// Rota para receber mensagens
app.get('/receive', async (req, res) => {
  try {
    const msg = await channel.get(QUEUE, { noAck: false });
    if (msg) {
      res.send({ message: msg.content.toString() });
    } else {
      res.send({ message: 'No messages in queue' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to receive message' });
  }
});

// Iniciar o servidor e conectar ao RabbitMQ
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectRabbitMQ();
});