import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Image as ImageIcon,
  FileText,
  Upload,
  Plus,
  X,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { evidenceService, caseService } from '../services';

const EvidenceList = () => {
  const [evidence, setEvidence] = useState([]);
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    case_id: '',
    nombre: '',
    tipo: 'foto',
    descripcion: '',
    archivo: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Sync case_id with selectedCase
  useEffect(() => {
    if (selectedCase) {
      setUploadData(prev => ({ ...prev, case_id: selectedCase }));
    }
  }, [selectedCase]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const casesData = await caseService.getAll();
        setCases(casesData);
        if (casesData.length > 0) {
          setSelectedCase(casesData[0].id);
          const evidenceData = await evidenceService.getByCase(casesData[0].id);
          setEvidence(evidenceData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCaseChange = async (caseId) => {
    setSelectedCase(caseId);
    try {
      const data = await evidenceService.getByCase(caseId);
      setEvidence(data);
    } catch (err) {
      console.error("Error fetching evidence:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData({ ...uploadData, archivo: file });
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');

    try {
      // Upload file if provided (optional)
      let imageUrl = '';
      if (uploadData.archivo) {
        try {
          const uploadResult = await evidenceService.upload(uploadData.archivo);
          imageUrl = uploadResult.url || uploadResult.file_url || '';
        } catch (uploadErr) {
          console.warn('File upload failed, creating evidence without image:', uploadErr);
          // Continue without image if upload fails
        }
      }

      // Create the evidence record (imagen is optional)
      const evidenceData = {
        caso_id: uploadData.case_id,
        nombre: uploadData.nombre,
        tipo: uploadData.tipo,
        descripcion: uploadData.descripcion || null,
        imagen: imageUrl || null,
        ubicacion: null
      };

      await evidenceService.create(evidenceData);

      // Refresh evidence list
      const evidenceList = await evidenceService.getByCase(selectedCase);
      setEvidence(evidenceList);

      setIsUploadModalOpen(false);
      setUploadData({
        case_id: selectedCase,
        nombre: '',
        tipo: 'foto',
        descripcion: '',
        archivo: null
      });
      setPreviewImage(null);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : (detail || 'Error al crear evidencia'));
    } finally {
      setIsUploading(false);
    }
  };

  const filteredEvidence = evidence.filter(e =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Gestión de Evidencias</h1>
          <p className="text-fbi-blue/60 text-xs mt-1 uppercase tracking-tighter">[ Archivo de Pruebas Forenses ]</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue px-6 py-2.5 rounded-lg uppercase tracking-widest text-xs font-bold transition-all hover:shadow-neon-blue"
        >
          <Upload className="w-4 h-4" />
          Subir Evidencia
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar evidencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-fbi-dark/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fbi-blue/30 transition-all placeholder:text-gray-600 uppercase tracking-widest text-sm"
          />
        </div>
        <select
          value={selectedCase}
          onChange={(e) => handleCaseChange(e.target.value)}
          className="w-full bg-fbi-dark/50 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-fbi-blue/30 transition-all uppercase tracking-widest text-sm appearance-none cursor-pointer"
        >
          {cases.map(c => (
            <option key={c.id} value={c.id}>{c.titulo}</option>
          ))}
        </select>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="glass-card aspect-square rounded-xl border border-white/5 animate-pulse" />
          ))
        ) : filteredEvidence.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-xl">
            <ImageIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 uppercase tracking-widest text-sm">No se encontraron evidencias</p>
          </div>
        ) : (
          filteredEvidence.map((e, index) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card group rounded-xl border border-white/5 overflow-hidden relative"
            >
              <div className="aspect-square relative overflow-hidden bg-fbi-dark">
                {e.imagen ? (
                  <img
                    src={e.imagen}
                    alt={e.nombre}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white/5" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-fbi-black via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3">
                  <div className="px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border border-fbi-blue/30 bg-fbi-blue/10 text-fbi-blue">
                    {e.tipo}
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs font-bold text-white uppercase truncate">{e.nombre}</p>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-fbi-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <button className="p-2 bg-fbi-blue/20 hover:bg-fbi-blue/30 border border-fbi-blue/50 rounded-lg text-fbi-blue transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-fbi-red/10 hover:bg-fbi-red/20 border border-fbi-red/50 rounded-lg text-fbi-red transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
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
                    <Upload className="w-5 h-5 text-fbi-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                      Subir Evidencia
                    </h2>
                    <p className="text-[10px] text-fbi-blue/60 uppercase tracking-tighter">[ PROTOCOLO DE CADENA DE CUSTODIA ]</p>
                  </div>
                </div>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Caso Relacionado</label>
                    <select
                      value={uploadData.case_id}
                      onChange={(e) => setUploadData({ ...uploadData, case_id: e.target.value })}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Seleccione un caso</option>
                      {cases.map(c => (
                        <option key={c.id} value={c.id}>{c.titulo}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Nombre *</label>
                    <input
                      type="text"
                      value={uploadData.nombre}
                      onChange={(e) => setUploadData({ ...uploadData, nombre: e.target.value })}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                      placeholder="Nombre de la evidencia"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Tipo</label>
                      <select
                        value={uploadData.tipo}
                        onChange={(e) => setUploadData({ ...uploadData, tipo: e.target.value })}
                        className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 appearance-none cursor-pointer"
                      >
                        <option value="foto">FOTOGRAFÍA</option>
                        <option value="video">VIDEO</option>
                        <option value="documento">DOCUMENTO</option>
                        <option value="arma">ARMA</option>
                        <option value="huella">HUELLA</option>
                        <option value="adn">ADN</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Archivo (Opcional)</label>
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-fbi-blue/30 transition-all">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept="image/*"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <Upload className="w-8 h-8 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-400">Click para subir archivo (opcional)</p>
                          <p className="text-xs text-gray-600">PNG, JPG hasta 10MB</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Descripción (Opcional)</label>
                    <textarea
                      rows={3}
                      value={uploadData.descripcion}
                      onChange={(e) => setUploadData({ ...uploadData, descripcion: e.target.value })}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 resize-none"
                      placeholder="Descripción de la evidencia"
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
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all border border-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-[2] bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all hover:shadow-neon-blue active:scale-[0.98] disabled:opacity-50"
                  >
                    {isUploading ? 'Creando...' : 'Crear Evidencia'}
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

export default EvidenceList;
