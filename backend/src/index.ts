import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import { foodDonationsRouter } from './routes/foodDonations';
import { organizationsRouter } from './routes/organizations';
import { donationRequestsRouter } from './routes/donationRequests';
import { foodRequestsRouter } from './routes/foodRequests';
import { authRouter } from './routes/auth';
import { statsRouter } from './routes/stats';
import { chatRouter } from './routes/chat';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/api', healthRouter);
app.use('/api/donations/food', foodDonationsRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/donation-requests', donationRequestsRouter);
app.use('/api/food-requests', foodRequestsRouter);
app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);
app.use('/api/chat', chatRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`HopeHUB backend listening on http://localhost:${env.port}`);
});
