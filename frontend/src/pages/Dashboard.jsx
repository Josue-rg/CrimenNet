import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Activity,
  FileText
} from 'lucide-react';
import { caseService, suspectService } from '../services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCases: 0,
    activeSuspects: 0,
    totalEvidence: 0,
    urgentCases: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cases, suspects] = await Promise.all([
          caseService.getAll(),
          suspectService.getAll()
        ]);
        
        setStats({
          totalCases: cases.length,
          activeSuspects: suspects.filter(s => s.estado === 'buscado').length,
          totalEvidence: 0, // Implementar en el futuro
          urgentCases: cases.filter(c => c.prioridad === 'critica' || c.prioridad === 'alta').length
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Investigaciones', value: stats.totalCases, icon: Briefcase, color: 'text-fbi-blue' },
    { label: 'Sospechosos Activos', value: stats.activeSuspects, icon: Users, color: 'text-orange-400' },
    { label: 'Evidencias Registradas', value: stats.totalEvidence, icon: Search, color: 'text-green-400' },
    { label: 'Casos Prioritarios', value: stats.urgentCases, icon: AlertTriangle, color: 'text-fbi-red' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Resumen Operativo</h1>
          <p className="text-fbi-blue/60 text-xs mt-1 uppercase tracking-tighter">[ ACCESO NIVEL 4 CONCEDIDO ]</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase font-mono">Última Actualización</p>
          <p className="text-sm text-gray-300 font-mono">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-[10px] uppercase tracking-widest text-gray-400">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold text-white font-mono">
                {isLoading ? '---' : stat.value}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-green-400 uppercase tracking-tighter">
                <TrendingUp className="w-3 h-3" />
                <span>+12% vs mes anterior</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-fbi-blue" />
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">Actividad Reciente</h2>
            </div>
            <button className="text-[10px] text-fbi-blue hover:underline uppercase tracking-widest">Ver Todo el Log</button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all">
                <div className="mt-1 p-2 rounded bg-fbi-blue/10 border border-fbi-blue/20">
                  <FileText className="w-4 h-4 text-fbi-blue" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-bold text-gray-200 uppercase">Nuevo Informe de Evidencia</h3>
                    <span className="text-[10px] text-gray-500 font-mono">14:2{i} HS</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Se ha registrado un nuevo hallazgo de ADN en el Caso #8821. Detective asignado: R. Miller.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="glass-panel rounded-xl p-6 border border-white/5 space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-fbi-red" />
            <h2 className="text-lg font-bold text-white uppercase tracking-widest text-fbi-red">Alertas del Sistema</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-fbi-red/10 border border-fbi-red/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-fbi-red uppercase tracking-widest">Prioridad Crítica</span>
                <Clock className="w-3 h-3 text-fbi-red" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase">Sospechoso Avistado</h3>
              <p className="text-[10px] text-gray-400">Objetivo "V. Volkov" detectado en sector norte. Proceder con precaución.</p>
            </div>

            <div className="p-4 bg-orange-900/10 border border-orange-500/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Advertencia</span>
              </div>
              <h3 className="text-xs font-bold text-white uppercase">Caso Expirando</h3>
              <p className="text-[10px] text-gray-400">El Caso #712 requiere actualización de estado en menos de 24hs.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-relaxed">
              Todos los datos están encriptados bajo protocolo AES-256.<br/>
              Uso exclusivo para personal autorizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
