import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Ban, Calendar } from 'lucide-react';

const StudentDetail = () => {
  const { id } = useParams();
  const [alumno, setAlumno] = useState<any>(null);
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/alumnos/${id}`);
        setAlumno(res.data.datos);
        setHistorial(res.data.historial);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDatos();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Cargando expediente...</div>;
  if (!alumno) return <div className="p-10 text-center text-red-500">Alumno no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <Link to="/" className="flex items-center text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={20} className="mr-2" /> Volver al Dashboard
      </Link>

      {/* CABECERA DEL ALUMNO */}
      <div className="bg-white p-6 rounded-xl shadow-md border-l-8 border-blue-500 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{alumno.nombre_completo}</h1>
        <div className="flex gap-4 mt-2 text-gray-600">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
            {alumno.grupo}
          </span>
          <span className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-700">
            Normativa: {alumno.normativa}
          </span>
        </div>
      </div>

      {/* HISTORIAL VISUAL (TU IDEA) */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar /> Línea de Tiempo de Incidencias
      </h2>

      <div className="space-y-4">
        {historial.map((evento) => {
          // Lógica de colores según el estado que nos manda el backend
          let estilo = "";
          let icono = null;
          let textoEstado = "";

          if (evento.estado === 'EXPULSION') {
            estilo = "bg-purple-900 text-white border-purple-950"; // Morado oscuro (Reset)
            icono = <Ban size={24} className="text-purple-300" />;
            textoEstado = "🛑 EXPULSIÓN (RESETEA CONTADOR)";
          } else if (evento.estado === 'ACTIVA') {
            estilo = "bg-red-50 border-red-200 border-l-4 border-l-red-600"; // Rojo (Peligro)
            icono = <AlertCircle size={24} className="text-red-600" />;
            textoEstado = "⚠️ INCIDENCIA ACTIVA";
          } else {
            estilo = "bg-gray-50 border-gray-200 opacity-60 grayscale"; // Gris (Pasado)
            icono = <CheckCircle size={24} className="text-gray-400" />;
            textoEstado = "✔️ CADUCADA / PERDONADA";
          }

          // Formatear fecha bonita
          const fechaObj = new Date(evento.fecha);
          const fechaBonita = fechaObj.toLocaleDateString('es-ES', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          });

          return (
            <div key={evento.id} className={`p-4 rounded-lg border shadow-sm flex gap-4 items-start transition-all hover:scale-[1.01] ${estilo}`}>
              <div className="mt-1 flex-shrink-0">{icono}</div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg capitalize">{fechaBonita}</h3>
                  <span className="text-xs font-bold tracking-wider px-2 py-1 rounded bg-black/10">
                    {textoEstado}
                  </span>
                </div>
                <p className="mt-1 font-medium">{evento.tipo}</p>
                <p className="text-sm mt-2 opacity-90 italic">"{evento.observacion}"</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDetail;