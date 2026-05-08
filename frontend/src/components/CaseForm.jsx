import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Image as ImageIcon, 
  FileText, 
  Calendar, 
  MapPin, 
  ChevronDown,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { caseService } from '../services';

const CaseForm = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'media',
    estado: 'abierto',
    ubicacion: '',
    detective_asignado: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        prioridad: 'media',
        estado: 'abierto',
        ubicacion: '',
        detective_asignado: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (initialData?.id) {
        await caseService.update(initialData.id, formData);
      } else {
        await caseService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : (detail || 'Error al procesar el caso'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-fbi-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl glass-panel rounded-2xl border border-fbi-blue/20 shadow-neon-blue relative z-10 overflow-hidden"
          >
            {/* Scanline decoration */}
            <div className="scan-line opacity-10" />
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-fbi-blue/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fbi-blue/10 rounded border border-fbi-blue/30 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-fbi-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                    {initialData ? 'Actualizar Expediente' : 'Apertura de Caso'}
                  </h2>
                  <p className="text-[10px] text-fbi-blue/60 uppercase tracking-tighter">[ PROTOCOLO DE INVESTIGACIÓN ]</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Título del Informe</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 transition-all"
                    placeholder="Ej: Operación Sombra Nocturna"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Prioridad Operativa</label>
                    <select
                      value={formData.prioridad}
                      onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 appearance-none cursor-pointer"
                    >
                      <option value="baja">BAJA</option>
                      <option value="media">MEDIA</option>
                      <option value="alta">ALTA</option>
                      <option value="critica">CRÍTICA</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Ubicación de los Hechos</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-blue/50" />
                      <input
                        type="text"
                        value={formData.ubicacion}
                        onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                        className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                        placeholder="Distrito / Coordenadas"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Detective Encargado</label>
                  <input
                    type="text"
                    value={formData.detective_asignado}
                    onChange={(e) => setFormData({...formData, detective_asignado: e.target.value})}
                    className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                    placeholder="Nombre del Agente"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Narrativa de la Investigación</label>
                  <textarea
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 resize-none italic"
                    placeholder="Describa los hallazgos iniciales..."
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
                  onClick={onClose}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all border border-white/5"
                >
                  Abortar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all hover:shadow-neon-blue active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? 'Transmitiendo Datos...' : (initialData ? 'Actualizar Archivo' : 'Registrar en la Red')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CaseForm;
