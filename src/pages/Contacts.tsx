import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, Shield, Heart, Info, ExternalLink } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { pageVariants, staggerContainer, cardVariants } from '../animations/variants';

interface EmergencyContact {
  id: number;
  nome: string;
  numero: string;
  tipo: string;
  provincia: string;
}

export default function Contacts() {
  const [emergencyContacts, setEmergencyContacts] = React.useState<EmergencyContact[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    assunto: 'Geral',
    mensagem: ''
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/contactos-emergencia');
        setEmergencyContacts(response.data);
      } catch (error) {
        console.error("Erro ao carregar contactos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post('/api/contacto', formData);
      toast.success(response.data.message);
      setFormData({ nome: '', email: '', assunto: 'Geral', mensagem: '' });
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20 px-4 max-w-7xl mx-auto"
    >
      <div className="text-center mb-16">
        <h1 className="font-display font-extrabold text-4xl text-primary mb-4">Contactos e Emergências</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Estamos aqui para ajudar. Utilize os números de emergência nacional para situações críticas ou contacte a nossa equipa de apoio.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Emergency Numbers */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-danger/10 text-danger rounded-xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-primary">Linhas de Emergência Nacional</h2>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 gap-6"
          >
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl"></div>
              ))
            ) : (
              emergencyContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Phone size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary">{contact.nome}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{contact.provincia}</p>
                    </div>
                  </div>
                  <div className="text-3xl font-display font-extrabold text-secondary">
                    {contact.numero}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="bg-blue-50 p-8 rounded-[40px] border border-blue-100 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center shrink-0">
              <Heart className="text-danger" size={40} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-primary mb-2">Apoio Psicológico e Familiar</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O desaparecimento de um ente querido é uma experiência traumática. Oferecemos orientação e apoio emocional através da nossa rede de voluntários e parceiros.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <Mail size={24} />
              </div>
              <h2 className="text-xl font-display font-bold text-primary">Fale Connosco</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome</label>
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-secondary"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-secondary"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assunto</label>
                <select
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-secondary"
                >
                  <option value="Geral">Informação Geral</option>
                  <option value="Suporte">Suporte Técnico</option>
                  <option value="Parceria">Parcerias</option>
                  <option value="Denuncia">Denúncia de Uso Indevido</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mensagem</label>
                <textarea
                  name="mensagem"
                  required
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-secondary resize-none"
                  placeholder="Como podemos ajudar?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'A enviar...' : 'Enviar Mensagem'}
                {!submitting && <Send size={18} />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin size={18} className="text-secondary shrink-0" />
                <span>Luanda, Angola</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Info size={18} className="text-secondary shrink-0" />
                <span>Disponível 24/7 para emergências</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
