import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/layout/Navbar';
import KulondaBot from './components/chat/KulondaBot';

// Pages
import Home from './pages/Home';
import Cases from './pages/Cases';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterCase from './pages/RegisterCase';
import MapPage from './pages/Map';
import Contacts from './pages/Contacts';
import TutorialModal from './components/ui/TutorialModal';

// Placeholder Pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="pt-32 px-4 text-center">
    <h1 className="text-4xl font-display font-bold text-primary">{title}</h1>
    <p className="text-gray-500 mt-4">Esta página está em desenvolvimento.</p>
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  const [showTutorial, setShowTutorial] = React.useState(false);

  React.useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/casos" element={<Cases />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/contactos" element={<Contacts />} />
          <Route path="/registar-caso" element={<RegisterCase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registar" element={<Register />} />
          <Route path="/dashboard" element={<Placeholder title="O Meu Painel" />} />
        </Routes>
      </AnimatePresence>
      <TutorialModal isOpen={showTutorial} onClose={closeTutorial} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <footer className="bg-primary text-white py-12 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-secondary rounded-full"></div>
                <span className="font-display font-extrabold text-2xl">KULONDA</span>
              </div>
              <p className="text-blue-100 max-w-md leading-relaxed">
                Plataforma humanitária dedicada à localização de pessoas desaparecidas em Angola.
                Um projecto de impacto social para unir famílias e fortalecer a segurança comunitária.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Links Rápidos</h4>
              <ul className="space-y-4 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-secondary">Sobre o Projecto</a></li>
                <li><a href="#" className="hover:text-secondary">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-secondary">Privacidade</a></li>
                <li><a href="#" className="hover:text-secondary">Ajuda / FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Governo de Angola</h4>
              <ul className="space-y-4 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-secondary">Polícia Nacional</a></li>
                <li><a href="#" className="hover:text-secondary">Ministério do Interior</a></li>
                <li><a href="#" className="hover:text-secondary">Protecção Civil</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-blue-300">
            © {new Date().getFullYear()} KULONDA – Encontra Angola. Todos os direitos reservados.
          </div>
        </footer>
        <KulondaBot />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}
