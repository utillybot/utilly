import { Guild, GuildRepository } from '@utilly/database';
import {
    BaseCommand,
    CommandContext,
    EmbedBuilder,
    UtillyClient,
} from '@utilly/framework';
import { parseChannel } from '@utilly/utils';
import { Emoji, GuildChannel, Message, TextChannel, User } from 'eris';
import { EMOTE_CONSTANTS } from '../../constants/EmoteConstants';
import { EVENT_CONSTANTS } from '../../constants/EventConstants';
import LoggingCommandModule from './moduleinfo';

export default class Logsettings extends BaseCommand {
    parent?: LoggingCommandModule;

    constructor(bot: UtillyClient, parent: LoggingCommandModule) {
        super(bot, parent);
        this.help.name = 'logsettings';
        this.help.description = 'Modify settings for the logging plugin';
        this.help.usage = '';
        this.help.permission =
            'Server Owner, Administrator, or Manage Server permission';

        this.settings.guildOnly = true;
        this.permissions.botPerms = [
            'embedLinks',
            'externalEmojis',
            'addReactions',
            'manageMessages',
            'readMessageHistory',
        ];
        this.permissions.userPerms = ['manageGuild'];
    }

    async execute(ctx: CommandContext): Promise<void> {
        const embed = new EmbedBuilder();
        embed.setTitle('Logging Settings');
        embed.setDescription(
            'Click on a reaction below showing which setting you want to modify.'
        );
        embed.addField(
            `${EMOTE_CONSTANTS.channel} Channel`,
            'Change the channel where an event is being logged in.'
        );
        embed.addField(
            `${EMOTE_CONSTANTS.event} Event`,
            'Enable or disable an event to log.'
        );
        embed.addField(
            `${EMOTE_CONSTANTS.info} Info`,
            'View the currently set log channel and status of each event'
        );
        embed.addField(`${EMOTE_CONSTANTS.cancel} Cancel`, 'Close this menu');
        const menu = await ctx.reply({ embed });
        menu.addReaction(`channel:${EMOTE_CONSTANTS.channelID}`);
        menu.addReaction(`event:${EMOTE_CONSTANTS.eventID}`);
        menu.addReaction(`info:${EMOTE_CONSTANTS.infoID}`);
        menu.addReaction(`cancel:${EMOTE_CONSTANTS.cancelID}`);

        try {
            const result = await this.bot.reactionWaitHandler.addListener(
                menu.id,
                ctx.message.author.id,
                [
                    EMOTE_CONSTANTS.channelID,
                    EMOTE_CONSTANTS.eventID,
                    EMOTE_CONSTANTS.infoID,
                    EMOTE_CONSTANTS.cancelID,
                ],
                60
            );
            this.handleSuccess(result, ctx.message, menu);
        } catch {
            this.handleFailure(menu);
        }
    }

    async handleSuccess(
        emote: Emoji,
        message: Message,
        menu: Message
    ): Promise<void> {
        switch (emote.id) {
            case EMOTE_CONSTANTS.channelID:
                try {
                    this.handleChannelSettings(message.author, menu);
                } catch {
                    this.handleEventNotFound(menu);
                }
                break;
            case EMOTE_CONSTANTS.eventID:
                this.handleEventSettings(message.author, menu);
                break;
            case EMOTE_CONSTANTS.infoID:
                this.handleInfo(message, menu);
                break;
            case EMOTE_CONSTANTS.cancelID: {
                const m = await message.channel.createMessage(
                    'Alright, closing the menu.'
                );
                menu.delete();
                setTimeout(() => m.delete(), 30000);
                break;
            }
        }
    }

    handleFailure(menu: Message): void {
        menu.delete();
        menu.channel.createMessage(
            "The menu has closed because a response wasn't received in 60 seconds."
        );
    }

