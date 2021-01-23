import { Database, Guild, GuildRepository } from '@utilly/database';
import {
	BaseCommand,
	BotPermsValidatorHook,
	ChannelValidatorHook,
	Command,
	CommandContext,
	CommandHook,
	CommandHookContext,
	EmbedBuilder,
	isGuildChannel,
	PreHook,
	runHooks,
	Subcommand,
	SubcommandHandler,
	UserPermsValidatorHook,
	UtillyClient,
} from '@utilly/framework';
import { MODULE_CONSTANTS, MODULES } from '../../constants/ModuleConstants';
import { GlobalStore, Service } from '@utilly/di';
import { Logger } from '@utilly/utils';

@Command({
	name: 'Module',
	description: 'Enable, disable, or view info about a module.',
	usage: '(enable, disable, toggle, info) (module name)',
})
@PreHook(ChannelValidatorHook({ channel: ['guild'] }))
@PreHook(BotPermsValidatorHook({ permissions: ['embedLinks'] }))
@PreHook(UserPermsValidatorHook({ permissions: ['manageGuild'] }))
export default class Module extends BaseCommand {
	subCommandHandler: SubcommandHandler;

	constructor() {
		super();
		this.subCommandHandler = new SubcommandHandler(
			GlobalStore.resolve(Logger),
			GlobalStore.resolve(UtillyClient).bot,
			GlobalStore.resolve(Database)
		);

		this.subCommandHandler.registerSubcommand(
			GlobalStore.resolve(ModuleEnable)
		);
		this.subCommandHandler.registerSubcommand(
			GlobalStore.resolve(ModuleDisable)
		);
		this.subCommandHandler.registerSubcommand(
			GlobalStore.resolve(ModuleToggle)
		);
		this.subCommandHandler.registerSubcommand(GlobalStore.resolve(ModuleInfo));

		this.subCommandHandler.preHooks.push(ModuleSubcommandHook());
	}

	async execute({ bot, message, args }: CommandContext): Promise<void> {
		if (!(await this.subCommandHandler.handle({ bot, message, args }))) {
			if (args.length == 0) {
				message.channel.createMessage({
					embed: await this.subCommandHandler.generateHelp(this, message),
				});
			} else if (args.length == 1) {
				const hookCtx: CommandHookContext = {
					bot,
					message,
					args,
				};
				if (!(await runHooks(hookCtx, [ModuleSubcommandHook()]))) return;
				this.subCommandHandler.getCommand('toggle')!.execute(hookCtx);
			}
		}
	}
}

const ModuleSubcommandHook = (): CommandHook => {
	return async (ctx, next): Promise<void> => {
		const module = ctx.args[0] ? ctx.args[0].toLowerCase() : ctx.args[0];
		if (!module || !MODULES.includes(module)) {
			const embed = new EmbedBuilder();
			embed.addDefaults(ctx.message.author);

			embed.setTitle(`Module ${!module ? 'not specified' : 'not found'}`);
			embed.setDescription(
				`${
					!module
						? 'A module was not specified'
						: `The module \`${module}\` was not found`
				}.`
			);
			embed.setColor(0xff0000);
			ctx.message.channel.createMessage({ embed });
			return;
		}
		next();
	};
};

@Service()
class ModuleEnable extends Subcommand {
	constructor(private _database: Database) {
		super();

		this.help.name = 'enable';
		this.help.description = 'Enable a module.';
		this.help.usage = '(module name)';
	}

	async execute({ message, args }: CommandContext): Promise<void> {
		const module = args[0].toLowerCase();
		if (!isGuildChannel(message.channel)) return;
		const guildRow = await this._database.connection
			.getCustomRepository(GuildRepository)
			.selectOrCreate(message.channel.guild.id, [module]);

		const embed = new EmbedBuilder();
		embed.addDefaults(message.author);

		if (guildRow[module]) {
			embed.setTitle('Module already enabled');
			embed.setDescription(`The module \`${module}\` is already enabled.`);
			embed.setColor(0xff0000);
		} else {
			guildRow[module] = true;
			this._database.connection
				.getRepository(Guild)
				.update(message.channel.guild.id, guildRow);

			embed.setTitle('Module Enabled');
			embed.setDescription(`The module \`${module}\` has been enabled.`);
			embed.setColor(0x00ff00);
		}
		message.channel.createMessage({ embed });
	}
}

