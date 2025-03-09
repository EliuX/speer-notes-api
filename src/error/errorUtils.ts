import { ArgumentsHost } from '@nestjs/common';

export const respondWithStandardFormat = (
  host: ArgumentsHost,
  statusCode: number,
  message: string | object,
): void => {
  const ctx = host.switchToHttp();
  const request = ctx.getRequest<Request>();

  ctx.getResponse().status(statusCode).json({
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: request.url,
  });
};
