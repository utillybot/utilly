import { Controller, Get, Res } from 'routing-controllers';
import { UtillyWeb } from '../UtillyWeb';
import type { Response } from 'koa';

@Controller('/api')
export class APIController {
    @Get('/stats')
    getStats(@Res() res: Response): void {
        res.body = {
            guilds: UtillyWeb.bot.guilds.size,
            users: UtillyWeb.bot.users.size,
        };
    }

    @Get('/commands')
    getCommands(@Res() res: Response): void {
        res.body = {
            commandModules: Array.from(
                UtillyWeb.bot.commandHandler.commandModules.values()
            ).map(mod => {
                return {
                    name: mod.info.name,
                    description: mod.info.description,
                    commands: Array.from(mod.commands.values()).map(
                        cmd => cmd.help
                    ),
                };
            }),
        };
    }
}