@Service()
class ModuleDisable extends Subcommand {
	constructor(private _database: Database) {
		super();

		this.help.name = 'disable';
		this.help.description = 'Disable a module.';
		this.help.usage = '(module name)';
	}

	async execute({ message, args }: CommandContext): Promise<void> {
		const module = args[0].toLowerCase();
		if (!isGuildChannel(message.channel)) return;
		const guildRow = await this._database.connection
			.getCustomRepository(GuildRepository)
			.selectOrCreate(message.channel.guild.id, [module]);

		const embed = new EmbedBuilder();
		embed.addDefaults(message.author);

		if (!guildRow[module]) {
			embed.setTitle('Module already disabled');
			embed.setDescription(`The module \`${module}\` is already disabled.`);
			embed.setColor(0xff0000);
		} else {
			guildRow[module] = false;
			this._database.connection
				.getRepository(Guild)
				.update(message.channel.guild.id, guildRow);

			embed.setTitle('Module Disabled');
			embed.setDescription(`The module \`${module}\` has been disabled.`);
			embed.setColor(0x00ff00);
		}
		message.channel.createMessage({ embed });
	}
}

@Service()
class ModuleToggle extends Subcommand {
	constructor(private _database: Database) {
		super();

		this.help.name = 'toggle';
		this.help.description = 'Toggle a module.';
		this.help.usage = '(module name)';
	}

	async execute({ message, args }: CommandContext): Promise<void> {
		const module = args[0].toLowerCase();
		if (!isGuildChannel(message.channel)) return;
		const guildRow = await this._database.connection
			.getCustomRepository(GuildRepository)
			.selectOrCreate(message.channel.guild.id, [module]);

		const embed = new EmbedBuilder();
		embed.addDefaults(message.author);

		const originalModuleSetting = guildRow[module];
		if (originalModuleSetting == true) {
			guildRow[module] = false;
		} else {
			guildRow[module] = true;
		}
		const newModuleSetting = guildRow[module];
		if (originalModuleSetting == newModuleSetting) {
			embed.setTitle('Something went wrong');
			embed.setDescription(
				`The module \`${module}\` is currently ${
					newModuleSetting ? 'enabled' : 'disabled'
				}.`
			);
			embed.setColor(0xff0000);
		} else {
			this._database.connection
				.getRepository(Guild)
				.update(message.channel.guild.id, guildRow);
			embed.setTitle(`Module ${newModuleSetting ? 'Enabled' : 'Disabled'}`);
			embed.setDescription(
				`The module \`${module}\` has been ${
					newModuleSetting ? 'enabled' : 'disabled'
				}.`
			);
			embed.setColor(0x00ff00);
		}
		message.channel.createMessage({ embed });
	}
}

@Service()
class ModuleInfo extends Subcommand {
	constructor(private _database: Database) {
		super();

		this.help.name = 'info';
		this.help.description = 'View info about a module.';
		this.help.usage = '(module name)';
	}

	async execute({ message, args }: CommandContext): Promise<void> {
		const module = args[0].toLowerCase();
		if (!isGuildChannel(message.channel)) return;
		const guildRow = await this._database.connection
			.getCustomRepository(GuildRepository)
			.selectOrCreate(message.channel.guild.id, [module]);

		const embed = new EmbedBuilder();
		embed.addDefaults(message.author);

		embed.setTitle('Module Info');
		embed.setDescription(MODULE_CONSTANTS[module]);
		embed.addField(
			'Status',
			`This module is **${guildRow[module] ? 'enabled' : 'disabled'}**.`
		);
		message.channel.createMessage({ embed });
	}
}
