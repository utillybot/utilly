import { Database, Guild, GuildRepository } from '@utilly/database';
import {
	BaseCommand,
	BotPermsValidatorHook,
	ChannelValidatorHook,
	Command,
	CommandContext,
	CommandHandler,
	EmbedBuilder,
	isGuildChannel,
	PreHook,
} from '@utilly/framework';
import { Message } from 'eris';
import { MODULE_CONSTANTS, MODULES } from '../../constants/ModuleConstants';

@Command({
	name: 'Help',
	description: 'View all the modules, or commands in a specific module',
	usage: '(command/module)',
	triggers: ['commands', 'h'],
})
@PreHook(ChannelValidatorHook({ channel: ['guild'] }))
@PreHook(BotPermsValidatorHook({ permissions: ['embedLinks'] }))
export default class Help extends BaseCommand {
	constructor(
		private _database: Database,
		private _commandHandler: CommandHandler
	) {
		super();
	}

	async execute({ message, args }: CommandContext): Promise<void> {
		if (isGuildChannel(message.channel)) {
			const guildRow = await this._database.connection
				.getCustomRepository(GuildRepository)
				.selectOrCreate(message.channel.guild.id, MODULES);
			if (args.length == 0) {
				this.handleBaseCommand(message, guildRow);
			} else {
				const item = args[0].toLowerCase();

				if (this._commandHandler.commandModules.has(item)) {
					this.handleModule(message, item, guildRow);
				} else if (this._commandHandler.triggers.has(item)) {
					this.handleCommand(message, item, guildRow);
				} else {
					await message.channel.createMessage(
						'Unable to find the specified module/command. Please visit the main help page to learn the modules and commands.'
					);
				}
			}
		}
	}

	handleBaseCommand(message: Message, guildRow: Guild): void {
		const embed = new EmbedBuilder();
		embed.setTitle('Help');

		let enabledModules = '';
		let disabledModules = '';

		for (const [, module] of this._commandHandler.commandModules) {
			if (guildRow[module.info.name.toLowerCase()] == false) {
				disabledModules += module.info.name + '\n';
			} else {
				enabledModules += module.info.name + '\n';
			}
		}

		embed.addField(
			'Enabled Modules',
			enabledModules != '' ? enabledModules : '**none**',
			true
		);
		embed.addField(
			'Disabled Modules',
			disabledModules != '' ? disabledModules : '**none**',
			true
		);
		embed.addField(
			'Help',
			`To view help for a specific module, type \`${
				guildRow.prefix ? guildRow.prefix[0] : 'u!'
			}help module\` where module is the name of the module.`
		);
		embed.addField(
			'Module Management',
			`To enable or disable modules use the \`${
				guildRow.prefix ? guildRow.prefix[0] : 'u!'
			}module enable module\` where the second module is the name of the module you want to enable.`
		);
		embed.addDefaults(message.author);
		message.channel.createMessage({ embed });
	}

	handleModule(message: Message, item: string, guildRow: Guild): void {
		const embed = new EmbedBuilder();

		const commandModule = this._commandHandler.commandModules.get(item);
		if (!commandModule) return;

		embed.setTitle(
			`Help for \`${commandModule.info.name}\` module : ${
				guildRow[item] == false ? 'Disabled' : 'Enabled'
			}`
		);
		embed.setColor(guildRow[item] == false ? 0xff0000 : 0x00ff00);
		embed.setDescription(MODULE_CONSTANTS[commandModule.info.name]);

		for (const command of commandModule.commands) {
			embed.addField(
				`\`${
					guildRow.prefix ? guildRow.prefix[0] : 'u!'
				}${command.info.name.toLowerCase()}${
					command.info.usage ? ' ' + command.info.usage : ''
				}\``,
				command.info.description
			);
		}
		embed.addDefaults(message.author);
		message.channel.createMessage({ embed });
	}

	handleCommand(message: Message, item: string, guildRow: Guild): void {
		const embed = new EmbedBuilder();

		const command = this._commandHandler.triggers.get(item);
		if (!command) return;

		embed.setTitle(`Help for \`${command.info.name}\` command`);

		embed.setDescription(command.info.description);
		embed.addField(
			'Usage',
			`${
				guildRow.prefix ? guildRow.prefix[0] : 'u!'
			}${command.info.name.toLowerCase()} ${command.info.usage ?? ''}`,
			true
		);
		const triggers = [];
		for (const alias of command.info.triggers) {
			triggers.push((guildRow.prefix ? guildRow.prefix[0] : 'u!') + alias);
		}
		if (triggers.length != 0)
			embed.addField('Aliases', triggers.join(', '), true);

		let parent;
		for (const [, mod] of this._commandHandler.commandModules) {
			if (mod.triggers.has(item)) {
				parent = mod.info.name;
				break;
			}
		}
		embed.addField(
			'Parent Module',
			`${parent} : ${guildRow[item] == false ? 'Disabled' : 'Enabled'}`,
			true
		);
		embed.addDefaults(message.author);
		message.channel.createMessage({ embed });
	}
}
