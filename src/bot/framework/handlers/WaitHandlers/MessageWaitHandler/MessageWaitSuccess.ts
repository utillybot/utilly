import { Message } from 'eris';

type MessageWaitSuccess = (message: Message) => Promise<void>;

export default MessageWaitSuccess;
