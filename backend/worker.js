import { sendWelcomeEmail } from "./src/services/email/welcomeEmail.js";


import amqp from "amqplib";
import "dotenv/config";

const QUEUE_NAME = "welcome_email";


console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_SECURE:", process.env.EMAIL_SECURE);

const startWorker = async () => {
    try {
        const connection = await amqp.connect(
            process.env.RABBITMQ_URL
        );

        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, {
            durable: true,
        });

        channel.prefetch(5);

        console.log("🐇 RabbitMQ worker connected");
        console.log(`👂 Waiting for messages from "${QUEUE_NAME}"`);

        channel.consume(QUEUE_NAME, async (message) => {
            if (!message) return;

            try {
                const event = JSON.parse(
                    message.content.toString()
                );

                console.log("📩 Received event:");
                console.log(event);

                // We will add this later
                await sendWelcomeEmail(event.data);

                console.log(
                    `📧 Email should be sent to ${event.data.email}`
                );

                channel.ack(message);

                console.log("✅ RabbitMQ message acknowledged");

            } catch (error) {
                console.error(
                    "❌ Failed to process message:",
                    error
                );

                channel.nack(message, false, true);
            }
        });

    } catch (error) {
        console.error(
            "❌ RabbitMQ worker failed:",
            error
        );

        process.exit(1);
    }
};

startWorker();