import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldAlert, 
  UserX, 
  Skull, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  MessageSquare,
  Activity,
  MoreVertical,
  Shield,
  MapPin
} from 'lucide-react';
import { suspectService } from '../services';

const SuspectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suspect, setSuspect] = useState(null);
  const [interrogations, setInterrogations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detail, interr] = await Promise.all([
          suspectService.getOne(id),
          suspectService.getInterrogations(id)
        ]);
        setSuspect(detail);
        setInterrogations(interr);
      } catch (err) {
        console.error("Error fetching suspect details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-fbi-red animate-pulse uppercase tracking-[0.2em]">Escaneando Base de Datos...</div>
    </div>
  );

  if (!suspect) return <div className="text-white">Sujeto no identificado en el archivo.</div>;

  const getDangerLevelColor = (level) => {
    switch (level) {
      case 'extremo': return 'text-fbi-red border-fbi-red/30 bg-fbi-red/10 shadow-neon-red';
      case 'alto': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'medio': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-green-500 border-green-500/30 bg-green-500/10';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/suspects')}
            className="flex items-center gap-2 text-fbi-red hover:text-white transition-colors text-[10px] uppercase tracking-widest mb-4"
          >
            <ArrowLeft className="w-3 h-3" /> Regresar a Base de Datos
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">{suspect.nombre}</h1>
            <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${getDangerLevelColor(suspect.nivel_peligro)}`}>
              Peligro {suspect.nivel_peligro}
            </span>
          </div>
          <p className="text-fbi-red/60 text-xs uppercase tracking-tighter">[ SUJETO DE INTERÉS PRIORITARIO ]</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-fbi-red/10 hover:bg-fbi-red/20 border border-fbi-red/50 text-fbi-red px-6 py-2 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all">
            Emitir Orden de Captura
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
            <div className="aspect-[3/4] relative bg-fbi-dark">
              {suspect.foto ? (
                <img src={suspect.foto} className="w-full h-full object-cover grayscale" />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10">
                  <Users className="w-20 h-16" />
                </div>
              )}
              <div className="scan-line" />
              <div className="absolute inset-0 border-[20px] border-fbi-black/20 pointer-events-none" />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Estado</span>
                <span className="text-xs text-white uppercase font-bold tracking-tight">{suspect.estado}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Edad</span>
                <span className="text-xs text-white uppercase font-bold tracking-tight">{suspect.edad || '??'} Años</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Identificador</span>
                <span className="text-xs text-fbi-blue font-mono font-bold tracking-tight">#{suspect.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3 text-fbi-blue" /> Actividad Reciente
            </h3>
            <div className="text-[10px] text-gray-400 leading-relaxed italic">
              "Sujeto visto por última vez en las cercanías del sector norte hace 48hs. Se presume que está armado."
            </div>
          </div>
        </div>

        {/* Details & Interrogations */}
        <div className="lg:col-span-3 space-y-8">
          <section className="glass-panel p-8 rounded-xl border border-white/5 space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <FileText className="w-5 h-5 text-fbi-red" />
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">Perfil Psicológico y Antecedentes</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap italic bg-fbi-black/30 p-6 rounded border border-white/5">
              {suspect.descripcion || 'No se han registrado antecedentes detallados para este sujeto en la base central.'}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-fbi-blue" />
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">Registros de Interrogatorios</h2>
            </div>
            
            <div className="space-y-4">
              {interrogations.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-600 text-xs uppercase tracking-widest">No existen registros de entrevistas previas</p>
                </div>
              ) : (
                interrogations.map((interr) => (
                  <div key={interr.id} className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Fecha: {new Date(interr.fecha).toLocaleDateString()}</span>
                        <span className="text-[10px] text-fbi-blue uppercase tracking-widest font-bold">Det. {interr.detective}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                        interr.resultado === 'confeso' ? 'text-green-500 border-green-500/30' : 'text-fbi-red border-fbi-red/30'
                      }`}>
                        Resultado: {interr.resultado}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 leading-relaxed font-mono bg-fbi-black/50 p-4 rounded border border-white/5 max-h-40 overflow-y-auto">
                      {interr.transcripcion}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SuspectDetail;
