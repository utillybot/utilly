import type { UtillyClient } from '../../UtillyClient';
import type { Submodule } from './Submodule';

/**
 * Base Module
 */
export abstract class Module {
	bot: UtillyClient;
	subModules: Map<string, Submodule>;

	protected constructor(bot: UtillyClient) {
		this.bot = bot;
		this.subModules = new Map();
	}

	registerSubModule(label: string, subModule: Submodule): void {
		this.subModules.set(label, subModule);
	}
}
