import DatabaseModule from '../../../framework/handlers/ModuleHandler/Module/DatabaseModule';
import UtillyClient from '../../UtillyClient';

export default class InfoModule extends DatabaseModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'info';
    }
}
