import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import votingRepository from '../../repositories/votingRepository';
import { useToast } from '../../shared/hooks/useToast';
import CandidateCard from './components/CandidateCard';
import SigningModal from './components/SigningModal';
import VotedBlocker from './components/VotedBlocker';

/**
 * Módulo de votación: lista de candidatos, flujo de firma criptográfica y
 * transmisión del voto a la cadena de bloques.
 */
export default function VotingView() {
  const { currentUser, isAuthenticated, markAsVoted } = useAuth();
  const { bumpBlockchainHeight } = useNetwork();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    votingRepository
      .getCandidates()
      .then(setCandidates)
      .catch(() => showToast('Error', 'No se pudo cargar la lista de candidatos.', 'danger'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const openSigningModal = (candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const closeSigningModal = () => {
    setModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;
    setBroadcasting(true);
    try {
      await votingRepository.castVote(selectedCandidate.id);
      bumpBlockchainHeight();
      markAsVoted();
      showToast(
        'Voto Registrado',
        'Su sufragio criptográfico ha sido agregado al ledger nacional de forma segura.',
        'success'
      );
      closeSigningModal();
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (err) {
      showToast('Error al Transmitir', err.message, 'danger');
    } finally {
      setBroadcasting(false);
    }
  };

  const alreadyVoted = !!currentUser?.voted;

  return (
    <section className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-mono tracking-wider uppercase mb-1 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Sesión electoral autenticada
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Elecciones de Consulta Ciudadana Nacional 2026
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Marque la opción de su preferencia. El sistema cifrará su voto mediante un hash
            irreversible asegurando confidencialidad absoluta.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono font-bold">
              Credencial Emitida
            </div>
            <div className="text-xs font-mono font-bold text-slate-900">{currentUser?.id}</div>
          </div>
        </div>
      </div>

      {alreadyVoted && <VotedBlocker />}

      {loading ? (
        <p className="text-center text-sm text-slate-400 py-10">Cargando candidatos...</p>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${
            alreadyVoted ? 'opacity-40 pointer-events-none' : ''
          }`}
        >
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onSelect={openSigningModal}
              disabled={alreadyVoted}
            />
          ))}
        </div>
      )}

      <div className="mt-8 bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <ShieldAlert className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-800 mb-0.5">
            Garantía Constitucional y Auditoría de Custodia
          </h4>
          <p className="leading-relaxed text-slate-500">
            Este sistema cuenta con encriptación homomórfica y pruebas de conocimiento cero
            (ZKP). Esto garantiza que ninguna autoridad nacional o terceros puedan vincular su
            identidad con el sentido de su voto.
          </p>
        </div>
      </div>

      <SigningModal
        open={modalOpen}
        candidate={selectedCandidate}
        onClose={closeSigningModal}
        onConfirm={handleConfirmVote}
        broadcasting={broadcasting}
      />
    </section>
  );
}