    //#region info
    async handleInfo(message: Message, menu: Message): Promise<void> {
        if (!(menu.channel instanceof GuildChannel)) return;
        let eventOptions: string[] = [];
        for (const categoryValue of Object.values(EVENT_CONSTANTS)) {
            eventOptions = eventOptions.concat(Object.values(categoryValue));
        }
        const guildRow = await this.bot.database.connection
            .getCustomRepository(GuildRepository)
            .selectOrCreate(menu.channel.guild.id, [
                ...eventOptions.map(item => `logging_${item}Event`),
                ...eventOptions.map(item => `logging_${item}Channel`),
            ]);
        const embed = new EmbedBuilder();
        embed.setTitle('Info');
        embed.setDescription(
            'Listed below is each event, whether its enabled or not, and the log channel that corrosponds to it.'
        );

        for (const [categoryName, categoryValue] of Object.entries(
            EVENT_CONSTANTS
        )) {
            const eventNames = Object.keys(categoryValue);
            embed.addField(
                categoryName,
                eventNames
                    .map(
                        item =>
                            `\`${item}\`: \n${
                                guildRow[`logging_${categoryValue[item]}Event`]
                                    ? 'enabled'
                                    : 'disabled'
                            }, ${
                                guildRow[
                                    `logging_${categoryValue[item]}Channel`
                                ]
                                    ? `<#${
                                          guildRow[
                                              `logging_${categoryValue[item]}Channel`
                                          ]
                                      }>`
                                    : '*none*'
                            }`
                    )
                    .join('\n'),
                true
            );
        }

        // Prepare the footer of the embed
        embed.addDefaults(message.author);

        menu.edit({ embed });
        menu.removeReactions();

