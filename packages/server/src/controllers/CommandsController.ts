import { Controller, Get, Req, Res } from 'routing-controllers';
import type { Request, Response } from 'express';
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
                };
            }),
        });
    }
    @Get('/:module')
    getGuilds(@Req() req: Request, @Res() res: Response): Response {
        const module = UtillyWeb.bot.commandHandler.commandModules.get(
            req.params.module
        );
        if (!module) return res.status(404);
        return res.send({
            commands: Array.from(module.commands.values()).map(cmd => {
                return {
                    name: cmd.help.name,
                    description: cmd.help.description,
                    aliases: cmd.help.aliases,
                };
            }),
        });
    }

    @Get('/:module/:command')
    getUsers(@Req() req: Request, @Res() res: Response): Response {
        const module = UtillyWeb.bot.commandHandler.commandModules.get(
            req.params.module
        );
        if (!module) return res.status(404);
        const command = module.commands.get(req.params.command);
        if (!command) return res.status(404);
        return res.send({ command: command.help });
    }
}
