import 'dotenv/config';
import createApp from './app';
import connectDB from './config/database';

const PORT = process.env.PORT ?? 5000;

const start = async (): Promise<void> => {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
