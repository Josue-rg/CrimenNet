import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'detective'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : (detail || 'Error al registrar usuario'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fbi-black cyber-bg relative overflow-hidden p-4">
      <div className="scan-line" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-8 glass-panel rounded-2xl border-fbi-blue/20 shadow-neon-blue relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-fbi-blue/10 rounded-full flex items-center justify-center mb-4 border border-fbi-blue/30">
            <Shield className="w-6 h-6 text-fbi-blue" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase text-center">
            Registro de <span className="text-fbi-blue">Personal</span>
          </h1>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 space-y-4"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-xl text-white font-bold uppercase tracking-widest">Acceso Concedido</h2>
            <p className="text-gray-400">Su cuenta ha sido creada. Redirigiendo al terminal de acceso...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">Identificador</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-blue/50" />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-fbi-dark/50 border border-fbi-blue/20 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">Correo Seguro</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-blue/50" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-fbi-dark/50 border border-fbi-blue/20 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                  placeholder="agente@crimen.net"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">Rango / Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-fbi-dark/50 border border-fbi-blue/20 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50 appearance-none cursor-pointer"
              >
                <option value="detective">Detective de Campo</option>
                <option value="administrador">Administrador de Sistemas</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-blue/50" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-fbi-dark/50 border border-fbi-blue/20 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fbi-blue/50" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-fbi-dark/50 border border-fbi-blue/20 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fbi-blue/50"
                  placeholder="Repita la clave"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:col-span-2 flex items-center gap-2 text-red-400 text-xs bg-red-900/20 p-3 rounded-lg border border-red-500/20"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="md:col-span-2 space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-fbi-blue/10 hover:bg-fbi-blue/20 border border-fbi-blue/50 text-fbi-blue font-bold py-3 rounded-lg uppercase tracking-widest transition-all hover:shadow-neon-blue active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Procesando Credenciales...' : 'Registrar Nuevo Agente'}
              </button>
              
              <p className="text-center text-xs text-gray-500 uppercase tracking-widest">
                ¿Ya tiene credenciales? <Link to="/login" className="text-fbi-blue hover:underline">Iniciar Sesión</Link>
              </p>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
