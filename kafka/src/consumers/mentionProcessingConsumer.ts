import kafka, { TOPICS } from '../config/kafka';

const consumer = kafka.consumer({ groupId: 'mention-processing-group' });

// Function to handle collected mentions
const processMention = async (mention: any) => {
    try {
        // Here you would implement your processing logic
        console.log(`Processing mention: ${mention.content}`);

        // Add sentiment analysis, keyword extraction, etc.

        return {
            ...mention,
            processed: true,
            processingTimestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error processing mention:', error);
        return null;
    }
};

// Connect and subscribe to the topic
const startConsumer = async () => {
    try {
        await consumer.connect();
        console.log('Mention Processing Consumer connected to Kafka');

        await consumer.subscribe({
            topic: TOPICS.MENTION_COLLECTION,
            fromBeginning: false
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    if (!message.value) return;

                    const mention = JSON.parse(message.value.toString());
                    console.log(`Received mention for processing from brand ${mention.brandId}`);

                    const processedMention = await processMention(mention);

                    if (processedMention) {
                        // Here you would typically send this to another topic or save to DB
                        console.log('Mention processed successfully');
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });
    } catch (error) {
        console.error('Error starting Mention Processing Consumer:', error);
        process.exit(1);
    }
};

// Graceful shutdown
const gracefulShutdown = async () => {
    try {
        await consumer.disconnect();
        console.log('Mention Processing Consumer disconnected');
    } catch (error) {
        console.error('Error disconnecting consumer:', error);
    }
};

// Listen for shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Export functions
export { startConsumer, gracefulShutdown };