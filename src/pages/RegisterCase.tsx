import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Camera, MapPin, CheckCircle, ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { pageVariants } from '../animations/variants';

export default function RegisterCase() {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    nome_completo: '',
    data_nascimento: '',
    genero: 'masculino',
    cor_pele: 'Negra',
    foto_principal: 'https://picsum.photos/seed/missing/400/500',
    data_desaparecimento: '',
    local_desaparecimento: '',
    provincia: 'Luanda',
    municipio: '',
    circunstancias: '',
    contacto_emergencia: ''
  });

  const provincias = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte', 
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte', 'Lunda Sul', 
    'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Precisa de estar ligado para registar um caso');
        navigate('/login');
        return;
      }

      await axios.post('/api/casos', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Caso registado com sucesso! Aguarde a aprovação.');
      navigate('/casos');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao registar caso');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20 px-4 max-w-3xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="font-display font-extrabold text-4xl text-primary mb-4">Registar Desaparecimento</h1>
        <p className="text-gray-500">Preencha os dados com o máximo de detalhe possível para ajudar nas buscas.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-secondary -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
        
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
              step >= i ? 'bg-secondary text-primary' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {step > i ? <CheckCircle size={20} /> : i}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 p-8 md:p-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                  <User size={24} />
                </div>
                <h2 className="text-xl font-bold text-primary">Dados Pessoais</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    name="nome_completo"
                    value={formData.nome_completo}
                    onChange={handleInputChange}
                    placeholder="Nome da pessoa desaparecida"
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data de Nascimento *</label>
                  <input
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Género *</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cor da Pele *</label>
                  <input
                    type="text"
                    name="cor_pele"
                    value={formData.cor_pele}
                    onChange={handleInputChange}
                    placeholder="Ex: Negra, Mestiça, Branca"
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contacto de Emergência *</label>
                  <input
                    type="text"
                    name="contacto_emergencia"
                    value={formData.contacto_emergencia}
                    onChange={handleInputChange}
                    placeholder="Telemóvel da família"
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                  <Camera size={24} />
                </div>
                <h2 className="text-xl font-bold text-primary">Fotografia</h2>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-64 h-80 bg-gray-100 rounded-[32px] overflow-hidden border-4 border-dashed border-gray-200 flex items-center justify-center relative group cursor-pointer">
                  {formData.foto_principal ? (
                    <img src={formData.foto_principal} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <Upload size={48} className="text-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold text-sm">Alterar Foto</p>
                  </div>
                </div>
                <p className="mt-6 text-sm text-gray-500 text-center max-w-xs">
                  Escolha uma foto recente e clara onde o rosto seja bem visível.
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <h2 className="text-xl font-bold text-primary">Local e Circunstâncias</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data do Desaparecimento *</label>
                  <input
                    type="datetime-local"
                    name="data_desaparecimento"
                    value={formData.data_desaparecimento}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Província *</label>
                  <select
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary"
                  >
                    {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Local Exacto *</label>
                  <input
                    type="text"
                    name="local_desaparecimento"
                    value={formData.local_desaparecimento}
                    onChange={handleInputChange}
                    placeholder="Ex: Bairro Operário, Rua 5"
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Circunstâncias *</label>
                  <textarea
                    name="circunstancias"
                    value={formData.circunstancias}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Descreva como aconteceu..."
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-secondary resize-none"
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between gap-4">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-gray-500 font-bold px-6 py-3 hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Anterior
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="bg-primary text-white font-bold px-10 py-4 rounded-2xl shadow-lg hover:bg-accent transition-all flex items-center gap-2"
            >
              Próximo Passo
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-secondary text-primary font-bold px-10 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'A publicar...' : 'Publicar Caso'}
              {!loading && <CheckCircle size={20} />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
