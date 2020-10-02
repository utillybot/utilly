import type { MessageContent, Client, Message } from 'eris';
import { Constants } from 'eris';
import { GuildChannel } from 'eris';
import type { CommandHookContext, CommandHookNext } from '../CommandHook';
import { ROLE_PERMISSIONS } from '../../..';
import { CommandHook } from '../CommandHook';

export interface PermsValidatorHookSettings {
    permissions: string[];
}

export interface PermsValidatorHookProps {
    errorMessage?: (missingBotPerms: string[]) => MessageContent;
    id: (client: Client, message: Message) => string;
}

export class PermsValidatorHook extends CommandHook {
    settings: PermsValidatorHookSettings;
    props: PermsValidatorHookProps;

    constructor(
        settings: PermsValidatorHookSettings,
        props: PermsValidatorHookProps
    ) {
        super();

        this.settings = settings;
        this.props = props;
    }

    run({ client, message }: CommandHookContext, next: CommandHookNext): void {
        const id = this.props.id(client, message);

        if (!this.props.errorMessage)
            this.props.errorMessage = (missingPerms: string[]) =>
                `Uh oh, ${
                    client.users.get(id)?.username
                } is missing these permissions ${missingPerms.join(', ')}`;

        const missingPerms = [];
        if (!(message.channel instanceof GuildChannel)) return;
        for (const permission of this.settings.permissions) {
            if (!message.channel.permissionsOf(id).has(permission)) {
                const item = ROLE_PERMISSIONS.get(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    Constants.Permissions[permission]
                );
                if (item) missingPerms.push(item);
            }
        }

        if (missingPerms.length > 0) {
            message.channel.createMessage(
                this.props.errorMessage(missingPerms)
            );
        } else {
            next();
        }
    }
}
