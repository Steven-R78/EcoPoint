import { NextFunction, Request, Response } from 'express';

const inferStatus = (message: string): number => {
  if (message.includes('inválid') || message.includes('inválid') || message.includes('inválido') || message.includes('required') || message.includes('debe')) return 400;
  if (message.includes('no encontrado')) return 404;
  if (message.includes('ya')) return 409;
  if (message.includes('Token')) return 401;
  return 400;
};

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = inferStatus(error.message);
  return res.status(status).json({ message: error.message });
};
