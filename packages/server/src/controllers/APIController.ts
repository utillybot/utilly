import type { Request, Response } from 'express';
import type { UtillyClient } from '@utilly/framework';
/*
@Controller('api')
export class APIController {
    constructor(private _bot: UtillyClient) {}

    @Get('/stats')
    getStats(req: Request, res: Response): void {
        res.status(200).json({
            guilds: this._bot.guilds.size,
            users: this._bot.users.size,
        });
    }

    @Get('/commands')
    getCommands(req: Request, res: Response): void {
        res.status(200).json({
            commandModules: Array.from(
                this._bot.commandHandler.commandModules.values()
            ).map(mod => {
                return {
                    name: mod.info.name,
                    description: mod.info.description,
                    commands: Array.from(mod.commands.values()).map(
                        cmd => cmd.info
                    ),
                };
            }),
        });
    }
}
*/
