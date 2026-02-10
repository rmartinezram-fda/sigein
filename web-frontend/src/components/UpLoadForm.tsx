import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <--- IMPORTANTE: Para navegar

const UploadForm = () => {
  // Ya no usamos "props" aquí, usamos el hook de navegación
  const navigate = useNavigate(); 
  
  const [file, setFile] = useState<File | null>(null);
  const [normativa, setNormativa] = useState<string>('eso_general');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('normativa', normativa);

    try {
      await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('success');
      setMessage('✅ Archivo procesado y guardado correctamente.');
      
      // Esperamos 1.5 segundos y volvemos al panel automáticamente
      setTimeout(() => {
        navigate('/'); // <--- ESTO NOS LLEVA AL DASHBOARD
      }, 1500);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('❌ Error al subir el archivo. Revisa la consola.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="text-blue-600" />
        Subir Parte de Convivencia
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selector de Normativa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Normativa a aplicar</label>
          <select 
            value={normativa}
            onChange={(e) => setNormativa(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
          >
            <option value="eso_general">ESO General (Límite 3)</option>
            <option value="eso_especial">ESO Especial / PMAR (Límite 2)</option>
            <option value="bachillerato">Bachillerato (Límite 5)</option>
            <option value="fp_basica">FP Básica (Límite 4)</option>
          </select>
        </div>

        {/* Input de Archivo */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center pointer-events-none">
            {file ? (
              <>
                <FileText size={48} className="text-blue-500 mb-2" />
                <span className="text-sm font-semibold text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-400">Click para cambiar</span>
              </>
            ) : (
              <>
                <Upload size={48} className="text-gray-400 mb-2" />
                <span className="text-gray-600 font-medium">Arrastra el PDF aquí o haz clic</span>
                <span className="text-xs text-gray-400 mt-1">Solo archivos PDF</span>
              </>
            )}
          </div>
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={!file || status === 'uploading'}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all
            ${!file || status === 'uploading' 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {status === 'uploading' ? 'Procesando...' : 'Subir y Procesar'}
        </button>

        {/* Mensajes de Estado */}
        {status === 'success' && (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 animate-pulse">
            <CheckCircle size={20} />
            {message}
          </div>
        )}
        
        {status === 'error' && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadForm;