import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error({ err, url: req.url, method: req.method }, 'Unhandled error');
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}
