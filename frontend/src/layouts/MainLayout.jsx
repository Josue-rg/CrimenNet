import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Search, 
  Clock, 
  FileText, 
  Share2, 
  LogOut, 
  Shield, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Resumen Central', path: '/dashboard' },
    { icon: Briefcase, label: 'Archivo de Casos', path: '/cases' },
    { icon: Users, label: 'Base de Sospechosos', path: '/suspects' },
    { icon: Search, label: 'Evidencias', path: '/evidence' },
    { icon: Share2, label: 'Tablero de Redes', path: '/investigation-board' },
    { icon: Clock, label: 'Timeline de Eventos', path: '/timeline' },
  ];

  return (
    <div className="min-h-screen bg-fbi-black text-gray-200 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? '280px' : '80px' }}
        className="glass-panel border-r border-fbi-blue/10 flex flex-col z-50"
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-4 border-b border-fbi-blue/10">
          <div className="min-w-[40px] h-10 bg-fbi-blue/10 rounded flex items-center justify-center border border-fbi-blue/30 shadow-neon-blue">
            <Shield className="w-6 h-6 text-fbi-blue" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-widest text-white uppercase"
            >
              Crimen<span className="text-fbi-blue">Net</span>
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 p-3 rounded-lg transition-all group
                ${isActive 
                  ? 'bg-fbi-blue/10 text-fbi-blue border border-fbi-blue/30 shadow-neon-blue' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 min-w-[20px] ${isSidebarOpen ? '' : 'mx-auto'}`} />
              {isSidebarOpen && (
                <span className="text-sm uppercase tracking-widest font-medium">
                  {item.label}
                </span>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-20 bg-fbi-dark border border-fbi-blue/20 p-2 rounded text-[10px] uppercase tracking-widest invisible group-hover:visible whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-fbi-blue/10 space-y-4">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
              <div className="w-10 h-10 rounded-full bg-fbi-blue/20 flex items-center justify-center border border-fbi-blue/30">
                <span className="text-fbi-blue font-bold uppercase">{user?.username?.[0]}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white uppercase tracking-tight">{user?.username}</span>
                <span className="text-[10px] text-fbi-blue uppercase tracking-tighter">{user?.role}</span>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-900/20 text-gray-400 hover:text-red-400 transition-all group"
          >
            <LogOut className={`w-5 h-5 min-w-[20px] ${isSidebarOpen ? '' : 'mx-auto'}`} />
            {isSidebarOpen && (
              <span className="text-sm uppercase tracking-widest font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 border-t border-fbi-blue/10 hover:bg-white/5 text-gray-500 transition-all flex justify-center"
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-fbi-blue/10 glass-panel flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-fbi-blue animate-pulse shadow-neon-blue" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-fbi-blue font-bold">
              Status: Terminal Conectada
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-[10px] text-gray-500 font-mono uppercase">
              Server: AWS-US-EAST-1 | DB: NEON-POSTGRES
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto cyber-bg relative p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
