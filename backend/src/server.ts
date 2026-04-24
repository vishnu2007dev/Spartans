import './config'; // Load environment variables first
import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze';
import jobsRouter from './routes/jobs';
import { config } from './config';

const app = express();
const PORT = config.port;

// Enable CORS for the frontend dev server
app.use(cors({ origin: 'http://localhost:3000' }));

// JSON body parsing middleware
app.use(express.json());

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Wire in the routes
app.use(analyzeRouter);
app.use(jobsRouter);

app.listen(PORT, () => {
  console.log(`Unlockd backend listening on http://localhost:${PORT}`);
});

export default app;
