import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const createApp = (): Application => {
  const app = express();

  // ─── Middleware ───────────────────────────────────────────────────────────
  app.use(cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // ─── Health Check ─────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Smart Leads API is running 🚀' });
  });

  // ─── Routes ───────────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);

  // ─── Error Handlers ───────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
