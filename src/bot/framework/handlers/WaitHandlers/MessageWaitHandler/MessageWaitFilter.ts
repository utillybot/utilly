import { Message } from 'eris';

type MessageWaitFilter = (message: Message) => Promise<boolean>;

export default MessageWaitFilter;
