const redis = require('redis');
const amqp = require('amqplib');

// ---- 1. REDIS BAĞLANTISI ----
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().then(() => console.log('Redis bağlantısı başarılı.')).catch(console.error);

// ---- 2. RABBITMQ KANALI ----
async function sendOrderToQueue(orderData) {
    try {
        const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
        const connection = await amqp.connect(rabbitUrl);
        const channel = await connection.createChannel();
        
        const queueName = 'order_queue';
        await channel.assertQueue(queueName, { durable: true });
        
        // Siparişi kuyruğa fırlat (Buffer formatında)
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(orderData)), { persistent: true });
        console.log('Sipariş RabbitMQ kuyruğuna eklendi:', orderData);
        
        setTimeout(() => connection.close(), 500);
        return true;
    } catch (error) {
        console.error('RabbitMQ Hatası:', error);
        return false;
    }
}

module.exports = { redisClient, sendOrderToQueue };