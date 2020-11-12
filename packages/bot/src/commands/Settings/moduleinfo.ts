import { BaseCommandModule, CommandModule } from '@utilly/framework';

@CommandModule({
	name: 'Settings',
	description: 'Modify settings for all modules.',
})
export default class SettingsCommandModule extends BaseCommandModule {}
