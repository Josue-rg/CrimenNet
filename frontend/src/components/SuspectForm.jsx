import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShieldAlert, 
  Image as ImageIcon, 
  FileText, 
  Calendar, 
  MapPin, 
  X,
  CheckCircle,
  AlertTriangle,
  Upload,
  Skull
} from 'lucide-react';
import { suspectService } from '../services';

const SuspectForm = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    estado: 'buscado',
    nivel_peligro: 'medio',
    descripcion: '',
    foto: '',
    alias: '',
    ultima_ubicacion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.foto) {
        setPhotoPreview(initialData.foto);
      }
    } else {
      setFormData({
        nombre: '',
        edad: '',
        estado: 'buscado',
        nivel_peligro: 'medio',
        descripcion: '',
        foto: '',
        alias: '',
        ultima_ubicacion: ''
      });
      setPhotoPreview(null);
    }
  }, [initialData, isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (initialData?.id) {
        await suspectService.update(initialData.id, formData);
      } else {
        await suspectService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : (detail || 'Error al procesar el sospechoso'));
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
            className="w-full max-w-2xl glass-panel rounded-2xl border border-fbi-red/20 shadow-neon-red relative z-10 overflow-hidden"
          >
            {/* Scanline decoration */}
            <div className="scan-line opacity-10" />
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-fbi-red/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fbi-red/10 rounded border border-fbi-red/30 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-fbi-red" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                    {initialData ? 'Actualizar Perfil' : 'Registro de Sospechoso'}
                  </h2>
                  <p className="text-[10px] text-fbi-red/60 uppercase tracking-tighter">[ BASE DE DATOS DE SUJETOS ]</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Fotografía del Sujeto</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-40 bg-fbi-dark/50 border-2 border-dashed border-white/10 rounded-lg overflow-hidden relative group">
                      {photoPreview ? (
                        <img src={photoPreview} className="w-full h-full object-cover grayscale" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-700" />
                        </div>
                      )}
                      <div className="scan-line opacity-30" />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <div className="bg-fbi-red/10 hover:bg-fbi-red/20 border border-fbi-red/50 text-fbi-red px-4 py-2 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Cargar Imagen
                        </div>
                      </label>
                      <p className="text-[8px] text-gray-500 mt-2 uppercase tracking-wider">Formatos: JPG, PNG, WEBP</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-red/50 transition-all"
                    placeholder="Nombre y Apellido"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Alias Conocido</label>
                    <input
                      type="text"
                      value={formData.alias}
                      onChange={(e) => setFormData({...formData, alias: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-red/50 transition-all"
                      placeholder="Apodos o sobrenombres"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Edad Aproximada</label>
                    <input
                      type="number"
                      value={formData.edad}
                      onChange={(e) => setFormData({...formData, edad: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-red/50 transition-all"
                      placeholder="25"
                      min="0"
                      max="120"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Nivel de Peligro</label>
                    <select
                      value={formData.nivel_peligro}
                      onChange={(e) => setFormData({...formData, nivel_peligro: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-red/50 appearance-none cursor-pointer"
                    >
                      <option value="bajo">BAJO</option>
                      <option value="medio">MEDIO</option>
                      <option value="alto">ALTO</option>
                      <option value="extremo">EXTREMO</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Estado Actual</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-red/50 appearance-none cursor-pointer"
                    >
                      <option value="buscado">BUSCADO</option>
                      <option value="en_investigacion">EN INVESTIGACIÓN</option>
                      <option value="detenido">DETENIDO</option>
                      <option value="liberado">LIBERADO</option>
                      <option value="fallecido">FALLECIDO</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Última Ubicación Conocida</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-red/50" />
                    <input
                      type="text"
                      value={formData.ultima_ubicacion}
                      onChange={(e) => setFormData({...formData, ultima_ubicacion: e.target.value})}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fbi-red/50"
                      placeholder="Ciudad, Barrio o Coordenadas"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Perfil y Antecedentes</label>
                  <textarea
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-red/50 resize-none italic"
                    placeholder="Describa el perfil psicológico, modus operandi, antecedentes penales..."
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
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] bg-fbi-red/10 hover:bg-fbi-red/20 border border-fbi-red/50 text-fbi-red py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all hover:shadow-neon-red active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? 'Procesando...' : (initialData ? 'Actualizar Registro' : 'Registrar Sospechoso')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuspectForm;
