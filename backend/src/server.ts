import http from 'http';
import { createApp } from './app';
import { loadEnv } from './config/env';

const env = loadEnv();
const app = createApp();
const server = http.createServer(app);

const port = env.PORT;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`HopeHUB backend listening on http://localhost:${port}`);
});
