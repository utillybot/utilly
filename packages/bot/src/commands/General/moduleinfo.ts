import { BaseCommandModule } from '@utilly/framework';
import { CommandModule } from '@utilly/framework';

@CommandModule({ name: 'General', description: 'General bot commands' })
export default class GeneralCommandModule extends BaseCommandModule {}
