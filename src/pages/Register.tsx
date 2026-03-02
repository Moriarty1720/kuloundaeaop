import React from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { pageVariants } from '../animations/variants';

export default function Register() {
  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'familia',
    provincia: 'Luanda'
  });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const provincias = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte', 
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte', 'Lunda Sul', 
    'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', formData);
      toast.success('Conta criada com sucesso! Faça login agora.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
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
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <h2 className="font-display font-extrabold text-5xl mb-6">Junte-se à nossa missão</h2>
          <p className="text-xl text-blue-100 leading-relaxed mb-10">
            Ao criar uma conta, você passa a fazer parte de uma rede solidária que ajuda a reunir famílias angolanas.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
              <h3 className="font-bold text-secondary mb-2">Família</h3>
              <p className="text-xs text-blue-100">Registe e acompanhe casos de desaparecimento.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
              <h3 className="font-bold text-secondary mb-2">Cidadão</h3>
              <p className="text-xs text-blue-100">Ajude a reportar avistamentos na sua área.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="font-display font-extrabold text-4xl text-primary mb-2">Criar conta</h1>
            <p className="text-gray-500">Registe-se para começar a usar a plataforma KULONDA.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-secondary focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Endereço de Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="exemplo@email.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-secondary focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tipo de Conta</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary focus:bg-white transition-all outline-none text-sm"
                >
                  <option value="familia">Família</option>
                  <option value="cidadao">Cidadão</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Província</label>
                <select
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary focus:bg-white transition-all outline-none text-sm"
                >
                  {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="senha"
                  required
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-secondary focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? 'A criar conta...' : 'Criar Conta'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Já tem uma conta? <Link to="/login" className="text-primary font-bold hover:text-secondary transition-colors">Entrar agora</Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
