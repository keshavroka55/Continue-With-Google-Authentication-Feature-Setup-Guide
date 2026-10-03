import amqp from "amqplib";

let connection;
let channel;

export const QUEUE_NAME = "welcome_email";

export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);

        channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
        });

        console.log("RabbitMQ connected");
    } catch (error) {
        console.error("RabbitMQ connection failed:", error);
        throw error;
    }
};

export const getRabbitChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }

    return channel;
};