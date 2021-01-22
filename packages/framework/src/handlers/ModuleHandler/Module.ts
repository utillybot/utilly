import { Submodule } from './Submodule';

/**
 * Base Module
 */
export abstract class Module {
	subModules: Map<string, Submodule> = new Map();

	registerSubModule(label: string, subModule: Submodule): void {
		this.subModules.set(label, subModule);
	}
}
