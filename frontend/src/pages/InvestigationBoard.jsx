import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Shield, User, Briefcase, FileText } from 'lucide-react';
import { caseService, suspectService } from '../services';

// Nodo personalizado para Sospechosos
const SuspectNode = ({ data }) => (
  <div className="px-4 py-2 shadow-neon-red rounded-md bg-fbi-dark border-2 border-fbi-red min-w-[150px]">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-fbi-red" />
    <div className="flex items-center border-b border-fbi-red/20 pb-2 mb-2">
      <User className="w-4 h-4 text-fbi-red mr-2" />
      <div className="text-[10px] font-bold text-white uppercase tracking-widest">{data.label}</div>
    </div>
    <div className="text-[8px] text-gray-400 uppercase tracking-tighter">Estado: {data.status}</div>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-fbi-red" />
  </div>
);

// Nodo personalizado para Casos
const CaseNode = ({ data }) => (
  <div className="px-4 py-2 shadow-neon-blue rounded-md bg-fbi-dark border-2 border-fbi-blue min-w-[180px]">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-fbi-blue" />
    <div className="flex items-center border-b border-fbi-blue/20 pb-2 mb-2">
      <Briefcase className="w-4 h-4 text-fbi-blue mr-2" />
      <div className="text-[10px] font-bold text-white uppercase tracking-widest">{data.label}</div>
    </div>
    <div className="text-[8px] text-gray-400 uppercase tracking-tighter">Expediente: {data.id}</div>
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-fbi-blue" />
  </div>
);

const InvestigationBoard = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesData, suspectsData] = await Promise.all([
          caseService.getAll(),
          suspectService.getAll()
        ]);

        // Create case nodes
        const caseNodes = casesData.map((c, index) => ({
          id: `case-${c.id}`,
          type: 'case',
          position: { x: 250 + (index * 300), y: 50 },
          data: { label: c.titulo, id: c.id.slice(0, 8) }
        }));

        // Create suspect nodes
        const suspectNodes = suspectsData.map((s, index) => ({
          id: `suspect-${s.id}`,
          type: 'suspect',
          position: { x: 100 + (index % 4) * 200, y: 200 + Math.floor(index / 4) * 150 },
          data: { label: s.nombre, status: s.estado }
        }));

        // Create edges (connect suspects to cases - this is a simplified approach)
        // In a real app, you'd have a many-to-many relationship table
        const suspectEdges = suspectsData.map((s, index) => ({
          id: `e-${s.id}`,
          source: `case-${casesData[0]?.id}`, // Connect to first case for now
          target: `suspect-${s.id}`,
          animated: true,
          style: { stroke: '#00ffff' }
        }));

        setNodes([...caseNodes, ...suspectNodes]);
        setEdges(suspectEdges);
      } catch (err) {
        console.error("Error fetching investigation data:", err);
        // Fallback to demo data if API fails
        setNodes([
          {
            id: 'case-demo',
            type: 'case',
            position: { x: 250, y: 50 },
            data: { label: 'Demo Case', id: 'DEMO-001' }
          },
          {
            id: 'suspect-demo',
            type: 'suspect',
            position: { x: 100, y: 200 },
            data: { label: 'Demo Suspect', status: 'Buscado' }
          }
        ]);
        setEdges([
          { id: 'e-demo', source: 'case-demo', target: 'suspect-demo', animated: true, style: { stroke: '#00ffff' } }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const nodeTypes = useMemo(() => ({
    suspect: SuspectNode,
    case: CaseNode,
  }), []);

  return (
    <div className="h-[calc(100vh-160px)] w-full glass-panel rounded-xl border border-white/5 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-5 h-5 text-fbi-blue" />
          Red de Inteligencia Criminal
        </h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Modo: Análisis de Relaciones Vinculantes</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-fbi-blue animate-pulse uppercase tracking-[0.2em]">Cargando Red de Inteligencia...</div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="cyber-bg"
        >
          <Background color="#00ffff" opacity={0.05} gap={20} />
          <Controls className="bg-fbi-dark border-fbi-blue/20" />
        </ReactFlow>
      )}
      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 z-10 glass-panel p-3 rounded-lg border border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-fbi-blue border border-fbi-blue/50 rounded-sm" />
          <span className="text-[8px] text-gray-300 uppercase tracking-widest">Caso Central</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-fbi-red border border-fbi-red/50 rounded-sm" />
          <span className="text-[8px] text-gray-300 uppercase tracking-widest">Sujeto de Interés</span>
        </div>
      </div>
    </div>
  );
};

export default InvestigationBoard;
