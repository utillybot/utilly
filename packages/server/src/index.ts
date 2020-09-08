import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
const PORT = process.env.PORT || 3006;
const app = express();
const pages = ['commands', 'about', ''];

app.use((req, res, next) => {
    const test = /\?[^]*\//.test(req.url);
    if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
        res.redirect(301, req.url.slice(0, -1));
    else next();
});

app.use(
    pages.map(page => `/${page}`),
    express.static(path.join(process.cwd(), 'packages', 'web', 'public'), {
        redirect: false,
    })
);

app.use(
    pages.map(page => `/${page}`),
    express.static(path.join(process.cwd(), 'packages', 'web', 'dist'), {
        redirect: false,
    })
);

app.get(
    pages.map(page => `/${page}`),
    (req: Request, res: Response) => {
        res.sendFile(
            path.join(process.cwd(), 'packages', 'web', 'public', 'index.html')
        );
    }
);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
