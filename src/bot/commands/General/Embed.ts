import { GuildChannel, GuildTextableChannel, Message, TextChannel } from 'eris';
import Command from '../../framework/handlers/CommandHandler/Command';
import { SubcommandHandler } from '../../framework/handlers/CommandHandler/SubcommandHandler';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import GeneralCommandModule from './moduleinfo';

export default class Embed extends Command {
    parent!: GeneralCommandModule;
    subCommandHandler: SubcommandHandler;

    constructor(bot: UtillyClient, parent: GeneralCommandModule) {
        super(bot, parent);
        this.help.name = 'embed';
        this.help.description =
            'Create, edit, or view the contents of an embed.';
        this.help.usage = '(create/edit/view) (message id)';

        this.settings.guildOnly = true;
        this.settings.botPerms = [
            'embedLinks',
            'manageMessages',
            'readMessageHistory',
        ];

        this.subCommandHandler = new SubcommandHandler(bot.logger);

        this.subCommandHandler.registerSubcommand('create', {
            description:
                'Creates a embed using the wizard. Optionally load an embed to start with',
            usage: '(embed)',
            execute: this.create.bind(this),
        });
        this.subCommandHandler.registerSubcommand('edit', {
            description: 'Edits an embed that the bot sent.',
            usage: '(message id) (embed)',
            execute: this.edit.bind(this),
        });
        this.subCommandHandler.registerSubcommand('view', {
            description: 'View the code behind and embed that was sent.',
            usage: '(message id) (embed)',
            execute: this.view.bind(this),
        });
    }

    async execute(
        message: Message<GuildTextableChannel>,
        args: string[]
    ): Promise<void> {
        if (args.length == 0) {
            message.channel.createMessage({
                embed: await this.subCommandHandler.generateHelp(this, message),
            });
        } else {
            this.subCommandHandler.handle(message, args);
        }
    }

    async create(message: Message, args: string[]): Promise<void> {
        const preview = new EmbedBuilder();
        if (args.length > 0) Object.assign(preview, JSON.parse(args.join(' ')));

        const options = [
            'title',
            'description',
            'color',
            'footer',
            'thumbnail',
            'author',
            'fields',
            'done',
        ];

        const embed = new EmbedBuilder();
        embed.setTitle('Welcome to the embed builder');
        embed.setDescription(
            'Please choose an option to modify: ' + options.join(', ')
        );
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        const previewMessage = await message.channel.createMessage({
            content: '> **`PREVIEW`**',
            embed: preview,
        });

        const menu = await message.channel.createMessage({ embed });

        try {
            const result = await this.bot.messageWaitHandler.addListener(
                message.channel.id,
                message.author.id,
                message => options.includes(message.content.toLowerCase()),
                30 * 1000
            );
            await this.handleOption(
                result,
                message,
                preview,
                menu,
                previewMessage
            );
        } catch {
            this.handleFailure(menu, previewMessage);
        }
    }

    async handleMainMenu(
        message: Message,
        preview: EmbedBuilder,
        menu: Message,
        previewMessage: Message
    ): Promise<void> {
        try {
            previewMessage = await previewMessage.edit({
                content: '> **`PREVIEW`**',
                embed: preview,
            });
        } catch {
            await previewMessage.edit(
                "Go back and edit the last field you inputted because it wasn't valid!"
            );
        }

        const options = [
            'title',
            'description',
            'color',
            'footer',
            'image',
            'thumbnail',
            'author',
            'fields',
            'done',
        ];
        const embed = new EmbedBuilder();
        embed.setTitle('Embed Builder');
        embed.setDescription(
            'Please choose an option to modify: ' + options.join(', ')
        );
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        menu.edit({ embed });

        try {
            const result = await this.bot.messageWaitHandler.addListener(
                message.channel.id,
                message.author.id,
                message => options.includes(message.content.toLowerCase()),
                30 * 1000
            );
            await this.handleOption(
                result,
                message,
                preview,
                menu,
                previewMessage
            );
        } catch {
            this.handleFailure(menu, previewMessage);
        }
    }

