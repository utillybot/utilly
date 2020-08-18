import { Emoji } from 'eris';

type ReactionWaitSuccess = (emote: Emoji) => Promise<void>;

export default ReactionWaitSuccess;
