import {
    Emoji,
    GuildChannel,
    GuildTextableChannel,
    Message,
    TextChannel,
} from 'eris';
import { getCustomRepository, getRepository } from 'typeorm';
import UtillyClient from '../../bot';
import { Guild } from '../../database/entity/Guild';
import GuildRepository from '../../database/repository/GuildRepository';
import Command from '../../handlers/CommandHandler/Command/Command';
import { ReactionWaitFailure } from '../../handlers/WaitHandlers/ReactionWaitHandler/ReactionWaitFailure';
import { ReactionWaitSuccess } from '../../handlers/WaitHandlers/ReactionWaitHandler/ReactionWaitSuccess';
import EmbedBuilder from '../../helpers/Embed';
import { EmoteConstants } from '../../helpers/EmoteConstants';
import { EventNames } from '../../helpers/EventNames';
import LoggingCommandModule from './moduleinfo';

export default class Logsettings extends Command {
    parent?: LoggingCommandModule;

    constructor(bot: UtillyClient) {
        super(bot);
        this.help.name = 'logsettings';
        this.help.description = 'Modify settings for the logging plugin';
        this.help.usage = '';

        this.settings.guildOnly = true;
    }

    async execute(
        bot: UtillyClient,
        message: Message<GuildTextableChannel>
    ): Promise<void> {
        const embed = new EmbedBuilder();
        embed.setTitle('Logging Settings');
        embed.setDescription(
            'Click on a reaction below showing which setting you want to modify.'
        );
        embed.addField(
            `${EmoteConstants.channel} Channel`,
            'Change the channel where an event is being logged in.'
        );
        embed.addField(
            `${EmoteConstants.event} Event`,
            'Enable or disable an event to log.'
        );
        embed.addField(
            `${EmoteConstants.info} Info`,
            'View the currently set log channel and status of each event'
        );
        embed.addField(`${EmoteConstants.cancel} Cancel`, 'Close this menu');
        const menu = await message.channel.createMessage({ embed });
        menu.addReaction(`channel:${EmoteConstants.channelID}`);
        menu.addReaction(`event:${EmoteConstants.eventID}`);
        menu.addReaction(`info:${EmoteConstants.infoID}`);
        menu.addReaction(`cancel:${EmoteConstants.cancelID}`);

        bot.ReactionWaitHandler.addListener(
            menu.id,
            message.author.id,
            [
                EmoteConstants.channelID,
                EmoteConstants.eventID,
                EmoteConstants.infoID,
                EmoteConstants.cancelID,
            ],
            this.handleSuccess(message, menu),
            this.handleFailure(menu),
            60
        );
    }

    handleSuccess(message: Message, menu: Message): ReactionWaitSuccess {
        return async (emote: Emoji) => {
            switch (emote.id) {
                case EmoteConstants.channelID:
                    this.handleChannelSettings(message, menu);
                    break;
                case EmoteConstants.eventID:
                    this.handleEventSettings(message, menu);
                    break;
                case EmoteConstants.infoID:
                    this.handleInfo(message, menu);
                    break;
                case EmoteConstants.cancelID: {
                    const m = await message.channel.createMessage(
                        'Alright, closing the menu.'
                    );
                    menu.delete();
                    setTimeout(() => m.delete(), 30000);
                    break;
                }
            }
        };
    }

