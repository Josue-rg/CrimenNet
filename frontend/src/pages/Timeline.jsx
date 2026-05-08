import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  MapPin,
  User,
  AlertTriangle,
  Search,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  ArrowRight
} from 'lucide-react';
import { caseService, timelineService } from '../services';

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    caso_id: '',
    tipo: 'hallazgo',
    fecha: '',
    descripcion: '',
    ubicacion: ''
  });

  // Sync caso_id with selectedCase
  useEffect(() => {
    if (selectedCase) {
      setNewEvent(prev => ({ ...prev, caso_id: selectedCase }));
    }
  }, [selectedCase]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const casesData = await caseService.getAll();
        setCases(casesData);
        if (casesData.length > 0) {
          setSelectedCase(casesData[0].id);
          const timelineData = await timelineService.getByCase(casesData[0].id);
          setEvents(timelineData);
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
      const data = await timelineService.getByCase(caseId);
      setEvents(data);
    } catch (err) {
      console.error("Error fetching timeline:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean data: convert empty strings to null, keep valid values
      const dataToSend = {
        caso_id: newEvent.caso_id || null,
        tipo: newEvent.tipo,
        fecha: newEvent.fecha || null,
        descripcion: newEvent.descripcion || null,
        ubicacion: newEvent.ubicacion || null
      };

      await timelineService.create(dataToSend);
      // Refresh timeline
      const data = await timelineService.getByCase(selectedCase);
      setEvents(data);
      setIsAddModalOpen(false);
      // Reset form
      setNewEvent({
        caso_id: selectedCase,
        tipo: 'hallazgo',
        fecha: '',
        descripcion: '',
        ubicacion: ''
      });
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'crimen': return <AlertTriangle className="w-4 h-4 text-fbi-red" />;
      case 'hallazgo': return <Search className="w-4 h-4 text-fbi-blue" />;
      case 'interrogatorio': return <User className="w-4 h-4 text-orange-400" />;
      case 'movimiento': return <MapPin className="w-4 h-4 text-green-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'crimen': return 'border-fbi-red bg-fbi-red/10 text-fbi-red';
      case 'hallazgo': return 'border-fbi-blue bg-fbi-blue/10 text-fbi-blue';
      case 'interrogatorio': return 'border-orange-400 bg-orange-400/10 text-orange-400';
      case 'movimiento': return 'border-green-400 bg-green-400/10 text-green-400';
      default: return 'border-gray-400 bg-gray-400/10 text-gray-400';
    }
  };

  const sortedEvents = [...events].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Línea de Tiempo</h1>
          <p className="text-fbi-blue/60 text-xs mt-1 uppercase tracking-tighter">[ Cronología de Eventos del Caso ]</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue px-6 py-2.5 rounded-lg uppercase tracking-widest text-xs font-bold transition-all hover:shadow-neon-blue"
        >
          <Plus className="w-4 h-4" />
          Registrar Evento
        </button>
      </div>

      {/* Case Selector */}
      <div className="glass-panel p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-fbi-blue" />
          <select
            value={selectedCase}
            onChange={(e) => handleCaseChange(e.target.value)}
            className="flex-1 bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-fbi-blue/30 transition-all uppercase tracking-widest text-sm appearance-none cursor-pointer"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>{c.titulo}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-fbi-blue animate-pulse uppercase tracking-[0.2em]">Cargando Cronología...</div>
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="glass-panel p-20 rounded-xl border border-white/5 text-center">
          <Clock className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 uppercase tracking-widest text-sm">No hay eventos registrados en este caso</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-fbi-red via-fbi-blue to-transparent opacity-30" />

          <div className="space-y-8 pl-20">
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-52px] top-0 w-[22px] h-[22px] rounded-full bg-fbi-black border-2 border-fbi-blue flex items-center justify-center z-10 shadow-neon-blue">
                  <div className="w-2 h-2 rounded-full bg-fbi-blue animate-pulse" />
                </div>

                {/* Event Card */}
                <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-fbi-blue/30 transition-all">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Date Column */}
                    <div className="md:w-32 flex-shrink-0">
                      <div className="text-fbi-blue font-mono text-xs uppercase tracking-widest">
                        {new Date(event.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">
                        {new Date(event.fecha).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getEventTypeColor(event.tipo)} flex items-center gap-2`}>
                          {getEventTypeIcon(event.tipo)}
                          {event.tipo}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                        {event.descripcion}
                      </h3>

                      {event.ubicacion && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                          <MapPin className="w-3 h-3" />
                          <span className="uppercase tracking-widest">{event.ubicacion}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="flex md:flex-col gap-2">
                      <button className="p-2 bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/30 rounded-lg text-fbi-blue transition-all">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsAddModalOpen(false)}
            className="absolute inset-0 bg-fbi-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl glass-panel rounded-2xl border border-fbi-blue/20 shadow-neon-blue relative z-10 overflow-hidden"
          >
            <div className="scan-line opacity-10" />

            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-fbi-blue/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fbi-blue/10 rounded border border-fbi-blue/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-fbi-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                    Registrar Evento
                  </h2>
                  <p className="text-[10px] text-fbi-blue/60 uppercase tracking-tighter">[ ACTUALIZACIÓN DE CRONOLOGÍA ]</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Caso</label>
                  <select
                    value={newEvent.caso_id}
                    onChange={(e) => setNewEvent({ ...newEvent, caso_id: e.target.value })}
                    className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 appearance-none cursor-pointer"
                  >
                    <option value="">Seleccione un caso</option>
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>{c.titulo}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Tipo de Evento</label>
                    <select
                      value={newEvent.tipo}
                      onChange={(e) => setNewEvent({ ...newEvent, tipo: e.target.value })}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 appearance-none cursor-pointer"
                    >
                      <option value="crimen">CRIMEN</option>
                      <option value="hallazgo">HALLAZGO</option>
                      <option value="interrogatorio">INTERROGATORIO</option>
                      <option value="movimiento">MOVIMIENTO</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Fecha y Hora</label>
                    <input
                      type="datetime-local"
                      value={newEvent.fecha}
                      onChange={(e) => setNewEvent({ ...newEvent, fecha: e.target.value })}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Descripción del Evento</label>
                  <textarea
                    rows={3}
                    value={newEvent.descripcion}
                    onChange={(e) => setNewEvent({ ...newEvent, descripcion: e.target.value })}
                    className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 resize-none"
                    placeholder="Describa detalladamente el evento..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1 font-bold">Ubicación</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-blue/50" />
                    <input
                      type="text"
                      value={newEvent.ubicacion}
                      onChange={(e) => setNewEvent({ ...newEvent, ubicacion: e.target.value })}
                      className="w-full bg-fbi-dark/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                      placeholder="Dirección o coordenadas"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all border border-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue py-3 rounded-lg uppercase tracking-widest text-[10px] font-bold transition-all hover:shadow-neon-blue active:scale-[0.98]"
                >
                  Registrar Evento
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
