import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UploadForm from './components/UploadForm' // Ahora coincide con el nombre del archivo
import StudentDetail from './components/StudentDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Ya no necesitamos pasar props, el componente se gestiona solo */}
          <Route path="/subir" element={<UploadForm />} />
          
          <Route path="/alumno/:id" element={<StudentDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;