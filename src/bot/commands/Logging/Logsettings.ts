import {
    Emoji,
    GuildChannel,
    GuildTextableChannel,
    Message,
    TextChannel,
    User,
} from 'eris';
import { getCustomRepository, getRepository } from 'typeorm';
import Guild from '../../../database/entity/Guild';
import GuildRepository from '../../../database/repository/GuildRepository';
import { EMOTE_CONSTANTS } from '../../constants/EmoteConstants';
import { EVENT_CONSTANTS } from '../../constants/EventConstants';
import Command from '../../framework/handlers/CommandHandler/Command';
import EmbedBuilder from '../../framework/utilities/EmbedBuilder';
import UtillyClient from '../../UtillyClient';
import LoggingCommandModule from './moduleinfo';

export default class Logsettings extends Command {
    parent?: LoggingCommandModule;

    constructor(bot: UtillyClient, parent: LoggingCommandModule) {
        super(bot, parent);
        this.help.name = 'logsettings';
        this.help.description = 'Modify settings for the logging plugin';
        this.help.usage = '';
        this.help.permission =
            'Server Owner, Administrator, or Manage Server permission';

        this.settings.guildOnly = true;
        this.settings.botPerms = [
            'embedLinks',
            'externalEmojis',
            'addReactions',
            'manageMessages',
            'readMessageHistory',
        ];
    }

    async checkPermission(message: Message): Promise<boolean> {
        if (message.channel instanceof GuildChannel) {
            if (message.author.id == message.channel.guild.ownerID) return true;
            if (
                message.member &&
                message.member.permission.has('administrator')
            )
                return true;
            if (message.member && message.member.permission.has('manageGuild'))
                return true;
        }
        return false;
    }

    async execute(message: Message<GuildTextableChannel>): Promise<void> {
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
        const menu = await message.channel.createMessage({ embed });
        menu.addReaction(`channel:${EMOTE_CONSTANTS.channelID}`);
        menu.addReaction(`event:${EMOTE_CONSTANTS.eventID}`);
        menu.addReaction(`info:${EMOTE_CONSTANTS.infoID}`);
        menu.addReaction(`cancel:${EMOTE_CONSTANTS.cancelID}`);

        try {
            const result = await this.bot.reactionWaitHandler.addListener(
                menu.id,
                message.author.id,
                [
                    EMOTE_CONSTANTS.channelID,
                    EMOTE_CONSTANTS.eventID,
                    EMOTE_CONSTANTS.infoID,
                    EMOTE_CONSTANTS.cancelID,
                ],
                60
            );
            this.handleSuccess(result, message, menu);
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
                this.handleChannelSettings(message.author, menu);
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
        const guildRow = await getCustomRepository(
            GuildRepository
        ).selectOrCreate(menu.channel.guild.id, [
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
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        menu.edit({ embed });
        menu.removeReactions();

        setTimeout(() => menu.delete(), 30000);
    }
    //#endregion

    //#region channel
    async handleChannelSettings(author: User, menu: Message): Promise<void> {
        // Prepare embed
        const embed = new EmbedBuilder();
        embed.setTitle('Log Channel Settings');
        embed.setDescription(
            'Type a list of event names or thier categories that you would like to change the log channel of.\n' +
                'eg: `message edited, message deleted, channel`'
        );

        // Populate options with all the event names and categories
        for (const [categoryName, categoryValue] of Object.entries(
            EVENT_CONSTANTS
        )) {
            const eventNames = Object.getOwnPropertyNames(categoryValue);
            embed.addField(
                categoryName,
                eventNames.map(item => `\`${item}\``).join('\n'),
                true
            );
        }

        // Prepare the footer of the embed
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${author.username}#${author.discriminator}`,
            author.avatarURL
        );

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
            this.handleChannelName(result, author, menu);
        } catch (ex) {
            this.handleEventNotFound(menu);
        }
    }

    async handleChannelName(
        response: Message,
        author: User,
        menu: Message
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

        // Prepare embed
        embed.setTitle('Log Channel Settings');
        embed.setDescription(
            `Mention, type the name, or input the id of the channel that you would like the logs for ${humanEvents
                .map(item => `\`${item}\``)
                .join(', ')} to go to.`
        );
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${author.username}#${author.discriminator}`,
            author.avatarURL
        );

        // Edit the message and clear user response
        menu.edit({ embed });
        response.delete();

        try {
            const result = await this.bot.messageWaitHandler.addListener(
                menu.channel.id,
                author.id,
                undefined,
                60
            );
            this.handleChannelParse(result, author, events, humanEvents, menu);
        } catch (ex) {
            this.handleEventNotFound(menu);
        }
    }

    async handleChannelParse(
        response: Message,
        author: User,
        events: string[],
        humanEvents: string[],
        menu: Message
    ): Promise<void> {
        // Command is guildonly so this shouldn't happen, but typescript needs it
        if (!(menu.channel instanceof GuildChannel)) return;

        // Try to parse channel ids, channel mentions, or channel names
        let channelID = '';
        let channel: GuildChannel | undefined = undefined;
        const regex = /\d{18}/;
        const matched = response.content.match(regex);
        if (response.content.length == 18) {
            channelID = response.content;
        } else if (matched != null) {
            channelID = matched[0];
        } else if (menu.channel instanceof GuildChannel) {
            // Find a channel in the guild with the name
            const result = menu.channel.guild.channels.find(
                c => c.name.toLowerCase() == response.content.toLowerCase()
            );

            // Ensure the channel is a TextChannel
            if (result instanceof TextChannel) {
                channel = result;
            } else {
                this.channelParseError(response, menu);
                return;
            }
        }
        // Channel ID will not be empty when there was a channel id or mention
        if (channelID != '') {
            // Find a channel in the guild with the id
            const result = menu.channel.guild.channels.find(
                c => c.id == channelID
            );

            // Ensure the channel is a TextChannel
            if (result instanceof TextChannel) {
                channel = result;
            } else {
                this.channelParseError(response, menu);
                return;
            }
        }

        if (channel == undefined) return;
        // Initialize a GuildRow with the guildID
        const guildRow = new Guild();
        guildRow.guildID = menu.channel.guild.id;

        // Loop through the selected events and set the channel
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            guildRow[`logging_${event}Channel`] = channel.id;
        }
        // Update the guild
        getRepository(Guild).update(menu.channel.guild.id, guildRow);

        // Prepare the embed for the success message
        const embed = new EmbedBuilder();
        embed.setTitle('Success!');
        embed.setDescription(
            `The log channel for the event(s) ${humanEvents
                .map(item => `\`${item}\``)
                .join(', ')} have been set to ${channel.mention}`
        );
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${author.username}#${author.discriminator}`,
            author.avatarURL
        );

        // Edit the message and clear user response
        menu.edit({ embed });
        response.delete();
        setTimeout(() => menu.delete(), 30000);
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
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${author.username}#${author.discriminator}`,
            author.avatarURL
        );

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

        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${author.username}#${author.discriminator}`,
            author.avatarURL
        );

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

        getRepository(Guild).update(menu.channel.guild.id, guildRow);
        guildRow = await getCustomRepository(GuildRepository).selectOrCreate(
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
