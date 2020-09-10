import type { Request, Response } from 'express';
import { Controller, Get, Req, Res } from 'routing-controllers';
import { UtillyWeb } from '../UtillyWeb';

@Controller('/stats')
export class StatsController {
    @Get()
    getAll(@Req() req: Request, @Res() res: Response): Response {
        return res.send({
            guilds: UtillyWeb.bot.guilds.size,
            users: UtillyWeb.bot.users.size,
        });
    }
    @Get('/guilds')
    getGuilds(@Req() req: Request, @Res() res: Response): Response {
        return res.send({ guilds: UtillyWeb.bot.guilds.size });
    }

    @Get('/users')
    getUsers(@Req() req: Request, @Res() res: Response): Response {
        return res.send({ users: UtillyWeb.bot.users.size });
    }
}
