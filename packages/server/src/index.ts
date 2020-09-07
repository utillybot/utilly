import express from 'express';
import path from 'path';
const PORT = process.env.PORT || 3006;
const app = express();
const pages = ['commands', 'about', ''];

app.use(
    pages.map(page => `/${page}`),
    express.static(path.join(process.cwd(), 'packages', 'web', 'public'))
);

app.use(
    pages.map(page => `/${page}`),
    express.static(path.join(process.cwd(), 'packages', 'web', 'dist'))
);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
