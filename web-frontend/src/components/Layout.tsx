import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // <--- IMPORTANTE: Importamos Link
import { LayoutDashboard, UploadCloud, LogOut, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation(); 

  // Esta función decide si el botón se pinta azul (activo) o gris (inactivo)
  const getButtonClass = (path: string) => {
    const baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium";
    const activeClass = "bg-blue-600 text-white shadow-lg hover:bg-blue-500";
    const inactiveClass = "text-slate-300 hover:bg-slate-800";

    return location.pathname === path 
      ? `${baseClass} ${activeClass}` 
      : `${baseClass} ${inactiveClass}`;
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* BARRA LATERAL */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
          {/* Título como enlace al inicio */}
          <Link to="/" className="text-2xl font-bold tracking-wider flex items-center gap-2 hover:text-blue-400 transition-colors">
            <FileText className="text-blue-400" />
            SIGEIN
          </Link>
          <p className="text-xs text-slate-400 mt-1">Gestión de Convivencia</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          
          {/* BOTÓN 1: AHORA ES UN LINK */}
          <Link to="/" className={getButtonClass('/')}>
            <LayoutDashboard size={20} />
            <span>Panel Principal</span>
          </Link>

          {/* BOTÓN 2: AHORA ES UN LINK */}
          <Link to="/subir" className={getButtonClass('/subir')}>
            <UploadCloud size={20} />
            <span>Subir Informes</span>
          </Link>

        </nav>

        {/* Botón de Salir (Este sigue siendo botón porque aún no hace nada real) */}
        <div className="p-4 border-t border-slate-700">
          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded transition-colors">
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/' ? 'Vista General' : 
             location.pathname === '/subir' ? 'Carga de Archivos' : 'Sistema'}
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-sm text-gray-600">Admin</span>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;