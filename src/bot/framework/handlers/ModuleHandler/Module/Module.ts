import UtillyClient from '../../../../UtillyClient';
import Submodule from '../Submodule/Submodule';

/**
 * Base Module
 */
export default abstract class Module {
    bot: UtillyClient;
    subModules: Map<string, Submodule>;

    constructor(bot: UtillyClient) {
        this.bot = bot;
        this.subModules = new Map();
    }

    registerSubModule(label: string, subModule: Submodule): void {
        this.subModules.set(label, subModule);
    }
}
