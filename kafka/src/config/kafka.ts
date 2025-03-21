import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Kafka configuration
const kafka = new Kafka({
    clientId: 'brandpulse',
    brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:29092'],
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
});

// Define Kafka topics
export const TOPICS = {
    MENTION_COLLECTION: 'mention-collection',
    MENTION_PROCESSING: 'mention-processing',
    MENTION_SENTIMENT: 'mention-sentiment',
    ALERTS: 'alerts',
    REPORTS: 'reports'
};

// Create topics function
export const createTopics = async () => {
    const admin = kafka.admin();

    try {
        await admin.connect();
        console.log('Admin connected');

        const existingTopics = await admin.listTopics();
        const topicsToCreate = Object.values(TOPICS)
            .filter(topic => !existingTopics.includes(topic))
            .map(topic => ({
                topic,
                numPartitions: 3,
                replicationFactor: 1
            }));

        if (topicsToCreate.length > 0) {
            await admin.createTopics({
                topics: topicsToCreate,
                waitForLeaders: true,
            });
            console.log(`Created topics: ${topicsToCreate.map(t => t.topic).join(', ')}`);
        } else {
            console.log('All topics already exist');
        }
    } catch (error) {
        console.error('Error creating Kafka topics:', error);
    } finally {
        await admin.disconnect();
    }
};

export default kafka;