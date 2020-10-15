import { Controller, Get, Res } from 'routing-controllers';
import type { Response } from 'express';
import { UtillyWeb } from '../UtillyWeb';

@Controller('/api')
export class APIController {
    @Get('/stats')
    getStats(@Res() res: Response): Response {
        return res.send({
            guilds: UtillyWeb.bot.guilds.size,
            users: UtillyWeb.bot.users.size,
        });
    }

    @Get('/commands')
    getCommands(@Res() res: Response): Response {
        return res.send({
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
        });
    }
}
