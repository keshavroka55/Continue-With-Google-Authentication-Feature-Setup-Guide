import {getRabbitChannel,QUEUE_NAME,} from "../config/rabbitmq.js";


export const publishUserRegisteredEvent = async (user) => {
    const channel = getRabbitChannel();

    const event = {
        event: "USER_REGISTERED",
        data: {
            userId: user.id,
            name: user.name,
            email: user.email,
        },
        createdAt: new Date().toISOString(),
    };

    channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(JSON.stringify(event)),
        {
            persistent: true,
        }
    );

    console.log("USER_REGISTERED event published:", event);
};