import { useState } from 'react'; // <--- Hemos quitado "React," de aquí
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import UploadForm from './components/UpLoadForm';
import Dashboard from './components/Dashboard';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
    navigate('/'); 
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <div className="max-w-6xl mx-auto">
             <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
              <p className="text-gray-500">Resumen de alertas y alumnos en riesgo</p>
            </div>
            <Dashboard key={refreshKey} />
          </div>
        } />

        <Route path="/subir" element={
          <div className="max-w-4xl mx-auto">
             <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Importar Datos</h1>
              <p className="text-gray-500">Sube los PDFs exportados desde SIGAD</p>
            </div>
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
        } />
      </Routes>
    </Layout>
  );
}

export default App;