    handleFailure(menu: Message): ReactionWaitFailure {
        return () => {
            menu.delete();
            menu.channel.createMessage(
                "The menu has closed because a response wasn't received in 60 seconds."
            );
        };
    }
    //#region info
    async handleInfo(message: Message, menu: Message): Promise<void> {
        if (!(menu.channel instanceof GuildChannel)) return;
        let eventOptions: string[] = [];
        for (const categoryValue of Object.values(EventNames)) {
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
            EventNames
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
    handleChannelSettings(message: Message, menu: Message): void {
        // Prepare embed
        const embed = new EmbedBuilder();
        embed.setTitle('Log Channel Settings');
        embed.setDescription(
            'Type one of the event names or its category to modify its log channel.'
        );

        // Populate options with all the event names and categories
        let options = Object.getOwnPropertyNames(EventNames);
        for (const [categoryName, categoryValue] of Object.entries(
            EventNames
        )) {
            const eventNames = Object.getOwnPropertyNames(categoryValue);
            options = options.concat(eventNames);
            embed.addField(
                categoryName,
                eventNames.map(item => `\`${item}\``).join('\n'),
                true
            );
        }

        // Prepare the footer of the embed
        embed.setTimestamp();
        embed.setFooter(
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        this.bot.MessageWaitHandler.addListener(
            menu.channel.id,
            message.author.id,
            this.handleChannelName(message, menu),
            async (m: Message) => options.includes(m.content.toLowerCase()),
            60,
            this.handleEventNotFound(menu)
        );

        //Edit the message and clear user response
        menu.edit({ embed });
        menu.removeReactions();
    }

    handleChannelName(message: Message, menu: Message) {
        return async (response: Message): Promise<void> => {
            // Prepare embed
            const embed = new EmbedBuilder();
            embed.setTitle('Log Channel Settings');
            embed.setDescription(
                'Mention, type the name, or input the id of the channel that you would like the logs to go in.'
            );

            // Populate events with the event names and humanEvents with the human equivalent
            let events: string[] = [];
            let humanEvents: string[] = [];
            for (const [categoryName, categoryValue] of Object.entries(
                EventNames
            )) {
                const eventNames = Object.keys(categoryValue);
                // Check if the response is a category
                if (response.content.toLowerCase() == categoryName) {
                    events = events.concat(Object.values(categoryValue));
                    humanEvents = humanEvents.concat(eventNames);
                    break;
                }

                // Check if the response is a specific event
                const eventName = eventNames.find(
                    event => response.content.toLowerCase() == event
                );
                if (eventName != undefined) {
                    events.push(categoryValue[eventName]);
                    humanEvents.push(eventName);
                    break;
                }
            }
            // Uh oh, an event should be able to be found according to the precheck...
            if (events.length == 0) {
                menu.channel.createMessage(
                    'Something went wrong. Please try again later.'
                );
                return;
            }

            // Prepare the footer of the embed
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );

            this.bot.MessageWaitHandler.addListener(
                menu.channel.id,
                message.author.id,
                this.handleChannelParse(message, events, humanEvents, menu),
                undefined,
                60,
                this.handleEventNotFound(menu)
            );

            // Edit the message and clear user response
            menu.edit({ embed });
            response.delete();
        };
    }

    handleChannelParse(
        message: Message,
        events: string[],
        humanEvents: string[],
        menu: Message
    ) {
        return async (response: Message): Promise<void> => {
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
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );

            // Edit the message and clear user response
            menu.edit({ embed });
            response.delete();
            setTimeout(() => menu.delete(), 30000);
        };
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

    handleEventNotFound(menu: Message) {
        return (): void => {
            const embed = new EmbedBuilder();
            embed.setTitle('Error');
            embed.setDescription(
                "The value you inputed was not valid or you haven't inputed a response in 60 seconds"
            );
            menu.edit({ embed });
            setTimeout(() => menu.delete(), 30000);
        };
    }

    //#endregion

    //#region event
    handleEventSettings(message: Message, menu: Message): void {
        // Prepare embed
        const embed = new EmbedBuilder();
        embed.setTitle('Log Event Settings');
        embed.setDescription(
            'Type one of the event names or its category to enable/disable it.'
        );

        // Populate options with all the event names and categories
        let options = Object.getOwnPropertyNames(EventNames);
        let eventOptions: string[] = [];
        for (const [categoryName, categoryValue] of Object.entries(
            EventNames
        )) {
            const eventNames = Object.getOwnPropertyNames(categoryValue);
            options = options.concat(eventNames);
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
            `Requested by ${message.author.username}#${message.author.discriminator}`,
            message.author.avatarURL
        );

        this.bot.MessageWaitHandler.addListener(
            menu.channel.id,
            message.author.id,
            this.handleEventName(message, menu, eventOptions),
            async (m: Message) => options.includes(m.content.toLowerCase()),
            60,
            this.handleEventNotFound(menu)
        );

        //Edit the message and clear user response
        menu.edit({ embed });
        menu.removeReactions();
    }

    handleEventName(message: Message, menu: Message, eventOptions: string[]) {
        return async (response: Message): Promise<void> => {
            // Prepare embed
            const embed = new EmbedBuilder();
            embed.setTitle('Log Event Settings');

            // Populate events with the event names and humanEvents with the human equivalent
            let events: string[] = [];
            let humanEvents: string[] = [];
            for (const [categoryName, categoryValue] of Object.entries(
                EventNames
            )) {
                const eventNames = Object.keys(categoryValue);
                // Check if the response is a category
                if (response.content.toLowerCase() == categoryName) {
                    events = events.concat(Object.values(categoryValue));
                    humanEvents = humanEvents.concat(eventNames);
                    break;
                }

                // Check if the response is a specific event
                const eventName = eventNames.find(
                    event => response.content.toLowerCase() == event
                );
                if (eventName != undefined) {
                    events.push(categoryValue[eventName]);
                    humanEvents.push(eventName);
                    break;
                }
            }
            // Uh oh, an event should be able to be found according to the precheck...
            if (events.length == 0) {
                menu.channel.createMessage(
                    'Something went wrong. Please try again later.'
                );
                return;
            }

            // Prepare the rest of the embed
            embed.setDescription(
                `Would you like to \`enable\`, \`disable\`, or \`toggle\` the settings for ${humanEvents
                    .map(item => `\`${item}\``)
                    .join(', ')}`
            );
            embed.setTimestamp();
            embed.setFooter(
                `Requested by ${message.author.username}#${message.author.discriminator}`,
                message.author.avatarURL
            );

            this.bot.MessageWaitHandler.addListener(
                menu.channel.id,
                message.author.id,
                this.handleEventParse(events, humanEvents, menu, eventOptions),
                async (m: Message) =>
                    m.content.toLowerCase() == 'enable' ||
                    m.content.toLowerCase() == 'disable' ||
                    m.content.toLowerCase() == 'toggle',
                60,
                async () => {
                    const result = await menu.channel.createMessage(
                        "That wasn't one of the options"
                    );
                    setTimeout(() => {
                        result.delete();
                        menu.delete();
                    }, 30000);
                }
            );

            // Edit the message and clear user response
            menu.edit({ embed });
            response.delete();
        };
    }

    handleEventParse(
        events: string[],
        humanEvents: string[],
        menu: Message,
        eventOptions: string[]
    ) {
        return async (response: Message): Promise<void> => {
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
            guildRow = await getCustomRepository(
                GuildRepository
            ).selectOrCreate(
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
                EventNames
            )) {
                const eventNames = Object.keys(categoryValue);
                embed.addField(
                    categoryName,
                    eventNames
                        .map(
                            item =>
                                `\`${item}\`: ${
                                    guildRow[
                                        `logging_${categoryValue[item]}Event`
                                    ]
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
        };
    }
    //#endregion
}
