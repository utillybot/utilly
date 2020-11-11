import { CommandModule, BaseCommandModule, PreHook } from '@utilly/framework';
import { IsModuleEnabledHook } from '../../hooks/IsModuleEnabledHook';

@CommandModule({
    name: 'Info',
    description: 'View info about discord entities',
})
@PreHook(IsModuleEnabledHook({ databaseEntry: 'info' }))
export default class InfoCommandModule extends BaseCommandModule {}
