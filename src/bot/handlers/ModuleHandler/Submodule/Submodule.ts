import UtillyClient from '../../../UtillyClient';
import Module from '../Module/Module';

/**
 * A module that has a parent of another module
 */
export default abstract class Submodule extends Module {
    parentModule!: Module;

    constructor(bot: UtillyClient, parentModule: Module) {
        super(bot);
        this.parentModule = parentModule;
    }
}
