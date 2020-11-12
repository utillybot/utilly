import type { CommandModuleMetadata } from './types';
import { CommandModuleSymbol } from './types';
import type { BaseCommandModule } from '../CommandModule';

export function CommandModule(help?: CommandModuleMetadata) {
	return <
		T extends BaseCommandModule,
		TFunction extends new (...args: any[]) => T
	>(
		target: TFunction
	): void => {
		let commandModuleMetadata:
			| CommandModuleMetadata
			| undefined = Reflect.getMetadata(CommandModuleSymbol, target.prototype);

		if (!commandModuleMetadata) commandModuleMetadata = {};

		commandModuleMetadata = Object.assign(commandModuleMetadata, help);

		Reflect.defineMetadata(
			CommandModuleSymbol,
			commandModuleMetadata,
			target.prototype
		);
	};
}

export const loadCommandModuleMetadata = (
	commandModule: BaseCommandModule
): void => {
	const commandModuleMetadata:
		| CommandModuleMetadata
		| undefined = Reflect.getOwnMetadata(
		CommandModuleSymbol,
		Object.getPrototypeOf(commandModule)
	);

	if (commandModuleMetadata)
		commandModule.info = Object.assign(
			commandModule.info,
			commandModuleMetadata
		);
};
