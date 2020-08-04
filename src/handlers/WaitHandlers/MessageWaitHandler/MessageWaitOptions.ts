import { MessageWaitFailure } from './MessageWaitFailure';
import { MessageWaitFilter } from './MessageWaitFilter';
import { MessageWaitSuccess } from './MessageWaitSuccess';

export default interface MessageWaitOptions {
    channelID: string;
    success: MessageWaitSuccess;
    filter?: MessageWaitFilter;
    failure?: MessageWaitFailure;
}
