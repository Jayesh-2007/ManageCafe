const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');

const isProduction = process.env.NODE_ENV === 'production';
const logsDir = path.join(__dirname, '..', 'logs');

fs.mkdirSync(logsDir, { recursive: true });

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metadata = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${stack || message}${metadata}`;
  })
);

const loggerTransports = isProduction
  ? [
      new transports.File({
        filename: path.join(logsDir, 'app.log'),
        level: 'info',
      }),
      new transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
      }),
    ]
  : [
      new transports.Console({
        level: 'info',
        format: developmentFormat,
      }),
    ];

const logger = createLogger({
  level: 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
  },
  format: logFormat,
  transports: loggerTransports,
  exitOnError: false,
});

morgan.token('request-body-size', (req) => {
  const length = req.headers['content-length'];
  return length || 0;
});

const requestLogger = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

  return JSON.stringify({
    level,
    message: 'API request completed',
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status,
    responseTimeMs: Number(tokens['response-time'](req, res)),
    contentLength: tokens.res(req, res, 'content-length') || 0,
    requestBodySize: Number(tokens['request-body-size'](req, res)),
    ip: tokens['remote-addr'](req, res),
    userAgent: tokens['user-agent'](req, res),
  });
}, {
  skip: (req) => !req.originalUrl.startsWith('/api'),
  stream: {
    write: (message) => {
      const payload = JSON.parse(message);
      const { level, message: logMessage, ...meta } = payload;
      logger[level](logMessage, meta);
    },
  },
});

module.exports = {
  logger,
  requestLogger,
};
