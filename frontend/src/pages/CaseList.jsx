import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { caseService } from '../services';
import { Link, useNavigate } from 'react-router-dom';
import CaseForm from '../components/CaseForm';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const data = await caseService.getAll();
      setCases(data);
    } catch (err) {
      console.error("Error fetching cases:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critica': return 'text-fbi-red border-fbi-red/30 bg-fbi-red/10';
      case 'alta': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'media': return 'text-fbi-blue border-fbi-blue/30 bg-fbi-blue/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Archivo de Casos</h1>
          <p className="text-fbi-blue/60 text-xs mt-1 uppercase tracking-tighter">[ Base de Datos de Investigaciones Criminales ]</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue px-6 py-2.5 rounded-lg uppercase tracking-widest text-xs font-bold transition-all hover:shadow-neon-blue"
        >
          <Plus className="w-4 h-4" />
          Nuevo Caso
        </button>
      </div>

      <CaseForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCases} 
      />

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar por título, ID o detective..." 
            className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fbi-blue/30"
          />
        </div>
        <div className="flex gap-2">
          {['todos', 'abierto', 'en_investigacion', 'cerrado'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold border transition-all
                ${filter === f 
                  ? 'bg-fbi-blue/10 border-fbi-blue/50 text-fbi-blue shadow-neon-blue' 
                  : 'bg-transparent border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Casos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass-card h-64 rounded-xl border border-white/5 animate-pulse" />
          ))
        ) : cases.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-xl border-dashed border-white/10">
            <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 uppercase tracking-widest text-sm">No se encontraron registros en el archivo</p>
          </div>
        ) : (
          cases.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/cases/${c.id}`)}
              className="glass-card rounded-xl border border-white/5 flex flex-col group cursor-pointer overflow-hidden relative"
            >
              {/* Decoración Superior */}
              <div className={`h-1 w-full ${getPriorityColor(c.prioridad).split(' ')[0].replace('text-', 'bg-')}`} />
              
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border ${getPriorityColor(c.prioridad)}`}>
                    Prioridad {c.prioridad}
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">#{c.id.slice(0, 8)}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight line-clamp-1 group-hover:text-fbi-blue transition-colors">
                    {c.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">
                    "{c.descripcion || 'Sin descripción adicional registrada.'}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-3 h-3 text-fbi-blue/50" />
                    <span className="text-[10px] uppercase tracking-tighter">
                      {new Date(c.fecha).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-3 h-3 text-fbi-blue/50" />
                    <span className="text-[10px] uppercase tracking-tighter line-clamp-1">
                      {c.ubicacion || 'No especificada'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-fbi-blue/10 border border-fbi-blue/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-fbi-blue uppercase">
                      {c.detective_asignado?.[0] || 'D'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Det. {c.detective_asignado || 'Sin Asignar'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-fbi-blue group-hover:translate-x-1 transition-transform">
                  <span className="text-[9px] font-bold uppercase tracking-widest">Detalles</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CaseList;
