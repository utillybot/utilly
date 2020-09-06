import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 3006;
const app = express();

app.use(
    '/',
    express.static(path.join(process.cwd(), 'packages', 'web', 'public'))
);
app.use(
    '/',
    express.static(path.join(process.cwd(), 'packages', 'web', 'dist'))
);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
