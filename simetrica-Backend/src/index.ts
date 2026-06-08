import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB, corsOptions, createDefaultAdmin, globalLimiter, authLimiter, formSubmissionLimiter } from './config/index.js';
import { errorHandler } from './middleware/error-handler.js';
import {
  authRoutes,
  projectRoutes,
  designRoutes,
  commentRoutes,
  imageRoutes,
  contactRoutes,
  workWithUsRoutes,
  providerRoutes,
} from './routes/index.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middlewares de seguridad
app.use(helmet());
app.use(globalLimiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting específico por ruta
app.use('/api/auth', authLimiter);
app.use('/api/contact', formSubmissionLimiter);
app.use('/api/providers', formSubmissionLimiter);
app.use('/api/work-with-us', formSubmissionLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/work-with-us', workWithUsRoutes);
app.use('/api/providers', providerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler (debe ir después de todas las rutas)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await createDefaultAdmin();
    
    // Railway requiere escuchar en 0.0.0.0, no en localhost
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
