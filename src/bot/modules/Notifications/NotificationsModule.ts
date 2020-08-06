import DatabaseModule from '../../handlers/ModuleHandler/Module/DatabaseModule';
import UtillyClient from '../../UtillyClient';

export default class NotificationsModule extends DatabaseModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'notifications';
    }
}
