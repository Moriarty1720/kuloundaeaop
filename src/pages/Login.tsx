import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { pageVariants } from '../animations/variants';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showResetModal, setShowResetModal] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetLoading, setResetLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success(`Bem-vindo, ${response.data.user.nome}!`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao entrar na conta');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', { email: resetEmail });
      toast.success(response.data.message);
      setShowResetModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao recuperar senha');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-20 flex"
    >
      {/* Password Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md"
              onClick={() => setShowResetModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10"
            >
              <h2 className="font-display font-extrabold text-2xl text-primary mb-4">Recuperar Palavra-passe</h2>
              <p className="text-gray-500 text-sm mb-8">Introduza o seu email para receber um link de recuperação.</p>
              
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-secondary"
                    placeholder="seu@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-accent transition-all disabled:opacity-50"
                >
                  {resetLoading ? 'A enviar...' : 'Enviar Link de Recuperação'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Cancelar
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="font-display font-extrabold text-4xl text-primary mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-500">Introduza os seus dados para aceder à plataforma KULONDA.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Endereço de Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-secondary focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Palavra-passe</label>
                <button 
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-xs font-bold text-secondary hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-secondary focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="remember" className="w-4 h-4 text-secondary rounded focus:ring-secondary" />
              <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">Manter sessão iniciada</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'A entrar...' : 'Entrar na Conta'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-6">Ainda não tem uma conta?</p>
            <Link to="/registar" className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors">
              <UserPlus size={20} />
              Criar Nova Conta no KULONDA
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <div className="w-20 h-20 bg-secondary/20 text-secondary rounded-3xl flex items-center justify-center mb-10">
            <ShieldCheck size={48} />
          </div>
          <h2 className="font-display font-extrabold text-5xl mb-6">Segurança e Confiança em Primeiro Lugar</h2>
          <p className="text-xl text-blue-100 leading-relaxed mb-10">
            A plataforma KULONDA utiliza tecnologia de ponta para garantir que todos os dados são tratados com a máxima confidencialidade e rigor.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shrink-0 mt-1">
                <CheckCircle size={14} className="text-white" />
              </div>
              <p className="text-blue-100">Verificação rigorosa de autoridades policiais.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shrink-0 mt-1">
                <CheckCircle size={14} className="text-white" />
              </div>
              <p className="text-blue-100">Protecção de dados sensíveis das famílias.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shrink-0 mt-1">
                <CheckCircle size={14} className="text-white" />
              </div>
              <p className="text-blue-100">Monitorização 24/7 de avistamentos reportados.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheckCircle({ size, className }: { size: number, className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
