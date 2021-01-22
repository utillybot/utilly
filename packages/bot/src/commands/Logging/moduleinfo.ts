import { BaseCommandModule, CommandModule, PreHook } from '@utilly/framework';
import { IsModuleEnabledHook } from '../../hooks/IsModuleEnabledHook';

@CommandModule({
	name: 'Logging',
	description: 'View info about discord entities',
})
@PreHook(IsModuleEnabledHook({ databaseEntry: 'logging' }))
export default class LoggingCommandModule extends BaseCommandModule {}
