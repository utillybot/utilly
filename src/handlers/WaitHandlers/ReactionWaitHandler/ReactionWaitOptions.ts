import { ReactionWaitSuccess } from './ReactionWaitSuccess';

export default interface ReactionWaitOptions {
    allowedEmotes: string[];
    userID: string;
    success: ReactionWaitSuccess;
}
