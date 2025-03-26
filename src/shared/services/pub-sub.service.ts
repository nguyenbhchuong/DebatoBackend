import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService {
  private pubSubClient: PubSub;

  constructor() {
    this.pubSubClient = new PubSub();
  }

  async publish(
    topicName: string,
    data?: string,
    attributes?: {},
  ): Promise<string> {
    const topic = this.pubSubClient.topic(topicName);

    try {
      const messageId = await topic.publishMessage({
        data: data ?? null,
        attributes: attributes ?? null,
      });
      return messageId;
    } catch (error) {
      console.error('Error publishing to Pub/Sub:', error);
      throw error;
    }
  }
}
