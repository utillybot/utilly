import type { CommandContext } from '@utilly/framework';
import {
	BaseCommand,
	Command,
	EmbedBuilder,
	PreHook,
	UserIdValidatorHook,
} from '@utilly/framework';
import centra from 'centra';
import prettier from 'prettier';
import type GeneralCommandModule from './moduleinfo';

@Command({
	name: 'eval',
	description: 'View all the modules, or commands in a specific module',
	usage: '(command/module)',
})
@PreHook(UserIdValidatorHook({ allowedIds: ['236279900728721409'] }))
export default class Eval extends BaseCommand {
	parent!: GeneralCommandModule;

	async execute(ctx: CommandContext): Promise<void> {
		let code = '';

		if (ctx.args[0] == 'async') {
			ctx.args.shift();

			code = `(async() => {${ctx.args.join(' ')}})()`;
		} else {
			code = ctx.args.join(' ');
		}

		code = prettier.format(code);

		let evaled;
		let remove;

		//Attempt to eval code
		try {
			//Remove all discord things
			remove = (text: string) => {
				return text
					.replace(/`/g, '`' + String.fromCharCode(8203))
					.replace(/@/g, '@' + String.fromCharCode(8203))
					.replace(
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						this.bot.token!,
						"Utilly's Token"
					);
			};

			//Eval the code and set the result
			evaled = await eval(code);

			//If it is a string, inspect it
			if (typeof evaled !== 'string')
				evaled = (await import('util')).default.inspect(evaled, undefined, 1);

			//Build the success embed
			const embed = new EmbedBuilder()
				.setAuthor('Eval Success')
				.setDescription('Eval result')
				.addField(':inbox_tray: Input:', `\`\`\`js\n${code}\n\`\`\``, false)
				.setColor(0x00afff)
				.setFooter('Eval', this.bot.user.avatarURL)
				.setTimestamp();

			if (evaled.toString().length > 1024) {
				let formatted;
				try {
					formatted = prettier.format(remove(evaled));
				} catch {
					formatted = remove(evaled);
				}
				const result = await (
					await centra('https://hasteb.in/documents', 'POST')
						.body(formatted)
						.header('content-type', 'application/json')
						.send()
				).json();

				embed.addField(
					':outbox_tray: Output:',
					`[Output](https://hasteb.in/${result.key})`,
					false
				);
			} else {
				embed.addField(
					':outbox_tray: Output:',
					`\`\`\`js\n${remove(evaled)}\n\`\`\``,
					false
				);
			}

			//Send the embed
			ctx.reply({
				embed,
			});
		} catch (err) {
			//If eval has failed setup new embed
			let result = `\`\`\`${err.stack}\`\`\``;
			if (result.toString().length > 1024) {
				try {
					result = `[Output](https://hasteb.in/${
						(
							await (
								await centra('https://hasteb.in/documents', 'POST')
									.body(err.stack)
									.header('content-type', 'application/json')
									.send()
							).json()
						).key
					})`;
				} catch {
					result = `\`\`\`${err.stack}\`\`\``;
				}
			}
			const embed = new EmbedBuilder()
				.setAuthor('Eval Error')
				.setDescription('Eval result')
				.addField(':inbox_tray: Input:', `\`\`\`js\n${code}\n\`\`\``, false)
				.addField(':outbox_tray: Output:', result, false)
				.setColor(0xff0000)
				.setFooter('Eval', this.bot.user.avatarURL)
				.setTimestamp();
			//Send the embed
			ctx.reply({
				embed,
			});
			return;
		}
	}
}