    async handleOption(
        response: Message,
        message: Message,
        preview: EmbedBuilder,
        menu: Message,
        previewMessage: Message
    ): Promise<void> {
        response.delete();
        switch (response.content.toLowerCase()) {
            case 'title': {
                const embed = new EmbedBuilder();
                embed.setTitle('Type the title you would like: ');
                menu = await menu.edit({ embed });
                try {
                    const title = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );

                    title.delete();

                    preview.setTitle(title.content);
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'description': {
                const embed = new EmbedBuilder();
                embed.setTitle('Type the description you would like: ');
                menu = await menu.edit({ embed });
                try {
                    const description = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,

                        undefined,
                        30 * 1000
                    );

                    description.delete();
                    preview.setDescription(description.content);
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'color': {
                const embed = new EmbedBuilder();
                embed.setTitle('Type the color you would like: ');
                menu = await menu.edit({ embed });
                try {
                    const color = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );

                    color.delete();
                    preview.setColor(
                        parseInt(color.content.replace('#', ''), 16)
                    );
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'footer': {
                const embed = new EmbedBuilder();
                embed.setTitle(
                    'Would you like to set the footer **`text`** or footer **`icon URL`**? (type `text` or `icon URL`)'
                );
                menu = await menu.edit({ embed });
                try {
                    const result = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        message =>
                            ['text', 'icon url'].includes(
                                message.content.toLowerCase()
                            ),
                        30 * 1000
                    );

                    this.handleFooter(
                        result,
                        message,
                        preview,
                        menu,
                        previewMessage
                    );
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'image': {
                const embed = new EmbedBuilder();
                embed.setTitle(
                    'Type the URL of the image that should be set on the embed'
                );
                menu = await menu.edit({ embed });
                try {
                    const image = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );

                    image.delete();
                    preview.setImage(image.content);
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'thumbnail': {
                const embed = new EmbedBuilder();
                embed.setTitle(
                    'Type the URL of the thumbnail that should be set on the embed'
                );
                menu = await menu.edit({ embed });
                try {
                    const thumbnail = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );

                    thumbnail.delete();
                    preview.setThumbnail(thumbnail.content);
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'author': {
                const embed = new EmbedBuilder();
                embed.setTitle(
                    'Would you like to set the author **`name`**, author **`URL`**, or author **`icon URL`**? (type `name`, `URL`, or `icon URL`)'
                );
                menu = await menu.edit({ embed });
                try {
                    const result = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        message =>
                            ['name', 'url', 'icon url'].includes(
                                message.content.toLowerCase()
                            ),
                        30 * 1000
                    );

                    this.handleAuthor(
                        result,
                        message,
                        preview,
                        menu,
                        previewMessage
                    );
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'fields': {
                const embed = new EmbedBuilder();
                embed.setTitle('Would you like to add or delete a field?');
                menu = await menu.edit({ embed });
                try {
                    const result = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        message =>
                            ['add', 'delete'].includes(
                                message.content.toLowerCase()
                            ),
                        30 * 1000
                    );

                    this.handleFields(
                        result,
                        message,
                        preview,
                        menu,
                        previewMessage
                    );
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'done': {
                menu.delete();
                previewMessage.delete();
                if (!(message.channel instanceof GuildChannel)) return;

                const embed = new EmbedBuilder();
                embed.setTitle(
                    'Which channel would you like to post the embed in? '
                );
                const prompt = await message.channel.createMessage({ embed });
                const regex = /\d{18}/;
                const result = (
                    await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        message => {
                            if (!(message.channel instanceof GuildChannel))
                                return false;
                            const id = message.content.match(regex);
                            if (id == null) return false;
                            return (
                                message.channel.guild.channels.find(
                                    channel => channel.id == id[0]
                                ) != undefined
                            );
                        },
                        30 * 1000
                    )
                ).content.match(regex);
                if (result == null) return;

                const channel = message.channel.guild.channels.find(
                    channel => channel.id == result[0]
                );
                if (
                    !channel
                        ?.permissionsOf(message.author.id)
                        .has('sendMessages')
                ) {
                    const noPerms = new EmbedBuilder();
                    noPerms.setTitle(
                        "You don't have permissions to send messages in that channel."
                    );
                    noPerms.addField(
                        'Here is your current embed code:',
                        JSON.stringify(previewMessage.embeds[0])
                    );
                    message.channel.createMessage({ embed: noPerms });
                    return;
                } else if (
                    !channel
                        ?.permissionsOf(this.bot.user.id)
                        .has('sendMessages')
                ) {
                    const noPerms = new EmbedBuilder();
                    noPerms.setTitle(
                        "I don't have permissions to send messages in that channel."
                    );
                    noPerms.addField(
                        'Here is your current embed code:',
                        JSON.stringify(previewMessage.embeds[0])
                    );
                    message.channel.createMessage({ embed: noPerms });
                    return;
                } else if (!(channel instanceof TextChannel)) {
                    const incorrectChannel = new EmbedBuilder();
                    incorrectChannel.setTitle(
                        'The channel you inputted was not a text channel'
                    );
                    incorrectChannel.addField(
                        'Here is your current embed code:',
                        JSON.stringify(previewMessage.embeds[0])
                    );
                    message.channel.createMessage({ embed: incorrectChannel });
                    return;
                }

                channel.createMessage({ embed: preview });
                prompt.delete();
                message.channel.createMessage('Done!');
            }
        }
    }

    async handleFooter(
        response: Message,
        message: Message,
        preview: EmbedBuilder,
        menu: Message,
        previewMessage: Message
    ): Promise<void> {
        response.delete();
        switch (response.content.toLowerCase()) {
            case 'text': {
                const embed = new EmbedBuilder();
                embed.setTitle('Type the footer text: ');
                menu = await menu.edit({ embed });
                try {
                    const text = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );
                    text.delete();
                    preview.setFooter(
                        text.content,
                        preview.footer ? preview.footer.icon_url : undefined
                    );
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }

                break;
            }
            case 'icon url': {
                const embed = new EmbedBuilder();
                embed.setTitle('Type the footer icon url: ');
                menu = await menu.edit({ embed });
                try {
                    const url = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );

                    url.delete();
                    preview.setFooter(
                        preview.footer ? preview.footer.text : 'No Footer Text',
                        url.content
                    );
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
        }
    }

    async handleAuthor(
        response: Message,
        message: Message,
        preview: EmbedBuilder,
        menu: Message,
        previewMessage: Message
    ): Promise<void> {
        response.delete();
        switch (response.content.toLowerCase()) {
            case 'name': {
                const embed = new EmbedBuilder();
                embed.setTitle('Type the author name: ');
                menu = await menu.edit({ embed });
                try {
                    const name = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );

                    name.delete();
                    preview.setAuthor(
                        name.content,
                        preview.author ? preview.author.url : undefined,
                        preview.author ? preview.author.icon_url : undefined
                    );
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'icon url': {
                const embed = new EmbedBuilder();
                embed.setTitle('Type the author icon url: ');
                menu = await menu.edit({ embed });
                try {
                    const iconURL = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );
                    iconURL.delete();
                    preview.setAuthor(
                        preview.author ? preview.author.name : 'No Author Name',
                        preview.author ? preview.author.url : undefined,
                        iconURL.content
                    );
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
            case 'url': {
                const embed = new EmbedBuilder();
                embed.setTitle('Type the author url: ');
                menu = await menu.edit({ embed });
                try {
                    const url = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        undefined,
                        30 * 1000
                    );

                    url.delete();
                    preview.setAuthor(
                        preview.author ? preview.author.name : 'No Author Name',

                        url.content,
                        preview.author ? preview.author.icon_url : undefined
                    );
                    this.handleMainMenu(message, preview, menu, previewMessage);
                } catch {
                    this.handleFailure(menu, previewMessage);
                }
                break;
            }
        }
    }

    async handleFields(
        response: Message,
        message: Message,
        preview: EmbedBuilder,
        menu: Message,
        previewMessage: Message
    ): Promise<void> {
        response.delete();

        const action = response.content.toLowerCase();
        if (action == 'add') {
            const nameEmbed = new EmbedBuilder();
            nameEmbed.setTitle('Type the name of the field: ');
            menu = await menu.edit({ embed: nameEmbed });
            try {
                const name = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    undefined,
                    30 * 1000
                );

                name.delete();

                const valueEmbed = new EmbedBuilder();
                valueEmbed.setTitle('Type the value of the field: ');
                menu = await menu.edit({ embed: valueEmbed });

                const value = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    undefined,
                    30 * 1000
                );

                value.delete();

                const inlineEmbed = new EmbedBuilder();
                inlineEmbed.setTitle(
                    'Finally, do you want this field to be inline or no (type `yes` or `no`. default is `no`)'
                );
                menu = await menu.edit({ embed: inlineEmbed });
                const inline = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    (message: Message) =>
                        ['yes', 'no'].includes(message.content),
                    30 * 1000
                );

                inline.delete();

                preview.addField(
                    name.content,
                    value.content,
                    inline.content.toLowerCase() == 'yes' ? true : false
                );
                this.handleMainMenu(message, preview, menu, previewMessage);
            } catch {
                this.handleFailure(menu, previewMessage);
            }
        } else if (action == 'delete') {
            const nameEmbed = new EmbedBuilder();
            nameEmbed.setTitle(
                'Type the number of the field you would like to delete. The first field is the one in the top right.'
            );
            menu = await menu.edit({ embed: nameEmbed });
            try {
                const deleteIndex = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    (message: Message) =>
                        preview.fields.length == 0 ||
                        preview.fields[parseInt(message.content) - 1] !=
                            undefined,
                    30 * 1000
                );
                deleteIndex.delete();
                if (preview.fields.length != 0) {
                    preview.fields.splice(parseInt(deleteIndex.content) - 1);
                }
                this.handleMainMenu(menu, preview, menu, previewMessage);
            } catch {
                this.handleFailure(menu, previewMessage);
            }
        }
    }

    handleFailure(menu: Message, previewMessage: Message): void {
        const embed = new EmbedBuilder();
        embed.setTitle('Error');
        embed.setDescription('Time ran out or something went wrong');
        embed.addField(
            'Here is your current embed code:',
            JSON.stringify(previewMessage.embeds[0])
        );
        previewMessage.delete();
        menu.edit({ embed });
    }

    async edit(message: Message, args: string[]): Promise<void> {
        if (!(message.channel instanceof GuildChannel)) return;

        let foundMessage: Message | undefined;
        for (const channel of message.channel.guild.channels.values()) {
            if (!(channel instanceof TextChannel)) continue;
            try {
                foundMessage = await channel.getMessage(args[0]);
            } catch (ex) {
                continue;
            }

            if (foundMessage.author.id != this.bot.user.id) {
                const embed = new EmbedBuilder();
                embed.setTimestamp();
                embed.setFooter(
                    `Requested by ${message.author.username}#${message.author.discriminator}`,
                    message.author.avatarURL
                );
                embed.setTitle(
                    `Error: The specified message is not written by the bot`
                );
                embed.setColor(0xff0000);
                message.channel.createMessage({ embed });
                return;
            }
        }

        if (!foundMessage) {
            const embed = new EmbedBuilder();
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );
            embed.setTitle(
                `Error: The specified message was not found in this server.`
            );
            embed.setColor(0xff0000);
            message.channel.createMessage({ embed });
            return;
        } else if (foundMessage.embeds.length == 0) {
            const embed = new EmbedBuilder();
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );
            embed.setTitle(
                `Error: The specified message did not have an embed.`
            );
            embed.setColor(0xff0000);
            message.channel.createMessage({ embed });
            return;
        }
        args.shift();
        let embedObj;
        try {
            embedObj = JSON.parse(args.join(' '));
        } catch (ex) {
            const embed = new EmbedBuilder();
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );
            embed.setTitle(`Error: There was an error parsing your input.`);
            embed.setColor(0xff0000);
            message.channel.createMessage({ embed });
            return;
        }

        foundMessage.edit({ embed: embedObj });

        message.channel.createMessage('Done!');
    }

    async view(message: Message, args: string[]): Promise<void> {
        if (!(message.channel instanceof GuildChannel)) return;

        let foundMessage: Message | undefined;
        for (const channel of message.channel.guild.channels.values()) {
            if (!(channel instanceof TextChannel)) continue;
            try {
                foundMessage = await channel.getMessage(args[0]);
            } catch (ex) {
                continue;
            }
        }

        if (!foundMessage) {
            const embed = new EmbedBuilder();
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );
            embed.setTitle(
                `Error: The specified message was not found in this server.`
            );
            embed.setColor(0xff0000);
            message.channel.createMessage({ embed });
            return;
        } else if (foundMessage.embeds.length == 0) {
            const embed = new EmbedBuilder();
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );
            embed.setTitle(
                `Error: The specified message did not have an embed.`
            );
            embed.setColor(0xff0000);
            message.channel.createMessage({ embed });
            return;
        }

        const embed = new EmbedBuilder();
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );
        embed.setTitle(`Here is the embed:`);
        const description = JSON.stringify(foundMessage.embeds[0]);
        embed.setDescription(`\`\`\`
                ${description}\`\`\``);
        embed.setColor(0x00ff00);
        message.channel.createMessage({ embed });
    }
}
