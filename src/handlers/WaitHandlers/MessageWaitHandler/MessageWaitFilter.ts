import { Message } from 'eris';

export type MessageWaitFilter = (message: Message) => Promise<boolean>;
