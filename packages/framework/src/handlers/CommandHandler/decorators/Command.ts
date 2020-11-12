import type { CommandInfo } from '../Command';
import type { CommandMetadata } from './types';
import { CommandSymbol } from './types';
import type { BaseCommand } from '../Command';

export function Command(help?: CommandMetadata) {
	return <T extends BaseCommand, TFunction extends new (...args: any[]) => T>(
		target: TFunction
	): void => {
		let commandMetadata: CommandMetadata | undefined = Reflect.getMetadata(
			CommandSymbol,
			target.prototype
		);

		if (!commandMetadata) commandMetadata = {};

		commandMetadata = Object.assign(commandMetadata, help);

		Reflect.defineMetadata(CommandSymbol, commandMetadata, target.prototype);
	};
}

export const loadCommandMetadata = (command: BaseCommand): void => {
	const commandMetadata: CommandMetadata | undefined = Reflect.getOwnMetadata(
		CommandSymbol,
		Object.getPrototypeOf(command)
	);

	if (commandMetadata)
		command.info = Object.assign(command.info, commandMetadata);
};
