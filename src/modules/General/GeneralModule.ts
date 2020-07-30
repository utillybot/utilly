import UtillyClient from '../../bot';
import CommandModule from '../../handlers/CommandHandler/CommandModule/CommandModule';
import Module from '../../handlers/ModuleHandler/Module/Module';

export default class GeneralModule extends Module {
    constructor(bot: UtillyClient) {
        super(bot);
    }

    getModules(): CommandModule[] {
        return this.bot.CommandHandler.modulesObjects;
    }
}
