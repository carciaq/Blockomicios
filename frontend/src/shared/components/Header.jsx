import { Box, Server, ShieldCheck } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../hooks/useToast';
import { formatNumber } from '../utils/formatters';

const navLinkClasses = ({ isActive }) =>
  `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
    isActive
      ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
      : 'text-slate-600 hover:text-slate-900'
  }`;

/**
 * Encabezado global: marca, indicadores de red en vivo y navegación entre
 * vistas. `blockchainHeight` se recibe como prop para reflejar el bloque
 * actual reportado por la red.
 */
export default function Header() {
  const { isAuthenticated } = useAuth();
  const { blockchainHeight, activeNetworkNodes } = useNetwork();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleVotingNavClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      showToast(
        'Falta Identificación',
        'Por favor, autentíquese primero para ingresar a la boleta oficial.',
        'warning'
      );
      navigate('/login');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate(isAuthenticated ? '/voting' : '/login')}
        >
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Blocko <span className="text-blue-600 font-normal">micios</span>
            </span>
            <span className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase">
              Protocolo Electoral Descentralizado
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600">
              Red: <strong className="text-emerald-700">Auditores Activos</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Box className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-600">
              Bloque actual:{' '}
              <strong className="text-slate-900">#{formatNumber(blockchainHeight)}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Server className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-600">
              Nodos Auditores:{' '}
              <strong className="text-slate-900">{activeNetworkNodes} Estables</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <NavLink to="/login" className={navLinkClasses}>
            Acceder
          </NavLink>
          <NavLink to="/voting" className={navLinkClasses} onClick={handleVotingNavClick}>
            Votar
          </NavLink>
        </div>
      </div>
    </header>
  );
}
