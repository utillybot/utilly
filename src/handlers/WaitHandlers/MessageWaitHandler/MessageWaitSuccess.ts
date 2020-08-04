import { Message } from 'eris';

export type MessageWaitSuccess = (message: Message) => Promise<void>;
