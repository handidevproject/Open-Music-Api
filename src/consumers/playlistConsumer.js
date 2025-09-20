require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsSongsService = require('../services/postgres/PlaylistsSongsService');
const MailSender = require('../services/mail/MailSender');
const Listener = require('../listeners/Listener');

const init = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue('export:playlist', { durable: true });

    const playlistsSongsService = new PlaylistsSongsService();
    const mailSender = new MailSender();
    const listener = new Listener(playlistsSongsService, mailSender);

    console.log('📩 Worker listening on queue: export:playlist');

    channel.consume('export:playlist', (message) => {
        listener.listen(message);
        channel.ack(message);
    });
};

init();
