import ReactionWaitSuccess from './ReactionWaitSuccess';

export default interface IReactionWaitOptions {
    allowedEmotes: string[];
    userID: string;
    success: ReactionWaitSuccess;
}
