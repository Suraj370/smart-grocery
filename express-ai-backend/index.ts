import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ALLOWED_ORIGIN, PORT } from './src/config/env.js';
import { httpLogger, logger } from './src/utils/logger.ts';
import { generateSuggestions } from './src/flows/suggestionFlow.ts';
import { errorHandler } from './src/middleware/errorHandler.js';


const app = express();

const corsOptions = {
    // Only allow this specific domain, retrieved from the environment config
    origin: ALLOWED_ORIGIN, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers) if needed
    optionsSuccessStatus: 204 // Required for some legacy browsers (IE11, various SmartTVs)
};
// Global middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(httpLogger);


// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Suggestions endpoint
app.post('/api/suggestions', async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid input: 'items' must be an array" });
  }

  // business-level logging
  logger.info({ items }, 'Generating suggestions');

  const output = await generateSuggestions(items);
  return res.json(output);
});


// Final error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Gemini AI service running on http://localhost:${PORT}`);
});
