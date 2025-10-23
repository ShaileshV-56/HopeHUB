import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import donorsRouter from './routes/donors';
import organizationsRouter from './routes/organizations';
import donationsRouter from './routes/donations';
import donationRequestsRouter from './routes/donationRequests';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/donors', donorsRouter);
  app.use('/api/organizations', organizationsRouter);
  app.use('/api/donations', donationsRouter);
  app.use('/api/donation-requests', donationRequestsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
