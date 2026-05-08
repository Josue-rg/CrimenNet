import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  FileText, 
  X,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { interrogationService, suspectService } from '../services';

const InterrogationList = () => {
  const [interrogations, setInterrogations] = useState([]);
  const [suspects, setSuspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterrogation, setEditingInterrogation] = useState(null);
  const [formData, setFormData] = useState({
    suspect_id: '',
    detective: '',
    fecha: '',
    resultado: 'pendiente',
    transcripcion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interrogationsData, suspectsData] = await Promise.all([
          interrogationService.getAll(),
          suspectService.getAll()
        ]);
        setInterrogations(interrogationsData);
        setSuspects(suspectsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSuspectFilter = async (suspectId) => {
    setSelectedSuspect(suspectId);
    if (suspectId) {
      try {
        const data = await interrogationService.getBySuspect(suspectId);
        setInterrogations(data);
      } catch (err) {
        console.error("Error filtering interrogations:", err);
      }
    } else {
      try {
        const data = await interrogationService.getAll();
        setInterrogations(data);
      } catch (err) {
        console.error("Error fetching interrogations:", err);
      }
    }
  };

  const handleOpenModal = (interrogation = null) => {
    if (interrogation) {
      setEditingInterrogation(interrogation);
      setFormData({
        suspect_id: interrogation.suspect_id,
        detective: interrogation.detective,
        fecha: interrogation.fecha,
        resultado: interrogation.resultado,
        transcripcion: interrogation.transcripcion
      });
    } else {
      setEditingInterrogation(null);
      setFormData({
        suspect_id: '',
        detective: '',
        fecha: new Date().toISOString().slice(0, 16),
        resultado: 'pendiente',
        transcripcion: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (editingInterrogation) {
        await interrogationService.update(editingInterrogation.id, formData);
      } else {
        await interrogationService.create(formData);
      }
      
      // Refresh list
      const data = selectedSuspect 
        ? await interrogationService.getBySuspect(selectedSuspect)
        : await interrogationService.getAll();
      setInterrogations(data);
      
      setIsModalOpen(false);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : (detail || 'Error al procesar interrogatorio'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este registro de interrogatorio?')) return;
    
    try {
      await interrogationService.delete(id);
      const data = selectedSuspect 
        ? await interrogationService.getBySuspect(selectedSuspect)
        : await interrogationService.getAll();
      setInterrogations(data);
    } catch (err) {
      console.error("Error deleting interrogation:", err);
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'confeso': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'negado': return 'text-fbi-red border-fbi-red/30 bg-fbi-red/10';
      case 'inconcluso': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const filteredInterrogations = interrogations.filter(i => 
    i.detective.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.transcripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Gestión de Interrogatorios</h1>
          <p className="text-fbi-blue/60 text-xs mt-1 uppercase tracking-tighter">[ Registros de Entrevistas ]</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue px-6 py-2.5 rounded-lg uppercase tracking-widest text-xs font-bold transition-all hover:shadow-neon-blue"
        >
          <Plus className="w-4 h-4" />
          Nuevo Interrogatorio
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar interrogatorio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-fbi-dark/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fbi-blue/30 transition-all placeholder:text-gray-600 uppercase tracking-widest text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={selectedSuspect}
            onChange={(e) => handleSuspectFilter(e.target.value)}
            className="w-full bg-fbi-dark/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fbi-blue/30 transition-all uppercase tracking-widest text-sm appearance-none cursor-pointer"
          >
            <option value="">Todos los sospechosos</option>
            {suspects.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interrogations List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 animate-pulse" />
          ))
        ) : filteredInterrogations.length === 0 ? (
          <div className="glass-panel p-20 rounded-xl border border-white/5 text-center">
            <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 uppercase tracking-widest text-sm">No hay interrogatorios registrados</p>
          </div>
        ) : (
          filteredInterrogations.map((interrogation, index) => (
            <motion.div
              key={interrogation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-6 rounded-xl border border-white/5 hover:border-fbi-blue/30 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Date Column */}
                <div className="md:w-32 flex-shrink-0">
                  <div className="flex items-center gap-2 text-fbi-blue font-mono text-xs uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    {new Date(interrogation.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 ml-6">
                    {new Date(interrogation.fecha).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getResultColor(interrogation.resultado)}`}>
                      {interrogation.resultado}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <User className="w-3 h-3" />
                      <span className="uppercase tracking-widest">Det. {interrogation.detective}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic">
                    {interrogation.transcripcion}
                  </p>
                </div>

                {/* Actions Column */}
                <div className="flex md:flex-col gap-2">
                  <button 
                    onClick={() => handleOpenModal(interrogation)}
                    className="p-2 bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/30 rounded-lg text-fbi-blue transition-all"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(interrogation.id)}
                    className="p-2 bg-fbi-red/10 hover:bg-fbi-red/20 border border-fbi-red/30 rounded-lg text-fbi-red transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-fbi-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl glass-panel rounded-2xl border border-fbi-blue/20 shadow-neon-blue relative z-10 overflow-hidden"
            >
              <div className="scan-line opacity-10" />
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-fbi-blue/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-fbi-blue/10 rounded border border-fbi-blue/30 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-fbi-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                      {editingInterrogation ? 'Editar Interrogatorio' : 'Nuevo Interrogatorio'}
                    </h2>
                    <p className="text-[10px] text-fbi-blue/60 uppercase tracking-tighter">[ REGISTRO DE ENTREVISTA ]</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Sospechoso</label>
                    <select
                      value={formData.suspect_id}
                      onChange={(e) => setFormData({...formData, suspect_id: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Seleccione un sospechoso</option>
                      {suspects.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Detective</label>
                      <input
                        type="text"
                        value={formData.detective}
                        onChange={(e) => setFormData({...formData, detective: e.target.value})}
                        className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                        placeholder="Nombre del detective"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Fecha y Hora</label>
                      <input
                        type="datetime-local"
                        value={formData.fecha}
                        onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                        className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Resultado</label>
                    <select
                      value={formData.resultado}
                      onChange={(e) => setFormData({...formData, resultado: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 appearance-none cursor-pointer"
                    >
                      <option value="pendiente">PENDIENTE</option>
                      <option value="confeso">CONFESO</option>
                      <option value="negado">NEGADO</option>
                      <option value="inconcluso">INCONCLUSO</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Transcripción</label>
                    <textarea
                      rows={8}
                      value={formData.transcripcion}
                      onChange={(e) => setFormData({...formData, transcripcion: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 resize-none font-mono italic"
                      placeholder="Transcriba el interrogatorio completo..."
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 p-4 rounded-lg border border-red-500/20">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all border border-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all hover:shadow-neon-blue active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Procesando...' : (editingInterrogation ? 'Actualizar Registro' : 'Registrar Interrogatorio')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterrogationList;
