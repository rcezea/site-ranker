import express from 'express';
import dotenv from 'dotenv';
import controllerRouting from './routes/index';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

// Middleware for security
app.use(helmet());

// Middleware for logging
app.use(morgan('combined'));

// Middleware for rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '200mb' }));

controllerRouting(app);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
