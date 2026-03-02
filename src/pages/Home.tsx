import React from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Users, CheckCircle, Shield, ArrowRight, Phone, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pageVariants, staggerContainer, cardVariants } from '../animations/variants';
import CaseCard from '../components/cases/CaseCard';
import { MissingPerson, CaseStatus } from '../types';

// Mock data for initial display
const MOCK_CASES: MissingPerson[] = [
  {
    id: 1,
    usuario_id: 1,
    nome_completo: 'António Manuel',
    data_nascimento: '2015-05-10',
    genero: 'masculino',
    cor_pele: 'Negra',
    foto_principal: 'https://picsum.photos/seed/child1/400/500',
    data_desaparecimento: '2024-02-20 14:30:00',
    local_desaparecimento: 'Mercado do Roque Santeiro',
    provincia: 'Luanda',
    municipio: 'Sambizanga',
    circunstancias: 'Desapareceu enquanto a mãe fazia compras.',
    contacto_emergencia: '923-000-000',
    estado: CaseStatus.MISSING,
    aprovado: true,
    criado_em: '2024-02-20'
  },
  {
    id: 2,
    usuario_id: 1,
    nome_completo: 'Isabel Costa',
    data_nascimento: '1998-11-22',
    genero: 'feminino',
    cor_pele: 'Mestiça',
    foto_principal: 'https://picsum.photos/seed/woman1/400/500',
    data_desaparecimento: '2024-02-25 19:00:00',
    local_desaparecimento: 'Paragem da Mutamba',
    provincia: 'Luanda',
    municipio: 'Ingombota',
    circunstancias: 'Não regressou do trabalho no final do dia.',
    contacto_emergencia: '931-111-222',
    estado: CaseStatus.INVESTIGATING,
    aprovado: true,
    criado_em: '2024-02-25'
  },
  {
    id: 3,
    usuario_id: 1,
    nome_completo: 'Mateus Dala',
    data_nascimento: '2010-03-15',
    genero: 'masculino',
    cor_pele: 'Negra',
    foto_principal: 'https://picsum.photos/seed/boy1/400/500',
    data_desaparecimento: '2024-02-15 08:00:00',
    local_desaparecimento: 'Viana, Estalagem',
    provincia: 'Luanda',
    municipio: 'Viana',
    circunstancias: 'Saiu para a escola e não foi visto desde então.',
    contacto_emergencia: '944-555-666',
    estado: CaseStatus.MISSING,
    aprovado: true,
    criado_em: '2024-02-15'
  }
];

export default function Home() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-accent to-blue-600 text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight mb-6">
              Kulonda — <span className="text-secondary">Encontra Angola</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg">
              Juntos encontramos quem amamos. A maior rede humanitária de localização de pessoas desaparecidas em Angola.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/registar-caso" className="bg-secondary text-primary font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Registar Caso
                <ArrowRight size={20} />
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('hasSeenTutorial');
                  window.location.reload();
                }}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Ver Tutorial
                <Info size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block"
          >
            <div className="relative">
              <img
                src="https://picsum.photos/seed/angola/800/600"
                alt="Angola Map Illustration"
                className="rounded-3xl shadow-2xl border-4 border-white/20"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl text-primary">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold">124</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Encontrados este mês</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Casos Registados', value: '1,450', color: 'text-primary' },
            { label: 'Pessoas Encontradas', value: '892', color: 'text-success' },
            { label: 'Províncias', value: '18', color: 'text-secondary' },
            { label: 'Voluntários', value: '5k+', color: 'text-accent' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className={`text-3xl md:text-4xl font-display font-extrabold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Cases */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display font-extrabold text-3xl text-primary mb-2">Casos Recentes</h2>
            <p className="text-gray-500">Ajude-nos a localizar estas pessoas desaparecidas recentemente.</p>
          </div>
          <Link to="/casos" className="text-primary font-bold flex items-center gap-2 hover:text-secondary transition-colors">
            Ver Todos
            <ArrowRight size={20} />
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {MOCK_CASES.map((person) => (
            <CaseCard key={person.id} person={person} />
          ))}
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-extrabold text-3xl text-primary mb-4">Como Funciona o Kulonda</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Uma rede colaborativa entre famílias, cidadãos e autoridades para uma resposta rápida e eficaz.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Users size={32} />,
                title: 'Registo do Caso',
                desc: 'A família regista o desaparecimento com fotos e detalhes cruciais na plataforma.'
              },
              {
                icon: <MapPin size={32} />,
                title: 'Mobilização Comunitária',
                desc: 'A comunidade é alertada e reporta avistamentos geolocalizados em tempo real.'
              },
              {
                icon: <Shield size={32} />,
                title: 'Intervenção Policial',
                desc: 'As autoridades recebem os dados e coordenam as buscas com base nas pistas recebidas.'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="font-display font-bold text-xl mb-4 text-primary">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-primary rounded-[40px] p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-6">Números de Emergência</h2>
            <p className="text-blue-100 mb-8 max-w-md">Em caso de perigo imediato, contacte directamente as autoridades nacionais.</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-bold text-blue-200 uppercase mb-1">Polícia Nacional</p>
                <p className="text-2xl font-extrabold">113</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-bold text-blue-200 uppercase mb-1">Bombeiros</p>
                <p className="text-2xl font-extrabold">115</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-bold text-blue-200 uppercase mb-1">Emergência Médica</p>
                <p className="text-2xl font-extrabold">117</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-xs font-bold text-blue-200 uppercase mb-1">Protecção Civil</p>
                <p className="text-2xl font-extrabold">118</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-white text-primary p-8 rounded-3xl shadow-2xl w-full md:w-96">
            <div className="flex items-center gap-3 mb-6">
              <Phone className="text-secondary" />
              <h3 className="font-bold text-xl">Precisa de Ajuda?</h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">A nossa equipa de apoio está disponível 24/7 para orientar famílias em situações críticas.</p>
            <button className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-colors">
              Contactar Apoio KULONDA
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
