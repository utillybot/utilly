import { Logger } from '@utilly/utils';
import fs from 'fs/promises';
import path from 'path';
import { UtillyClient } from '../../UtillyClient';
import { Module } from './Module';
import { AttachableModule } from './AttachableModule';
import { Submodule } from './Submodule';
import { GlobalStore, Injectable } from '@utilly/di';

@Injectable()
export class ModuleHandler {
	readonly modules: Map<string, Module>;

	private readonly _bot: UtillyClient;
	private readonly _logger: Logger;

	constructor(bot: UtillyClient, logger: Logger) {
		this._bot = bot;
		this._logger = logger;
		this.modules = new Map();
	}

	/**
	 * Loads modules from a directory
	 * @param directory - the directory to load modules from
	 */
	async loadModules(directory: string): Promise<void> {
		this._logger.handler(`Loading Modules in Directory ${directory}.`);
		const modules = await fs.readdir(directory);
		for (const module of modules) {
			const subModules = (
				await fs.readdir(path.join(directory, module))
			).filter(value => value.endsWith('.js'));

			const moduleObj: Module = GlobalStore.resolve(
				(await import(path.join(directory, module, `${module}Module`))).default
			);
			this._logger.handler(`  Loading Module "${module}".`);

			for (const subModule of subModules) {
				if (subModule == `${module}Module.js`) continue;

				this._logger.handler(`    Loading Submodule "${subModule}".`);
				const submoduleObj: Submodule = GlobalStore.resolve(
					(await import(path.join(directory, module, subModule))).default
				);
				moduleObj.registerSubModule(
					submoduleObj.constructor.name,
					submoduleObj
				);

				this._logger.handler(
					`    Finished Loading Submodule "${submoduleObj.constructor.name}".`
				);
			}
			this._logger.handler(`  Finished Loading Module "${module}".`);
			this.modules.set(module, moduleObj);
		}
		this._logger.handler(
			`Module Loading is complete. ${this.modules.size} modules have been loaded.`
		);
	}

	attachModules(): void {
		for (const [moduleName, module] of this.modules) {
			for (const [subModuleName, subModule] of module.subModules) {
				if (subModule instanceof AttachableModule) {
					subModule.attach(this._bot.bot);
					this._logger.handler(
						`Submodule "${subModuleName}" of module "${moduleName}" has been attached.`
					);
				}
			}
		}
	}
}
