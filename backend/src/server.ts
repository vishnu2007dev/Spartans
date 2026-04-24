import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for the frontend dev server
app.use(cors({ origin: 'http://localhost:3000' }));

// JSON body parsing middleware
app.use(express.json());

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Unlockd backend listening on http://localhost:${PORT}`);
});

export default app;
