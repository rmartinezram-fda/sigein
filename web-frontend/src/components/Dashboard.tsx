import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, ShieldAlert, User } from 'lucide-react';

interface Alerta {
  nombre_completo: string;
  grupo: string;
  total_activas: number;
  limite_alerta: number;
  tipo_incidencia: string;
}

const Dashboard = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  // Esta función pide los datos al servidor
  const cargarDatos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/alertas');
      setAlertas(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
      setLoading(false);
    }
  };

  // Cargar datos al entrar en la página
  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShieldAlert className="text-red-600" />
        Alumnos en Zona de Riesgo
      </h2>

      {alertas.length === 0 ? (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-green-800">
          ✅ Todo tranquilo. No hay alumnos que superen los límites de alerta hoy.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alertas.map((alumno, index) => {
            // Calcular gravedad
            const porcentaje = (alumno.total_activas / alumno.limite_alerta) * 100;
            const esGrave = porcentaje >= 100;

            return (
              <div 
                key={index} 
                className={`bg-white p-5 rounded-xl shadow-sm border-l-4 transition-transform hover:scale-105
                  ${esGrave ? 'border-red-500' : 'border-yellow-400'}
                `}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{alumno.nombre_completo}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <User size={12} />
                      {alumno.grupo}
                    </div>
                  </div>
                  {esGrave && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      EXPULSIÓN
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Incidencias:</span>
                    <span className="font-bold">{alumno.total_activas} / {alumno.limite_alerta}</span>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${esGrave ? 'bg-red-600' : 'bg-yellow-400'}`} 
                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-gray-400 text-right mt-1">
                    Tipo: {alumno.tipo_incidencia}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;