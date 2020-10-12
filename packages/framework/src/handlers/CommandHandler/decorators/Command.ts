import type { CommandHelp } from '../Command';

export function Command(help?: Partial<CommandHelp>) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function <T extends new (...args: any[]) => {}>(constructor: T): T {
        return class extends constructor {
            help = Object.assign(
                {
                    name: '',
                    description: 'No Description Provided',
                    usage: '',
                    aliases: [],
                },
                help
            );
        };
    };
}
