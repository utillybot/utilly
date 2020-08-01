export const ModuleInfo: Record<string, string> = {
    logging:
        'The logging module allows you to setup channels where events of the server such as message editing or role creating can be logged.',
};

export const Modules = [...Object.keys(ModuleInfo)];
