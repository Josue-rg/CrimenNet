import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        // Para errores de validación de FastAPI (422)
        setError(detail[0]?.msg || 'Error de validación');
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fbi-black cyber-bg relative overflow-hidden">
      {/* Línea de escaneo decorativa */}
      <div className="scan-line" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glass-panel rounded-2xl border-fbi-blue/20 shadow-neon-blue relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-fbi-blue/10 rounded-full flex items-center justify-center mb-4 border border-fbi-blue/30">
            <Shield className="w-8 h-8 text-fbi-blue shadow-glow" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
            Crimen<span className="text-fbi-blue">Net</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 tracking-tighter uppercase">
            [ Sistema de Acceso Restringido ]
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Identificador</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-blue/50" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-fbi-dark/50 border border-fbi-blue/20 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-fbi-blue/50 focus:ring-1 focus:ring-fbi-blue/20 transition-all"
                placeholder="ID de Detective"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Clave de Encriptación</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-blue/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-fbi-dark/50 border border-fbi-blue/20 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-fbi-blue/50 focus:ring-1 focus:ring-fbi-blue/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue font-bold py-3 rounded-lg uppercase tracking-widest transition-all hover:shadow-neon-blue active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Verificando...' : 'Acceder al Sistema'}
          </button>
        </form>

          <div className="mt-8 pt-6 border-t border-fbi-blue/10 text-center space-y-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            ¿No tiene credenciales? <Link to="/register" className="text-fbi-blue hover:underline">Registrar Agente</Link>
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
            La actividad está siendo monitoreada por la unidad central
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
