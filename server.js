import express from 'express';
import history from 'connect-history-api-fallback';

const app = express();
const staticFileMiddleware = express.static('./dist/');

app.use(staticFileMiddleware);
app.use(history());
app.use(staticFileMiddleware);
// ^ `app.use(staticFileMiddleware)` is included twice as per https://github.com/bripkens/connect-history-api-fallback/blob/master/examples/static-files-and-index-rewrite/README.md#configuring-the-middleware

app.listen(8081, () => console.log('Example app listening on port 8081!'));
