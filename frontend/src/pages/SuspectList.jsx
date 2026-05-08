import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  UserX,
  Skull,
  ShieldAlert,
  Eye,
  MoreVertical,
  MapPin
} from 'lucide-react';
import { suspectService } from '../services';
import SuspectForm from '../components/SuspectForm';

const SuspectList = () => {
  const navigate = useNavigate();
  const [suspects, setSuspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        const data = await suspectService.getAll();
        setSuspects(data);
      } catch (err) {
        console.error("Error fetching suspects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuspects();
  }, []);

  const handleFormSuccess = () => {
    const fetchSuspects = async () => {
      try {
        const data = await suspectService.getAll();
        setSuspects(data);
      } catch (err) {
        console.error("Error fetching suspects:", err);
      }
    };
    fetchSuspects();
  };

  const getDangerLevelColor = (level) => {
    switch (level) {
      case 'extremo': return 'text-fbi-red bg-fbi-red/10 border-fbi-red/30 shadow-[0_0_10px_rgba(139,0,0,0.3)]';
      case 'alto': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medio': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-green-500 bg-green-500/10 border-green-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'buscado': return <ShieldAlert className="w-4 h-4 text-fbi-red animate-pulse" />;
      case 'capturado': return <UserX className="w-4 h-4 text-fbi-blue" />;
      case 'fallecido': return <Skull className="w-4 h-4 text-gray-500" />;
      default: return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredSuspects = suspects.filter(s =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Base de Sospechosos</h1>
          <p className="text-fbi-blue/60 text-xs mt-1 uppercase tracking-tighter">[ Archivos de Identificación Criminal ]</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-fbi-red/10 hover:bg-fbi-red/20 border border-fbi-red/50 text-fbi-red px-6 py-2.5 rounded-lg uppercase tracking-widest text-xs font-bold transition-all hover:shadow-neon-red"
        >
          <Plus className="w-4 h-4" />
          Registrar Objetivo
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Escriba el nombre del sospechoso o alias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-fbi-dark/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fbi-blue/30 transition-all placeholder:text-gray-600 uppercase tracking-widest text-sm"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card aspect-[3/4] rounded-xl border border-white/5 animate-pulse" />
          ))
        ) : filteredSuspects.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-xl">
            <UserX className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 uppercase tracking-widest text-sm">No se encontraron objetivos con ese identificador</p>
          </div>
        ) : (
          filteredSuspects.map((s, index) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card group rounded-xl border border-white/5 overflow-hidden flex flex-col relative"
            >
              {/* Image Section */}
              <div className="aspect-square relative overflow-hidden bg-fbi-dark">
                {s.foto ? (
                  <img
                    src={s.foto}
                    alt={s.nombre}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-white/5" />
                  </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-fbi-black via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border ${getDangerLevelColor(s.nivel_peligro)}`}>
                    PELIGRO {s.nivel_peligro}
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-fbi-blue uppercase tracking-widest font-bold">Estado</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(s.estado)}
                      <span className="text-xs text-white uppercase font-bold tracking-tight">{s.estado}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tighter group-hover:text-fbi-blue transition-colors">
                    {s.nombre}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Edad: {s.edad || '??'} Años</span>
                    <span className="text-gray-700">•</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">ID: {s.id.slice(0, 6)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => navigate(`/suspects/${s.id}`)}
                    className="flex-1 bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/30 text-fbi-blue py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Ver Perfil
                  </button>
                  <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scan effect on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="scan-line" style={{ animationDuration: '2s' }} />
              </div>
            </motion.div>
          ))
        )}
      </div>

      <SuspectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default SuspectList;
