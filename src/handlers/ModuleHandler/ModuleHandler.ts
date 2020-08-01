import fs from 'fs/promises';
import path from 'path';
import UtillyClient from '../../bot';
import Logger from '../../helpers/Logger';
import Module from './Module/Module';
import AttachableModule from './Submodule/AttachableModule';
import Submodule from './Submodule/Submodule';

export default class ModuleHandler {
    private bot: UtillyClient;
    private logger: Logger;
    modules: Map<string, Module>;

    constructor(bot: UtillyClient, logger: Logger) {
        this.bot = bot;
        this.logger = logger;
        this.modules = new Map();
    }

    /**
     * Loads modules from a directory
     * @param directory - the directory to load modules from
     */
    async loadModules(directory: string): Promise<void> {
        this.logger.handler(`Loading Modules in Directory ${directory}.`);
        const modules = await fs.readdir(directory);
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];

            let subModules = await fs.readdir(path.join(directory, module));
            subModules = subModules.filter(value => value.endsWith('.js'));

            const moduleObj: Module = new (
                await import(path.join(directory, module, `${module}Module`))
            ).default(this.bot);
            this.logger.handler(`  Loading Module "${module}".`);

            for (let j = 0; j < subModules.length; j++) {
                const subModule = subModules[j];

                if (subModule == `${module}Module.js`) continue;

                this.logger.handler(`    Loading Submodule "${subModule}".`);
                const submoduleObj: Submodule = new (
                    await import(path.join(directory, module, subModule))
                ).default(this.bot);
                submoduleObj.parentModule = moduleObj;
                moduleObj.registerSubModule(
                    submoduleObj.constructor.name,
                    submoduleObj
                );

                this.logger.handler(
                    `    Finished Loading Submodule "${submoduleObj.constructor.name}".`
                );
            }
            this.logger.handler(`  Finished Loading Module "${module}".`);
            this.modules.set(module, moduleObj);
        }
        this.logger.handler(
            `Module Loading is complete. ${this.modules.size} modules have been loaded.`
        );
    }

    attachModules(): void {
        for (const [moduleName, module] of this.modules) {
            for (const [subModuleName, subModule] of module.subModules) {
                if (subModule instanceof AttachableModule) {
                    subModule.attach();
                    this.logger.handler(
                        `Submodule "${subModuleName}" of module "${moduleName}" has been attached.`
                    );
                }
            }
        }
    }
}
