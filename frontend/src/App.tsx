// Importar librerias de react
import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Importar paginas principales en orden
import Nav from "./components/nav/NavBar";
import Inicio from "./pages/inicio/Inicio";
import PaginaProyectos from "./pages/proyectos/PaginaProyectos";
import PaginaTrabajoDeTituloPregrado from "./pages/tesis/Pregrado";
import PaginaTrabajoDeTituloPostgrado from "./pages/tesis/Postgrado";
import PaginaPracticasProfesionales from './pages/practicas/PracticasProfesionales';
import PaginaPracticasIniciales from './pages/practicas/PracticasIniciales';
import PaginaArticulos from "./pages/articulos/PaginaArticulos";
import PaginaColaboraciones from "./pages/colaboraciones/PaginaColaboraciones";
import PaginaNoticias from "./pages/noticias/PaginaNoticias";
import PaginaQuienesSomos from "./pages/QuienesSomos/PaginaQuienesSomos";
import Footer from "./components/Footer";
import PaginaInterconexiones from "./pages/interconexiones/PaginaInterconexiones";
import TituloDetalle from "./pages/tesis/TrabajoDeTituloDetalle";
import PaginaResultadosBusqueda from "./pages/ResultadosBusqueda/PaginaResultadosBusqueda";

// Importar paginas de paginas principales
import ArticuloDetalle from "./pages/articulos/ArticuloDetalle";
import ProyectoDetalle from "./pages/proyectos/ProyectosDetalle";
import NoticiaDetalle from "./pages/noticias/NoticiasDetalle";
//import TrabajoDeTituloDetalle from "./pages/TrabajoDeTituloDetalle" 
import PracticaDetalle from "./pages/practicas/PracticaDetalle";

// Importar login de administrador
import AdminLogin from "./pages/admin/AdminLogin";
import PanelAdmin from "./pages/panelAdmin/panelAdmin";
import NuevoProyecto from "./pages/panelAdmin/nuevo/nuevo_proyecto";
import EditarProyecto from "./pages/panelAdmin/editar/editar_proyecto";
import NuevoArticulo from "./pages/panelAdmin/nuevo/nuevo_articulo";
import EditarArticulo from "./pages/panelAdmin/editar/editar_articulo";
import NuevoIntegrante from "./pages/panelAdmin/nuevo/nuevo_integrante";
import EditarIntegrante from "./pages/panelAdmin/editar/editar_integrante";
import NuevoInstitucion from "./pages/panelAdmin/nuevo/nuevo_institucion"
import EditarInstitucion from "./pages/panelAdmin/editar/editar_institucion"
import NuevoTrabajoDeTitulo from "./pages/panelAdmin/nuevo/nuevo_trabajo_titulo"
import EditarTrabajosDeTitulo from "./pages/panelAdmin/editar/editar_trabajosdetitulo"
import NuevoPractica from "./pages/panelAdmin/nuevo/nuevo_practica"
import EditarPractica from "./pages/panelAdmin/editar/editar_practica"
import NuevoColaboracion from "./pages/panelAdmin/nuevo/nuevo_colaboracion"
import EditarColaboracion from "./pages/panelAdmin/editar/editar_colaboracion"
import NuevoNoticia from "./pages/panelAdmin/nuevo/nuevo_noticia"
import EditarNoticia from "./pages/panelAdmin/editar/editar_noticia"
import NuevoAdmin from "./pages/panelAdmin/nuevo/nuevo_admin"

// Importar Protector de Rutas
import ProtectedRoute from "./components/ProtectedRoute";


// Importar PaginaError
import ErrorPage from "./components/ErrorPage";

// Import css principal
import "./css/App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };
  
  React.useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <Router>
      <div className="App">
        <Nav/>
        <div className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Navigate to="/inicio" replace />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/proyectos" element={<PaginaProyectos />} />
            <Route path="/proyectos/:id" element={<ProyectoDetalle />} />

            <Route path="/trabajos_de_titulo_pregrado" element={<PaginaTrabajoDeTituloPregrado />} />
            <Route path="/tesis/:id" element={<TituloDetalle tipo="pregrado"/>} />

            <Route path="/trabajos_de_titulo_postgrado" element={<PaginaTrabajoDeTituloPostgrado />} />
            <Route path="/tesis/:id" element={<TituloDetalle tipo="postgrado" />} />
            
            <Route path="/articulos" element={<PaginaArticulos />} />
            <Route path="/articulos/:id" element={<ArticuloDetalle />} />

            <Route path="/practicas_iniciales" element={<PaginaPracticasIniciales />} />
            <Route path="/practicas_iniciales/:id" element={<PracticaDetalle tipo="inicial"/>} />
            <Route path="/practicas/:id" element={<PracticaDetalle tipo="inicial"/>} />

            <Route path="/practicas_profesionales" element={<PaginaPracticasProfesionales />} />
            <Route path="/practicas_profesionales/:id" element={<PracticaDetalle tipo="profesional"/>} />

            <Route path="/colaboraciones" element={<PaginaColaboraciones />} />
            <Route path="/interconexiones" element={<PaginaInterconexiones />} />
            <Route path="/noticias" element={<PaginaNoticias />} />
            <Route path="/noticias/:id" element={<NoticiaDetalle />} />

            <Route path="/quienes_somos" element={<PaginaQuienesSomos />} />

            <Route path="/resultados_busqueda" element={<PaginaResultadosBusqueda />} />

            <Route path="/admin" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />

            {/* Rutas protegidas */}
            <Route path="/admin/panel" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PanelAdmin /></ProtectedRoute>} />
            <Route path="/admin/nuevo/integrante" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoIntegrante /></ProtectedRoute>} />
            <Route path="/admin/nuevo/proyecto" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoProyecto /></ProtectedRoute>} />
            <Route path="/admin/nuevo/articulo" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoArticulo /></ProtectedRoute>} />
            <Route path="/admin/nuevo/institucion" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoInstitucion /></ProtectedRoute>} />
            <Route path="/admin/nuevo/trabajo-de-titulo" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoTrabajoDeTitulo /></ProtectedRoute>} />
            <Route path="/admin/nuevo/practica" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoPractica /></ProtectedRoute>} />
            <Route path="/admin/nuevo/colaboracion" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoColaboracion /></ProtectedRoute>} />
            <Route path="/admin/nuevo/noticia" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoNoticia /></ProtectedRoute>} />
            <Route path="/admin/nuevo/administrador" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NuevoAdmin /></ProtectedRoute>} />
            <Route path="/admin/editar/proyecto" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarProyecto /></ProtectedRoute>} />
            <Route path="/admin/editar/articulo" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarArticulo /></ProtectedRoute>} />
            <Route path="/admin/editar/integrante" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarIntegrante /></ProtectedRoute>} />
            <Route path="/admin/editar/colaboracion" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarColaboracion /></ProtectedRoute>} />
            <Route path="/admin/editar/noticia" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarNoticia /></ProtectedRoute>} />
            <Route path="/admin/editar/trabajo-de-titulo" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarTrabajosDeTitulo /></ProtectedRoute>} />
            <Route path="/admin/editar/practica" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarPractica /></ProtectedRoute>} />
            <Route path="/admin/editar/institucion" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarInstitucion /></ProtectedRoute>} />

            <Route path="*" element={<ErrorPage />} />

          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
};
export default App;