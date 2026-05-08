import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  AlertTriangle, 
  FileText,
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Plus
} from 'lucide-react';
import { caseService } from '../services';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [suspects, setSuspects] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detail, susp, time, evid] = await Promise.all([
          caseService.getOne(id),
          caseService.getSuspects(id),
          caseService.getTimeline(id),
          caseService.getEvidence(id)
        ]);
        setCaseData(detail);
        setSuspects(susp);
        setTimeline(time);
        setEvidence(evid);
      } catch (err) {
        console.error("Error fetching case details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-fbi-blue animate-pulse uppercase tracking-[0.2em]">Accediendo a Archivos...</div>
    </div>
  );

  if (!caseData) return <div className="text-white">Caso no encontrado.</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/cases')}
            className="flex items-center gap-2 text-fbi-blue hover:text-white transition-colors text-[10px] uppercase tracking-widest mb-4"
          >
            <ArrowLeft className="w-3 h-3" /> Volver al Archivo
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">{caseData.titulo}</h1>
            <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">ID: {caseData.id}</span>
          </div>
          <p className="text-fbi-blue/60 text-xs uppercase tracking-tighter">[ EXPEDIENTE CLASIFICADO ]</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue px-6 py-2 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all">
            Editar Registro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Description */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-panel p-8 rounded-xl border border-white/5 space-y-6 relative overflow-hidden">
            <div className="scan-line opacity-20" />
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <FileText className="w-5 h-5 text-fbi-blue" />
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">Resumen del Informe</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Estado</span>
                <p className="text-sm font-bold text-fbi-blue uppercase">{caseData.estado?.replace('_', ' ')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Prioridad</span>
                <p className={`text-sm font-bold uppercase ${caseData.prioridad === 'critica' ? 'text-fbi-red' : 'text-orange-400'}`}>
                  {caseData.prioridad}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Fecha Apertura</span>
                <p className="text-sm font-bold text-gray-200">{new Date(caseData.fecha).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Ubicación</span>
                <p className="text-sm font-bold text-gray-200">{caseData.ubicacion || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Detalles Narrativos</span>
              <p className="text-gray-400 text-sm leading-relaxed italic bg-fbi-black/30 p-4 rounded border border-white/5">
                "{caseData.descripcion || 'No se han registrado detalles narrativos para este caso.'}"
              </p>
            </div>
          </section>

          {/* Evidence Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-fbi-blue" />
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">Evidencias Colectadas</h2>
              </div>
              <button className="text-[10px] text-fbi-blue hover:underline uppercase tracking-widest flex items-center gap-1">
                <Plus className="w-3 h-3" /> Añadir Evidencia
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {evidence.length === 0 ? (
                <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-600 text-xs uppercase tracking-widest">Sin evidencias físicas registradas</p>
                </div>
              ) : (
                evidence.map((e) => (
                  <div key={e.id} className="glass-card group relative aspect-video rounded-lg overflow-hidden border border-white/5">
                    <img src={e.imagen} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-fbi-black to-transparent opacity-60" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-[10px] font-bold text-white uppercase truncate">{e.nombre}</p>
                      <p className="text-[8px] text-fbi-blue uppercase">{e.tipo}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Suspects & Timeline */}
        <div className="space-y-8">
          {/* Suspects */}
          <section className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Users className="w-4 h-4 text-fbi-red" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Sujetos de Interés</h2>
            </div>
            <div className="space-y-3">
              {suspects.length === 0 ? (
                <p className="text-[10px] text-gray-600 uppercase text-center py-4">No hay sospechosos vinculados</p>
              ) : (
                suspects.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-all cursor-pointer border border-transparent hover:border-white/5">
                    <div className="w-10 h-10 bg-fbi-dark rounded border border-fbi-red/30 overflow-hidden">
                      {s.foto ? <img src={s.foto} className="w-full h-full object-cover grayscale" /> : <UserIcon className="w-full h-full p-2 text-gray-700" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white uppercase">{s.nombre}</p>
                      <p className="text-[8px] text-fbi-red uppercase tracking-widest">Nivel: {s.nivel_peligro}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Timeline */}
          <section className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Clock className="w-4 h-4 text-fbi-blue" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Línea de Tiempo</h2>
            </div>
            <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[1px] before:bg-fbi-blue/20">
              {timeline.length === 0 ? (
                <p className="text-[10px] text-gray-600 uppercase text-center py-4">Sin eventos registrados</p>
              ) : (
                timeline.map((event, idx) => (
                  <div key={event.id} className="relative pl-8">
                    <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full bg-fbi-black border border-fbi-blue flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-fbi-blue shadow-neon-blue" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-fbi-blue uppercase">{event.tipo}</span>
                        <span className="text-[8px] font-mono text-gray-500">{new Date(event.fecha).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-tight">{event.descripcion}</p>
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

export default CaseDetail;
