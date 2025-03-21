import kafka, { TOPICS } from '../config/kafka';

const producer = kafka.producer();

// Connect to Kafka on startup
const connectProducer = async () => {
    try {
        await producer.connect();
        console.log('Mention Collection Producer connected to Kafka');
    } catch (error) {
        console.error('Error connecting Mention Collection Producer:', error);
        process.exit(1);
    }
};

// Function to send collection tasks to Kafka
export const sendCollectionTask = async (task: any) => {
    try {
        await producer.send({
            topic: TOPICS.MENTION_COLLECTION,
            messages: [
                {
                    key: task.brandId.toString(),
                    value: JSON.stringify(task)
                }
            ],
        });
        console.log(`Collection task sent for brand ${task.brandId}`);
        return true;
    } catch (error) {
        console.error('Error sending collection task:', error);
        return false;
    }
};

// Graceful shutdown
const gracefulShutdown = async () => {
    try {
        await producer.disconnect();
        console.log('Mention Collection Producer disconnected');
    } catch (error) {
        console.error('Error disconnecting producer:', error);
    }
};

// Listen for shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Export functions
export { connectProducer, gracefulShutdown };