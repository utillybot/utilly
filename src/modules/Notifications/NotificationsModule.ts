import UtillyClient from '../../bot';
import DatabaseModule from '../../handlers/ModuleHandler/Module/DatabaseModule';

export default class NotificationsModule extends DatabaseModule {
    constructor(bot: UtillyClient) {
        super(bot);
        this.databaseEntry = 'notifications';
    }
}
