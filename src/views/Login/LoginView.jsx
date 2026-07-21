import { KeyRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authRepository from '../../repositories/authRepository';
import { useToast } from '../../shared/hooks/useToast';
import DemoPanel from './components/DemoPanel';
import LoginForm from './components/LoginForm';

/**
 * Vista de acceso: verificación de identidad electoral. Al autenticar
 * exitosamente redirige al módulo de votación.
 */
export default function LoginView() {
  const [voterId, setVoterId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoUser, setDemoUser] = useState(null);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    authRepository
      .getDemoCredentials()
      .then((users) => setDemoUser(users[0] || null))
      .catch(() => setDemoUser(null));
  }, []);

  const handleAutofill = () => {
    if (!demoUser) return;
    setVoterId(demoUser.voterId);
    setPrivateKey('0x' + Math.random().toString(16).substr(2, 40));
    showToast(
      'Credenciales de Simulación',
      `Identidad ${demoUser.voterId} cargada de forma local.`,
      'blue'
    );
  };

  const handleSubmit = async (vId, pKey) => {
    setSubmitting(true);
    try {
      const session = await authRepository.login(vId, pKey);
      login(session);
      showToast(
        'Validación de Identidad',
        'Firma del ciudadano autorizada para emitir voto.',
        'success'
      );
      setTimeout(() => navigate('/voting'), 500);
    } catch (err) {
      showToast('Error de Autenticación', err.message, 'danger');
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
          Ingrese sus datos del padrón oficial y su llave criptográfica para firmar
          digitalmente su voto.
        </p>
      </div>

      <DemoPanel demoUser={demoUser} onAutofill={handleAutofill} />

      <LoginForm
        voterId={voterId}
        privateKey={privateKey}
        onVoterIdChange={setVoterId}
        onPrivateKeyChange={setPrivateKey}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </section>
  );
}
