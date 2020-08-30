import { GuildChannel, Message, TextChannel } from 'eris';
import {
    BaseCommand,
    CommandContext,
} from '../../framework/handlers/CommandHandler/Command';
import { SubcommandHandler } from '../../framework/handlers/CommandHandler/SubcommandHandler';
import { MessageWaitFilter } from '../../framework/handlers/WaitHandlers/MessageWaitHandler';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import GeneralCommandModule from './moduleinfo';

export default class Embed extends BaseCommand {
    parent!: GeneralCommandModule;
    subCommandHandler: SubcommandHandler;

    constructor(bot: UtillyClient, parent: GeneralCommandModule) {
        super(bot, parent);
        this.help.name = 'embed';
        this.help.description =
            'Create, edit, or view the contents of an embed.';
        this.help.usage = '(create/edit/view) (message id)';

        this.settings.guildOnly = true;
        this.permissions.botPerms = [
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
            usage: '(message id)',
            execute: this.view.bind(this),
        });
    }

    async execute(ctx: CommandContext): Promise<void> {
        if (ctx.args.length == 0) {
            ctx.reply({
                embed: await this.subCommandHandler.generateHelp(
                    this,
                    ctx.message
                ),
            });
        } else {
            if (!(await this.subCommandHandler.handle(ctx))) {
                ctx.reply(
                    'You used the command incorrectly. View the help page to learn how to use this command'
                );
            }
        }
    }

    async create(ctx: CommandContext): Promise<void> {
        const preview = new EmbedBuilder();
        try {
            if (ctx.args.length > 0)
                Object.assign(preview, JSON.parse(ctx.args.join(' ')));
        } catch {
            ctx.reply('Could not parse your JSON.');
            return;
        }
        const options = [
            'title',
            'url',
            'description',
            'color',
            'footer',
            'thumbnail',
            'author',
            'fields',
            'done',
            'cancel',
        ];

        const embed = new EmbedBuilder();
        embed.setTitle('Welcome to the embed builder');
        embed.setDescription(
            'Please choose an option to modify: ' + options.join(', ')
        );
        embed.addDefaults(ctx.message.author);

        const previewMessage = await ctx.reply({
            content: '> **`PREVIEW`**',
            embed: preview,
        });

        const menu = await ctx.reply({ embed });

        try {
            const result = await this.bot.messageWaitHandler.addListener(
                ctx.message.channel.id,
                ctx.message.author.id,
                message => options.includes(message.content.toLowerCase()),
                30
            );
            await this.handleOption(
                result,
                ctx.message,
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
            await previewMessage.edit({
                content:
                    "Go back and edit the last field you inputted because it wasn't valid!",
                embed: undefined,
            });
        }

        const options = [
            'title',
            'url',
            'description',
            'color',
            'footer',
            'image',
            'thumbnail',
            'author',
            'fields',
            'done',
            'cancel',
        ];
        const embed = new EmbedBuilder();
        embed.setTitle('Embed Builder');
        embed.setDescription(
            'Please choose an option to modify: ' + options.join(', ')
        );
        embed.addDefaults(message.author);

        menu.edit({ embed });

        try {
            const result = await this.bot.messageWaitHandler.addListener(
                message.channel.id,
                message.author.id,
                message => options.includes(message.content.toLowerCase()),
                30
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
        const option = response.content.toLowerCase();

        try {
            if (
                option == 'title' ||
                option == 'url' ||
                option == 'description' ||
                option == 'color' ||
                option == 'image' ||
                option == 'thumbnail'
            ) {
                let filter: MessageWaitFilter | undefined;
                const embed = new EmbedBuilder();
                embed.setTitle(
                    `Type the ${
                        option == 'image' || option == 'thumbnail'
                            ? 'URL of the'
                            : ''
                    } ${option} you would like (or type \`clear\` to clear the field)`
                );

                if (option == 'title') {
                    filter = (message: Message) => message.content.length < 256;
                    embed.setDescription('The length limit is 256 characters.');
                } else if (option == 'description') {
                    filter = (message: Message) =>
                        message.content.length < 2048;
                    embed.setDescription(
                        'The length limit is 2048 characters.'
                    );
                }

                menu = await menu.edit({ embed });

                const result = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    filter,
                    30
                );
                console.log(result.content.length);
                if (option == 'title') {
                    preview.setTitle(
                        result.content.toLowerCase() == 'clear'
                            ? undefined
                            : result.content
                    );
                } else if (option == 'url') {
                    preview.setURL(
                        result.content.toLowerCase() == 'clear'
                            ? undefined
                            : result.content
                    );
                } else if (option == 'description') {
                    preview.setDescription(
                        result.content.toLowerCase() == 'clear'
                            ? undefined
                            : result.content
                    );
                } else if (option == 'color') {
                    preview.setColor(
                        result.content.toLowerCase() == 'clear'
                            ? undefined
                            : parseInt(result.content.replace('#', ''), 16)
                    );
                } else if (option == 'image') {
                    preview.setImage(
                        result.content.toLowerCase() == 'clear'
                            ? undefined
                            : result.content
                    );
                } else if (option == 'thumbnail') {
                    preview.setThumbnail(
                        result.content.toLowerCase() == 'clear'
                            ? undefined
                            : result.content
                    );
                }

                result.delete();
                this.handleMainMenu(message, preview, menu, previewMessage);
            } else if (option == 'footer') {
                const embed = new EmbedBuilder();
                embed.setTitle(
                    'Would you like to set the footer **`text`** or footer **`icon URL`**? (type `text` or `icon URL`)'
                );
                menu = await menu.edit({ embed });
                const result = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    message =>
                        ['text', 'icon url'].includes(
                            message.content.toLowerCase()
                        ),
                    30
                );

                this.handleFooter(
                    result,
                    message,
                    preview,
                    menu,
                    previewMessage
                );
            } else if (option == 'author') {
                const embed = new EmbedBuilder();
                embed.setTitle(
                    'Would you like to set the author **`name`**, author **`URL`**, or author **`icon URL`**? (type `name`, `URL`, or `icon URL`)'
                );
                menu = await menu.edit({ embed });
                const result = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    message =>
                        ['name', 'url', 'icon url'].includes(
                            message.content.toLowerCase()
                        ),
                    30
                );

                this.handleAuthor(
                    result,
                    message,
                    preview,
                    menu,
                    previewMessage
                );
            } else if (option == 'fields') {
                const embed = new EmbedBuilder();
                embed.setTitle('Would you like to add or delete a field?');
                menu = await menu.edit({ embed });
                const result = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    message =>
                        ['add', 'delete'].includes(
                            message.content.toLowerCase()
                        ),
                    30
                );

                this.handleFields(
                    result,
                    message,
                    preview,
                    menu,
                    previewMessage
                );
            } else if (option == 'done') {
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
                        30
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
            } else if (option == 'cancel') {
                const embed = new EmbedBuilder();
                embed.setTitle('Cancelled');
                embed.setDescription('You exited out of the embed wizard');
                embed.addField(
                    'Here is your current embed code:',
                    JSON.stringify(previewMessage.embeds[0])
                );
                previewMessage.delete();
                menu.edit({ embed });
            }
        } catch {
            this.handleFailure(menu, previewMessage);
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
        const option = response.content.toLowerCase();
        if (option == 'text') {
            const embed = new EmbedBuilder();
            embed.setTitle(
                'Type the footer text (or type `clear` to clear the field)'
            );
            embed.setDescription('The length limit is 2048 characters.');
            menu = await menu.edit({ embed });
            try {
                const text = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    (message: Message) => message.content.length < 2048,
                    30
                );
                text.delete();

                preview.setFooter(
                    text.content.toLowerCase() == 'clear'
                        ? undefined
                        : text.content,
                    preview.footer ? preview.footer.icon_url : undefined
                );
                this.handleMainMenu(message, preview, menu, previewMessage);
            } catch {
                this.handleFailure(menu, previewMessage);
            }
        } else if (option == 'icon url') {
            const embed = new EmbedBuilder();
            embed.setTitle(
                'Type the footer icon url (or type `clear` to clear the field)'
            );
            menu = await menu.edit({ embed });
            try {
                const url = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    undefined,
                    30
                );

                url.delete();
                preview.setFooter(
                    preview.footer ? preview.footer.text : 'No Footer Text',
                    url.content.toLowerCase() == 'clear'
                        ? undefined
                        : url.content
                );
                this.handleMainMenu(message, preview, menu, previewMessage);
            } catch {
                this.handleFailure(menu, previewMessage);
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
        const option = response.content.toLowerCase();
        if (option == 'name') {
            const embed = new EmbedBuilder();
            embed.setTitle(
                'Type the author name (or type `clear` to clear the field)'
            );
            embed.setDescription('The length limit is 256 characters.');

            menu = await menu.edit({ embed });
            try {
                const name = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    (message: Message) => message.content.length < 256,
                    30
                );

                name.delete();
                preview.setAuthor(
                    name.content.toLowerCase() == 'clear'
                        ? undefined
                        : name.content,
                    preview.author ? preview.author.url : undefined,
                    preview.author ? preview.author.icon_url : undefined
                );
                this.handleMainMenu(message, preview, menu, previewMessage);
            } catch {
                this.handleFailure(menu, previewMessage);
            }
        } else if (option == 'icon url') {
            const embed = new EmbedBuilder();
            embed.setTitle(
                'Type the author icon url (or type `clear` to clear the field)'
            );
            menu = await menu.edit({ embed });
            try {
                const iconURL = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    undefined,
                    30
                );
                iconURL.delete();
                preview.setAuthor(
                    preview.author ? preview.author.name : 'No Author Name',
                    preview.author ? preview.author.url : undefined,
                    iconURL.content.toLowerCase() == 'clear'
                        ? undefined
                        : iconURL.content
                );
                this.handleMainMenu(message, preview, menu, previewMessage);
            } catch {
                this.handleFailure(menu, previewMessage);
            }
        } else if (option == 'url') {
            const embed = new EmbedBuilder();
            embed.setTitle(
                'Type the author url (or type `clear` to clear the field)'
            );
            menu = await menu.edit({ embed });
            try {
                const url = await this.bot.messageWaitHandler.addListener(
                    message.channel.id,
                    message.author.id,
                    undefined,
                    30
                );

                url.delete();
                preview.setAuthor(
                    preview.author ? preview.author.name : 'No Author Name',

                    url.content.toLowerCase() == 'clear'
                        ? undefined
                        : url.content,
                    preview.author ? preview.author.icon_url : undefined
                );
                this.handleMainMenu(message, preview, menu, previewMessage);
            } catch {
                this.handleFailure(menu, previewMessage);
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
            if (preview.fields.length > 25) {
                const fieldEmbed = new EmbedBuilder();
                fieldEmbed.setTitle(
                    'There were are more than 25 fields. Delete one to add another.'
                );
                menu = await menu.edit({ embed: fieldEmbed });
                setTimeout(() => {
                    this.handleMainMenu(message, preview, menu, previewMessage);
                }, 30000);
            } else {
                try {
                    const nameEmbed = new EmbedBuilder();
                    nameEmbed.setTitle('Type the name of the field: ');
                    nameEmbed.setDescription(
                        'The length limit is 256 characters.'
                    );
                    menu = await menu.edit({ embed: nameEmbed });

                    const name = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        (message: Message) => message.content.length < 256,
                        30
                    );

                    name.delete();

                    const valueEmbed = new EmbedBuilder();
                    valueEmbed.setTitle('Type the value of the field: ');
                    nameEmbed.setDescription(
                        'The length limit is 1024 characters.'
                    );
                    menu = await menu.edit({ embed: valueEmbed });

                    const value = await this.bot.messageWaitHandler.addListener(
                        message.channel.id,
                        message.author.id,
                        (message: Message) => message.content.length < 1024,
                        30
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
                        30
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
                    30
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

    async edit(ctx: CommandContext): Promise<void> {
        if (!ctx.guild) return;

        let foundMessage: Message | undefined;
        for (const channel of ctx.guild.channels.values()) {
            if (!(channel instanceof TextChannel)) continue;
            try {
                foundMessage = await channel.getMessage(ctx.args[0]);
            } catch (ex) {
                continue;
            }

            if (foundMessage.author.id != this.bot.user.id) {
                const embed = new EmbedBuilder();
                embed.addDefaults(ctx.message.author);
                embed.setTitle(
                    `Error: The specified message is not written by the bot`
                );
                embed.setColor(0xff0000);
                ctx.reply({ embed });
                return;
            }
        }

        if (!foundMessage) {
            const embed = new EmbedBuilder();
            embed.addDefaults(ctx.message.author);
            embed.setTitle(
                `Error: The specified message was not found in this server.`
            );
            embed.setColor(0xff0000);
            ctx.reply({ embed });
            return;
        } else if (foundMessage.embeds.length == 0) {
            const embed = new EmbedBuilder();
            embed.addDefaults(ctx.message.author);
            embed.setTitle(
                `Error: The specified message did not have an embed.`
            );
            embed.setColor(0xff0000);
            ctx.reply({ embed });
            return;
        }
        ctx.args.shift();
        let embedObj;
        try {
            embedObj = JSON.parse(ctx.args.join(' '));
        } catch (ex) {
            const embed = new EmbedBuilder();
            embed.addDefaults(ctx.message.author);
            embed.setTitle(`Error: There was an error parsing your input.`);
            embed.setColor(0xff0000);
            ctx.reply({ embed });
            return;
        }

        foundMessage.edit({ embed: embedObj });

        ctx.reply('Done!');
    }

    async view(ctx: CommandContext): Promise<void> {
        if (!ctx.guild) return;

        let foundMessage: Message | undefined;
        for (const channel of ctx.guild.channels.values()) {
            if (!(channel instanceof TextChannel)) continue;
            try {
                foundMessage = await channel.getMessage(ctx.args[0]);
            } catch (ex) {
                continue;
            }
        }

        if (!foundMessage) {
            const embed = new EmbedBuilder();
            embed.addDefaults(ctx.message.author);
            embed.setTitle(
                `Error: The specified message was not found in this server.`
            );
            embed.setColor(0xff0000);
            ctx.reply({ embed });
            return;
        } else if (foundMessage.embeds.length == 0) {
            const embed = new EmbedBuilder();
            embed.addDefaults(ctx.message.author);
            embed.setTitle(
                `Error: The specified message did not have an embed.`
            );
            embed.setColor(0xff0000);
            ctx.reply({ embed });
            return;
        }

        const embed = new EmbedBuilder();
        embed.addDefaults(ctx.message.author);
        embed.setTitle(`Here is the embed:`);
        const description = JSON.stringify(foundMessage.embeds[0]);
        embed.setDescription(`\`\`\`
                ${description}\`\`\``);
        embed.setColor(0x00ff00);
        ctx.reply({ embed });
    }
}
