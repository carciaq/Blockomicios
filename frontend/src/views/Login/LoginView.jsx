import { KeyRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authRepository from '../../repositories/authRepository';
import { useToast } from '../../shared/hooks/useToast';
import LoginForm from './components/LoginForm';

/**
 * Vista de acceso: verificación de identidad electoral. Al autenticar
 * exitosamente redirige al módulo de votación.
 */
export default function LoginView() {
  const [voterId, setVoterId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (vId) => {
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

  return (
    <section className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-100/50 mx-auto">
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
        onVoterIdChange={setVoterId}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </section>
  );
}
