import type { CorsOptions } from 'cors';

/**
 * Configuración de CORS (Cross-Origin Resource Sharing)
 * Define qué orígenes pueden acceder a la API y qué métodos están permitidos
 */

/**
 * Lista de orígenes permitidos para hacer peticiones a la API
 * En producción, reemplazar con los dominios reales
 */
const allowedOrigins = [
  'http://localhost:3000',      // Frontend en desarrollo
  'http://localhost:3001',      // Frontend alternativo
  'http://localhost:5173',      // Vite default port
  'http://localhost:5174',      // Vite alternate port
  'http://localhost:4200',      // Angular default port
];

// Agregar dominios de producción desde variables de entorno
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Permitir dominios de Railway automáticamente
if (process.env.RAILWAY_STATIC_URL) {
  allowedOrigins.push(`https://${process.env.RAILWAY_STATIC_URL}`);
}

// Variable de entorno adicional para múltiples dominios (separados por coma)
if (process.env.ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
  allowedOrigins.push(...additionalOrigins);
}

/**
 * Opciones de configuración de CORS
 * 
 * - origin: Verifica si el origen de la petición está permitido
 * - credentials: Permite el envío de cookies y headers de autenticación
 * - methods: Métodos HTTP permitidos
 * - allowedHeaders: Headers permitidos en las peticiones
 * - exposedHeaders: Headers que el cliente puede leer en la respuesta
 * - maxAge: Tiempo en segundos que el navegador puede cachear la respuesta preflight
 */
export const corsOptions: CorsOptions = {
  /**
   * Función que valida el origen de la petición
   * @param origin - URL del origen que hace la petición
   * @param callback - Función callback para permitir o denegar el acceso
   */
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permite peticiones sin origen (como Postman, curl, apps móviles)
    if (!origin) {
      return callback(null, true);
    }

    // Verifica si el origen está en la lista de permitidos
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  // Permite el envío de cookies y headers de autenticación
  credentials: true,

  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Headers que pueden ser enviados en la petición
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],

  // Headers de respuesta que el cliente puede leer
  exposedHeaders: ['Content-Range', 'X-Content-Range'],

  // Cachea la respuesta preflight por 1 hora (3600 segundos)
  maxAge: 3600,
};
