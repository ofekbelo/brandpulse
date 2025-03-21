import { createTopics } from './config/kafka';
import { connectProducer } from './producers/mentionCollectionProducer';
import { startConsumer } from './consumers/mentionProcessingConsumer';

const start = async () => {
    // Create topics if they don't exist
    await createTopics();

    // Connect producer
    await connectProducer();

    // Start consumer
    await startConsumer();

    console.log('Kafka services started successfully');
};

start().catch(error => {
    console.error('Failed to start Kafka services:', error);
    process.exit(1);
});