        setTimeout(() => menu.delete(), 30000);
    }
    //#endregion

    //#region channel
    async handleChannelSettings(author: User, menu: Message): Promise<void> {
        //#region event names
        // Prepare embed
        const settingsEmbed = new EmbedBuilder();
        settingsEmbed.setTitle('Log Channel Settings');
        settingsEmbed.setDescription(
            'Type a list of event names or thier categories that you would like to change the log channel of.\n' +
                'eg: `message edited, message deleted, channel`'
        );

        // Populate options with all the event names and categories
        const categoryNames: string[] = [];
        let eventNames: string[] = [];
        let events: string[] = [];

        for (const [categoryName, categoryValue] of Object.entries(
            EVENT_CONSTANTS
        )) {
            categoryNames.push(categoryName);
            eventNames = eventNames.concat(Object.keys(categoryValue));
            events = events.concat(Object.values(categoryValue));

            const curEventNames = Object.getOwnPropertyNames(categoryValue);
            settingsEmbed.addField(
                categoryName,
                curEventNames.map(item => `\`${item}\``).join('\n'),
                true
            );
        }

        // Prepare the footer of the embed
        settingsEmbed.addDefaults(author);

        //Edit the message and clear user response
        menu.edit({ embed: settingsEmbed });
        menu.removeReactions();

        //#endregion

        //#region select events
        const selectedEventsResponse = await this.bot.messageWaitHandler.addListener(
            menu.channel.id,
            author.id,
            (message: Message) => {
                const selectedEvents = message.content
                    .toLowerCase()
                    .split(/ *, */);

                if (selectedEvents.length == 0)
                    selectedEvents[0] = message.content;

                let matched = 0;

                for (const event of selectedEvents) {
                    if (
                        eventNames.includes(event) ||
                        categoryNames.includes(event)
                    )
                        matched++;
                }
                if (matched == 0) return false;
                return true;
            },
            60
        );
        selectedEventsResponse.delete();

        menu.removeReactions();

        const selectedEvents = selectedEventsResponse.content
            .toLowerCase()
            .split(/ *, */);

        if (selectedEvents.length == 0)
            selectedEvents[0] = selectedEventsResponse.content;

        const eventsEmbed = new EmbedBuilder();

        const matchedEvents: string[] = [];
        for (const event of selectedEvents) {
            if (eventNames.includes(event) || categoryNames.includes(event))
                matchedEvents.push(event);
        }

        if (matchedEvents.length == 0) {
            eventsEmbed.setTitle('Error');
            eventsEmbed.setDescription(
                'The channel(s) you provided were not valid.'
            );
            menu.edit({ embed: eventsEmbed });
            setTimeout(() => menu.delete(), 30000);
            return;
        }

        events = events.filter(item => matchedEvents.includes(item));

        // Prepare embed
        eventsEmbed.setTitle('Log Channel Settings');
        eventsEmbed.setDescription(
            `Mention, type the name, or input the id of the channel that you would like the logs for ${events
                .map(item => `\`${item}\``)
                .join(
                    ', '
                )} to go to. Or, type \`clear\` to clear to log channel set.`
        );
        eventsEmbed.addDefaults(author);

        // Edit the message and clear user response
        menu.edit({ embed: eventsEmbed });
        //#endregion

        //#region select channel
        const channelResponse = await this.bot.messageWaitHandler.addListener(
            menu.channel.id,
            author.id,
            (message: Message) => {
                if (!(message.channel instanceof GuildChannel)) return false;
                if (message.content.toLowerCase() == 'clear') return true;
                const channel = parseChannel(
                    message.content,
                    message.channel.guild
                );

                if (!channel) return false;
                return true;
            },
            60
        );
        channelResponse.delete();
        if (!(channelResponse.channel instanceof GuildChannel)) return;

        // Initialize a GuildRow with the guildID
        const guildRow = new Guild();
        guildRow.guildID = channelResponse.channel.guild.id;

        let channel;
        if (channelResponse.content.toLowerCase() != 'clear') {
            const parsedChannel = parseChannel(
                channelResponse.content,
                channelResponse.channel.guild
            );
            if (!parsedChannel || !(parsedChannel instanceof TextChannel)) {
                this.channelParseError(channelResponse, menu);
                return;
            }
            channel = parsedChannel;

            // Loop through the selected events and set the channel
            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                guildRow[`logging_${event}Channel`] = channel.id;
            }
        } else {
            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                guildRow[`logging_${event}Channel`] = null;
            }
        }

        // Update the guild
        this.bot.database.connection
            .getRepository(Guild)
            .update(channelResponse.channel.guild.id, guildRow);

        // Prepare the embed for the success message
        const channelEmbed = new EmbedBuilder();
        channelEmbed.setTitle('Success!');
        channelEmbed.setDescription(
            `The log channel for the event(s) ${events
                .map(item => `\`${item}\``)
                .join(', ')} have been ${
                channelResponse.content.toLowerCase() == 'clear'
                    ? 'cleared'
                    : `set to ${channel?.mention}`
            }`
        );
        channelEmbed.addDefaults(author);

        // Edit the message and clear user response
        menu.edit({ embed: channelEmbed });
        setTimeout(() => menu.delete(), 30000);
        //#endregion
    }

    channelParseError(response: Message, menu: Message): void {
        const embed = new EmbedBuilder();
        embed.setTitle('Error');
        embed.setDescription(
            'The channel you provided was invalid. Please try again with a text channel in your server.'
        );
        response.delete();
        menu.edit({ embed });
        setTimeout(() => menu.delete(), 30000);
    }

    handleEventNotFound(menu: Message): void {
        const embed = new EmbedBuilder();
        embed.setTitle('Error');
        embed.setDescription(
            "The value you inputed was not valid or you haven't inputed a response in 60 seconds"
        );
        menu.edit({ embed });
        setTimeout(() => menu.delete(), 30000);
    }

    //#endregion

    //#region event
    async handleEventSettings(author: User, menu: Message): Promise<void> {
        // Prepare embed
        const embed = new EmbedBuilder();
        embed.setTitle('Log Event Settings');
        embed.setDescription(
            'Type a list of event names or thier categories that you would like enable, disable, or toggle.\n' +
                'eg: `message edited, message deleted, channel`'
        );

        // Populate options with all the event names and categories
        let eventOptions: string[] = [];
        for (const [categoryName, categoryValue] of Object.entries(
            EVENT_CONSTANTS
        )) {
            const eventNames = Object.getOwnPropertyNames(categoryValue);
            eventOptions = eventOptions.concat(Object.values(categoryValue));
            embed.addField(
                categoryName,
                eventNames.map(item => `\`${item}\``).join('\n'),
                true
            );
        }

        // Prepare the footer of the embed
        embed.addDefaults(author);

        //Edit the message and clear user response
        menu.edit({ embed });
        menu.removeReactions();

        try {
            const result = await this.bot.messageWaitHandler.addListener(
                menu.channel.id,
                author.id,

                undefined,
                60
            );
            this.handleEventName(result, author, menu, eventOptions);
        } catch (ex) {
            this.handleEventNotFound(menu);
        }
    }

    async handleEventName(
        response: Message,
        author: User,
        menu: Message,
        eventOptions: string[]
    ): Promise<void> {
        menu.removeReactions();
        const selectedEvents = response.content.toLowerCase().split(/ *, */);
        if (selectedEvents.length == 0) selectedEvents[0] = response.content;

        const embed = new EmbedBuilder();

        // Populate events with the event names and humanEvents with the human equivalent
        let events: string[] = [];
        let humanEvents: string[] = [];
        for (const [categoryName, categoryValue] of Object.entries(
            EVENT_CONSTANTS
        )) {
            const eventNames = Object.keys(categoryValue);
            // Check if the response is a category
            if (selectedEvents.includes(categoryName)) {
                events = events.concat(Object.values(categoryValue));
                humanEvents = humanEvents.concat(eventNames);
                continue;
            }

            // Check if the response is a specific event

            const matchedEvents = eventNames.filter(event =>
                selectedEvents.includes(event)
            );
            if (matchedEvents.length != 0) {
                for (const eventName of matchedEvents) {
                    events.push(categoryValue[eventName]);
                    humanEvents.push(eventName);
                }
            }
        }
        // An event hasn't been found, none of their specified events are valid
        if (events.length == 0) {
            embed.setTitle('Error');
            embed.setDescription('The channel(s) you provided were not valid.');
            menu.edit({ embed });
            setTimeout(() => menu.delete(), 30000);
            return;
        }

        // Prepare the rest of the embed
        embed.setTitle('Log Event Settings');
        embed.setDescription(
            `Would you like to \`enable\`, \`disable\`, or \`toggle\` the settings for ${humanEvents
                .map(item => `\`${item}\``)
                .join(', ')}`
        );

        embed.addDefaults(author);

        // Edit the message and clear user response
        menu.edit({ embed });
        response.delete();

        try {
            const result = await this.bot.messageWaitHandler.addListener(
                menu.channel.id,
                author.id,
                (m: Message) =>
                    m.content.toLowerCase() == 'enable' ||
                    m.content.toLowerCase() == 'disable' ||
                    m.content.toLowerCase() == 'toggle',
                60
            );
            this.handleEventParse(
                result,
                events,
                humanEvents,
                menu,
                eventOptions
            );
        } catch (ex) {
            const result = await menu.channel.createMessage(
                "That wasn't one of the options"
            );
            setTimeout(() => {
                result.delete();
                menu.delete();
            }, 30000);
        }
    }

    async handleEventParse(
        response: Message,
        events: string[],
        humanEvents: string[],
        menu: Message,
        eventOptions: string[]
    ): Promise<void> {
        // Command is guildonly so this shouldn't happen, but typescript needs it
        if (!(menu.channel instanceof GuildChannel)) return;

        //Create a new guildRow and handle the actions for each event
        let guildRow = new Guild();
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            if (response.content.toLowerCase() == 'enable')
                guildRow[`logging_${event}Event`] = true;
            if (response.content.toLowerCase() == 'disable')
                guildRow[`logging_${event}Event`] = false;
            if (response.content.toLowerCase() == 'toggle')
                guildRow[`logging_${event}Event`] = !guildRow[
                    `logging_${event}Event`
                ];
        }

        this.bot.database.connection
            .getRepository(Guild)
            .update(menu.channel.guild.id, guildRow);
        guildRow = await this.bot.database.connection
            .getCustomRepository(GuildRepository)
            .selectOrCreate(
                menu.channel.guild.id,
                eventOptions.map(item => `logging_${item}Event`)
            );
        const embed = new EmbedBuilder();
        embed.setTitle('Success!');
        embed.setDescription(
            `The events ${humanEvents
                .map(item => `\`${item}\``)
                .join(', ')} have been ${response.content.toLowerCase()}d`
        );

        for (const [categoryName, categoryValue] of Object.entries(
            EVENT_CONSTANTS
        )) {
            const eventNames = Object.keys(categoryValue);
            embed.addField(
                categoryName,
                eventNames
                    .map(
                        item =>
                            `\`${item}\`: ${
                                guildRow[`logging_${categoryValue[item]}Event`]
                                    ? 'enabled'
                                    : 'disabled'
                            }`
                    )
                    .join('\n'),
                true
            );
        }
        response.delete();
        menu.edit({ embed });
        setTimeout(() => menu.delete(), 30000);
    }
    //#endregion
}
