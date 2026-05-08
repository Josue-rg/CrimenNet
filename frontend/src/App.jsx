import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import CaseDetail from './pages/CaseDetail';
import SuspectList from './pages/SuspectList';
import SuspectDetail from './pages/SuspectDetail';
import InvestigationBoard from './pages/InvestigationBoard';
import EvidenceList from './pages/EvidenceList';
import Timeline from './pages/Timeline';
import InterrogationList from './pages/InterrogationList';
import Layout from './layouts/MainLayout';

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-fbi-black flex items-center justify-center">
      <div className="text-fbi-blue animate-pulse uppercase tracking-[0.3em]">Cargando Sistema...</div>
    </div>
  );

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/cases" element={
        <PrivateRoute>
          <CaseList />
        </PrivateRoute>
      } />

      <Route path="/cases/:id" element={
        <PrivateRoute>
          <CaseDetail />
        </PrivateRoute>
      } />

      <Route path="/suspects" element={
        <PrivateRoute>
          <SuspectList />
        </PrivateRoute>
      } />

      <Route path="/suspects/:id" element={
        <PrivateRoute>
          <SuspectDetail />
        </PrivateRoute>
      } />

      <Route path="/investigation-board" element={
        <PrivateRoute>
          <InvestigationBoard />
        </PrivateRoute>
      } />

      <Route path="/evidence" element={
        <PrivateRoute>
          <EvidenceList />
        </PrivateRoute>
      } />

      <Route path="/timeline" element={
        <PrivateRoute>
          <Timeline />
        </PrivateRoute>
      } />

      <Route path="/interrogations" element={
        <PrivateRoute>
          <InterrogationList />
        </PrivateRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
