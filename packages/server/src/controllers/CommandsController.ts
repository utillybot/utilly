import { Controller, Get, Res } from 'routing-controllers';
import type { Response } from 'express';
import { UtillyWeb } from '../UtillyWeb';

@Controller('/api/commands')
export class CommandsController {
    @Get()
    getAll(@Res() res: Response): Response {
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
