import { KeyRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authRepository from '../../repositories/authRepository';
import votingRepository from '../../repositories/votingRepository';
import { useToast } from '../../shared/hooks/useToast';
import { isValidColombianVoterId } from '../../shared/utils/validators';
import LoginForm from './components/LoginForm';
import ResultsPanel from '../Voting/components/ResultsPanel';

/**
 * Vista de acceso: verificación de identidad electoral. Al autenticar
 * exitosamente redirige al módulo de votación.
 */
export default function LoginView() {
  const [voterId, setVoterId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(true);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (vId) => {
    if (!isValidColombianVoterId(vId)) {
      setError('El ID electoral debe tener entre 6 y 10 dígitos y no empezar con cero.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const session = await authRepository.login(vId);
      login(session);
      showToast(
        'Identidad Verificada',
        'Ya puede emitir su voto en la boleta oficial.',
        'success'
      );
      setTimeout(() => navigate('/voting'), 500);
    } catch (err) {
      showToast('Error de Identificación', err.message, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const normalizeResults = (payload) => {
      if (!payload) return [];
      if (payload?.results && Array.isArray(payload.results)) payload = payload.results;
      if (payload?.votes && Array.isArray(payload.votes)) payload = payload.votes;
      if (!Array.isArray(payload)) return [];
      if (payload.length === 0) return [];
      if (payload[0]?.eventName) return payload;
      if (payload[0]?.eventId != null && payload[0]?.candidateId != null) {
        const eventsById = {};
        payload.forEach((vote) => {
          const eventId = Number(vote.eventId);
          const candidateId = Number(vote.candidateId);
          if (!eventsById[eventId]) {
            eventsById[eventId] = {
              eventId,
              eventName: `Evento ${eventId}`,
              description: 'Resultados agregados automáticamente',
              totalVotes: 0,
              candidates: {},
            };
          }
          const eventSummary = eventsById[eventId];
          eventSummary.totalVotes += 1;
          if (!eventSummary.candidates[candidateId]) {
            eventSummary.candidates[candidateId] = {
              candidateId,
              name: `Opción ${candidateId}`,
              party: '',
              votes: 0,
            };
          }
          eventSummary.candidates[candidateId].votes += 1;
        });

        return Object.values(eventsById).map((eventSummary) => ({
          ...eventSummary,
          candidates: Object.values(eventSummary.candidates),
        }));
      }
      return payload;
    };

    async function loadResults() {
      try {
        const resultsData = await votingRepository.getResults();
        if (!isMounted) return;

        const raw = resultsData?.results ?? resultsData?.votes ?? resultsData;
        setResults(normalizeResults(raw));
      } catch (err) {
        // Results are informative; avoid blocking the login page.
      } finally {
        if (isMounted) setResultsLoading(false);
      }
    }

    loadResults();
    intervalId = setInterval(loadResults, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)] items-start">
      <section className="w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-100/50">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full border border-blue-100 mb-3 text-blue-600">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Verificación de Identidad Electoral
        </h2>
        <p className="text-slate-500 text-xs mt-1.5">
          Ingrese su número de elector para iniciar sesión y avanzar al módulo de
          votación.
        </p>
      </div>

      <LoginForm
        voterId={voterId}
        onVoterIdChange={(value) => {
          setVoterId(value);
          if (error) setError('');
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
      </section>

      <div className="space-y-6">
        {resultsLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Cargando resultados...
          </div>
        ) : (
          <ResultsPanel results={results} />
        )}
      </div>
    </div>
  );
}
