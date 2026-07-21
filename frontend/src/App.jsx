import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import Footer from './shared/components/Footer';
import Header from './shared/components/Header';
import ToastContainer from './shared/components/ToastContainer';
import { ToastProvider } from './shared/hooks/useToast';
import DashboardView from './views/Dashboard/DashboardView';
import LoginView from './views/Login/LoginView';
import VotingView from './views/Voting/VotingView';

/**
 * Punto de composición de la app: providers de contexto global, layout
 * (header/footer) y enrutamiento entre las 3 vistas principales.
 */
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NetworkProvider>
          <Router>
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative bg-slate-50">
              <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-50/40 via-transparent to-transparent pointer-events-none" />
              <ToastContainer />
              <div className="relative w-full flex justify-center">
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/voting" element={<VotingView />} />
                  <Route path="/dashboard" element={<DashboardView />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </Router>
        </NetworkProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
