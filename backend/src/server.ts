import './config';
import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze';
import jobsRouter from './routes/jobs';
import scoreRouter from './routes/score';
import gapsRouter from './routes/gaps';
import skillFocusRouter from './routes/skillFocus';
import learningPathRouter from './routes/learningPath';
import { config } from './config';

const app = express();
const PORT = config.port;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(analyzeRouter);
app.use(jobsRouter);
app.use(scoreRouter);
app.use(gapsRouter);
app.use(skillFocusRouter);
app.use(learningPathRouter);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

export default app;
