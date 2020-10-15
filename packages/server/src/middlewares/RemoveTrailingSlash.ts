import type { ExpressMiddlewareInterface } from 'routing-controllers';
import { Middleware } from 'routing-controllers';
import type { NextFunction, Request, Response } from 'express';

@Middleware({ type: 'before' })
export class RemoveTrailingSlash implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next: NextFunction): void {
        const test = /\?[^]*\//.test(req.url);
        if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
            return res.redirect(301, req.url.slice(0, -1));
        next();
    }
}
