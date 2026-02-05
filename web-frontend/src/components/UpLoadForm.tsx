import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

// 1. Definimos qué propiedades acepta este componente
interface UploadFormProps {
  onUploadSuccess: () => void; // Recibe una función vacía
}

// 2. El componente usa esas props
const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [normativa, setNormativa] = useState('eso_general');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [mensaje, setMensaje] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setMensaje('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('normativa', normativa);

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('success');
      setMensaje(`✅ Procesado con éxito. Se detectaron ${response.data.alumnosDetectados} alumnos.`);
      setFile(null);
      
      // Limpiamos el input file por si quieren subir otro archivo seguido
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // IMPORTANTE: Llamamos a la función del padre para actualizar la lista
      onUploadSuccess(); 

    } catch (error) {
      console.error(error);
      setStatus('error');
      setMensaje('❌ Error al subir o procesar el archivo. Revisa que el Backend esté encendido.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <UploadCloud className="text-blue-600" />
        Subir Informes de Conducta
      </h2>

      {/* Selector de Normativa */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecciona la Normativa / Etapa
        </label>
        <select 
          value={normativa}
          onChange={(e) => setNormativa(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
        >
          <option value="eso_general">ESO - Régimen General (3 faltas = Alerta)</option>
          <option value="eso_especial">ESO - Programas Especiales / PMAR</option>
          <option value="bachillerato">Bachillerato (Reglamento Adultos)</option>
          <option value="fp_basica">Formación Profesional Básica</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Esto determinará qué baremo de expulsión se aplica a los alumnos de este PDF.
        </p>
      </div>

      {/* Área de Arrastrar */}
      <div 
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
          ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf" 
          onChange={handleFileChange}
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <FileText size={48} className="text-blue-600 mb-2" />
            <p className="font-medium text-gray-700">{file.name}</p>
            <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <UploadCloud size={32} />
            </div>
            <p className="text-lg font-medium text-gray-700">Haz clic para subir el PDF</p>
            <p className="text-sm text-gray-400 mt-1">Soporta archivos generados por SIGAD</p>
          </div>
        )}
      </div>

      {/* Botón y Estado */}
      <div className="mt-6">
        {status === 'uploading' ? (
          <button disabled className="w-full py-3 bg-blue-400 text-white rounded-lg flex items-center justify-center gap-2 cursor-wait">
            <Loader2 className="animate-spin" /> Procesando datos...
          </button>
        ) : (
          <button 
            onClick={handleUpload}
            disabled={!file}
            className={`w-full py-3 rounded-lg font-medium transition-all
              ${!file 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'}
            `}
          >
            Subir y Procesar
          </button>
        )}

        {mensaje && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">{mensaje}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;