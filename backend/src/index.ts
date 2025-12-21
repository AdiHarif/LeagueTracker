import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger.js';
import { config } from './config.js';
import { requireAuth } from './middleware.js';
import authRoutes from './routes/auth.js';
import leagueRoutes from './routes/leagues.js';
import matchRoutes from './routes/matches.js';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(morgan(
  ':method :url :status - :response-time ms'
  , {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Root endpoint
app.get('/', requireAuth, (req, res) => {
  res.json({
    message: 'Welcome to the Sealed League Tracker backend API!',
    user: req.user,
  });
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/leagues', requireAuth, leagueRoutes);
app.use('/matches', requireAuth, matchRoutes);

// Start server
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
