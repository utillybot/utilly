export const ModuleInfo = {
    logging:
        'The logging module allows you to set up channels where server events can be logged. For example, when a message is deleted or a channel is created and those events are enabled, the bot will log the event in your specified channel. This is useful for moderating actions or keeping track or deleted/edited messages.',
};

export const Modules = [...Object.keys(ModuleInfo)];
