const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const compression = require('compression');
const path = require('path');
const xss = require('xss');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { metaMiddleware } = require('./middlewares/session');
const { verifyToken } = require('./services/token.service');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
}

// set security HTTP headers - CONFIGURE HELMET
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin embedding of resources
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(), // Start with sensible defaults
        'default-src': ["'self'"],
        // Allow images from self, data URIs, and explicitly from the backend origin
        'img-src': ["'self'", 'data:', config.backend_url || 'http://localhost:3030'],
        // Allow connections (API calls, etc.) to self and the backend origin
        'connect-src': ["'self'", config.backend_url || 'http://localhost:3030'],
        // Adjust script-src, style-src etc. based on your specific frontend needs
        'script-src': ["'self'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        // Add other directives as necessary for fonts, frames, etc.
      },
    },
  }),
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// --- General CORS Configuration ---
const allowedOrigins =
  config.env === 'production'
    ? [config.frontend_url] // Replace with your actual frontend URL config variable
    : ['http://localhost:5173', 'http://127.0.0.1:5173']; // Add other local dev origins if needed

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin OR requests from allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-meta', 'x-user-id'], // Ensure all custom headers are listed
  credentials: true, // Important if you handle sessions/auth tokens via headers/cookies
};

// Apply general CORS settings
app.use(cors(corsOptions));
// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// --- Static File Serving ---
// Serve static files from the 'public' directory, mounted under /v1
// e.g., requests to /v1/images/hero.png will look for ./public/images/hero.png
const staticDir = path.join(__dirname, 'public');
app.use('/v1', express.static(staticDir));

// jwt authentication
app.use(passport.initialize());

// ... existing code ...

// ... existing code ...
