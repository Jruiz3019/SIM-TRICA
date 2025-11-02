// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

// Lazy loading para mejor performance
const Home = lazy(() => import("./pages/HomePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TrabajaConNosotrosPage = lazy(() => import("./pages/TrabajaConNosotrosPage"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));
const DesignPage = lazy(() => import("./pages/DesignPage"));
const DesignDetailPage = lazy(() => import("./pages/DesignDetailPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const AsociadosPage = lazy(() => import("./pages/AsociadosPage"));

// Componente de loading para Suspense
const LoadingSpinner = () => (
  <div className="loading-container" role="status" aria-label="Cargando página">
    <div className="loading-spinner"></div>
    <span className="sr-only">Cargando...</span>
  </div>
);

function App() {
  return (
    <div className="app-container">
      {/* Suspense para lazy loading con fallback de loading */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Rutas futuras se agregarán aquí */}
          <Route path="/asociados" element={<AsociadosPage />} />
          <Route path="/proyectos" element={<ProjectsPage />} />
          <Route path="/proyecto/:id" element={<ProjectDetailPage />} />
          <Route path="/diseños" element={<DesignPage />} />
          <Route path="/diseno/:id" element={<DesignDetailPage />} />
          <Route path="/trabaja-con-nosotros" element={<TrabajaConNosotrosPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Ruta protegida - Solo ADMIN */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AdminPanel />
              </PrivateRoute>
            } 
          />
          {/* Ruta 404 */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
