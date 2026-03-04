import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, MapPin, Users, CheckCircle, Shield, ArrowRight, Phone, Info, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pageVariants } from '../animations/variants';
import { MissingPerson, CaseStatus } from '../types';

const MOCK_CASES: MissingPerson[] = [
  {
    id: 1,
    usuario_id: 1,
    nome_completo: 'António Manuel',
    data_nascimento: '2015-05-10',
    genero: 'masculino',
    cor_pele: 'Negra',
    foto_principal: 'https://picsum.photos/seed/child1/600/800',
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
    foto_principal: 'https://picsum.photos/seed/woman1/600/800',
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
    foto_principal: 'https://picsum.photos/seed/boy1/600/800',
    data_desaparecimento: '2024-02-15 08:00:00',
    local_desaparecimento: 'Viana, Estalagem',
    provincia: 'Luanda',
    municipio: 'Viana',
    circunstancias: 'Saiu para a escola e não foi visto desde então.',
    contacto_emergencia: '944-555-666',
    estado: CaseStatus.MISSING,
    aprovado: true,
    criado_em: '2024-02-15'
  },
  {
    id: 4,
    usuario_id: 1,
    nome_completo: 'Ana Paula',
    data_nascimento: '2018-06-12',
    genero: 'feminino',
    cor_pele: 'Negra',
    foto_principal: 'https://picsum.photos/seed/girl2/600/800',
    data_desaparecimento: '2024-03-01 10:00:00',
    local_desaparecimento: 'Cacuaco, Mercado',
    provincia: 'Luanda',
    municipio: 'Cacuaco',
    circunstancias: 'Vista pela última vez perto da entrada principal do mercado.',
    contacto_emergencia: '922-333-444',
    estado: CaseStatus.MISSING,
    aprovado: true,
    criado_em: '2024-03-01'
  }
];

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-[#F9F8F6]"
    >
      {/* Split Hero Section - Recipe 11 Inspired */}
      <section className="min-h-screen grid lg:grid-cols-2 pt-16">
        <div className="flex flex-col justify-center p-8 lg:p-24 border-r border-black/5">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-[1px] bg-black"></div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Plataforma Nacional</span>
          </div>
          
          <h1 className="text-[12vw] lg:text-[112px] leading-[0.85] font-display font-extrabold tracking-tighter text-primary mb-12">
            KULONDA <br />
            <span className="text-secondary italic font-medium">ANGOLA</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-md leading-relaxed mb-12 font-medium">
            A rede humanitária que une tecnologia e comunidade para localizar quem amamos. 
            Transparência, rapidez e esperança em cada busca.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link to="/registar-caso" className="group relative px-10 py-5 bg-primary text-white rounded-full overflow-hidden transition-all hover:pr-14">
              <span className="relative z-10 font-bold">Registar Caso</span>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                <ArrowRight size={20} />
              </div>
            </Link>
            <Link to="/casos" className="px-10 py-5 border border-black/10 rounded-full font-bold hover:bg-black hover:text-white transition-all">
              Ver Todos os Casos
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden bg-primary group">
          <motion.img
            style={{ y }}
            src="https://picsum.photos/seed/angola-hero/1200/1600"
            alt="Humanitarian Impact"
            className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
          
          {/* Vertical Rail Text */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-12 pointer-events-none">
            <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] uppercase tracking-[0.5em] font-bold text-white/40">
              ESTADO DE ANGOLA • MININT • PN
            </span>
            <div className="w-[1px] h-32 bg-white/20"></div>
          </div>

          {/* Floating Stat Bubble */}
          <div className="absolute bottom-12 left-12 p-8 bg-white rounded-[32px] shadow-2xl max-w-xs">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center">
                <Heart size={24} fill="currentColor" />
              </div>
              <span className="text-3xl font-display font-extrabold text-primary">892</span>
            </div>
            <p className="text-sm font-medium text-gray-500 leading-relaxed">
              Famílias reunidas através da nossa plataforma este ano. Cada número é uma vida.
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Crafted Carousel - Custom Interaction */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-16 flex items-end justify-between">
          <div>
            <h2 className="text-5xl lg:text-7xl font-display font-extrabold tracking-tighter text-primary mb-4">
              Casos <span className="text-secondary italic">Urgentes</span>
            </h2>
            <p className="text-gray-500 font-medium">Pistas recentes indicam que estas pessoas podem estar próximas.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => scrollCarousel('left')}
              className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 px-8 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {MOCK_CASES.map((person) => (
            <div 
              key={person.id}
              className="min-w-[320px] md:min-w-[450px] snap-start group cursor-pointer"
              onClick={() => window.location.href = `/casos/${person.id}`}
            >
              <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden mb-6">
                <img 
                  src={person.foto_principal} 
                  alt={person.nome_completo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                    {person.provincia}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-primary mb-1">{person.nome_completo}</h3>
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <MapPin size={14} className="text-secondary" />
                    {person.local_desaparecimento}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visto em</p>
                  <p className="text-sm font-bold text-primary">{new Date(person.data_desaparecimento).toLocaleDateString('pt-AO')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features - Recipe 8/11 Inspired */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#F9F8F6] rounded-[48px] p-12 flex flex-col justify-between min-h-[400px]">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] mb-8 block">01. Tecnologia</span>
                <h3 className="text-4xl lg:text-6xl font-display font-extrabold text-primary tracking-tighter mb-6">
                  Geolocalização em <br /> Tempo Real
                </h3>
                <p className="text-lg text-gray-600 max-w-md font-medium">
                  Nossa rede de voluntários e cidadãos reporta avistamentos com precisão GPS, criando um mapa de calor das buscas.
                </p>
              </div>
              <div className="flex justify-end">
                <div className="w-24 h-24 rounded-full border border-black/5 flex items-center justify-center rotate-12">
                  <MapPin size={40} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-[48px] p-12 text-white flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-8 block">02. Segurança</span>
                <h3 className="text-4xl font-display font-extrabold tracking-tighter mb-6">
                  Verificação <br /> Governamental
                </h3>
                <p className="text-white/60 font-medium">
                  Todos os casos são validados pelas autoridades para evitar desinformação e garantir seriedade.
                </p>
              </div>
              <Shield size={64} className="text-secondary opacity-20" />
            </div>

            <div className="bg-secondary rounded-[48px] p-12 flex flex-col justify-between min-h-[400px]">
              <div>
                <span className="text-[10px] font-bold text-black/40 uppercase tracking-[0.3em] mb-8 block">03. Impacto</span>
                <h3 className="text-4xl font-display font-extrabold text-primary tracking-tighter mb-6">
                  Rede de <br /> Voluntários
                </h3>
                <p className="text-primary/60 font-medium">
                  Mais de 5.000 angolanos activos na plataforma ajudando a vigiar as ruas.
                </p>
              </div>
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i+10}`} 
                    className="w-12 h-12 rounded-full border-4 border-secondary"
                    alt="Volunteer"
                  />
                ))}
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold border-4 border-secondary">
                  +5k
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-black rounded-[48px] p-12 text-white flex flex-col md:flex-row items-center gap-12">
              <div className="flex-grow">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-8 block">04. Urgência</span>
                <h3 className="text-4xl lg:text-5xl font-display font-extrabold tracking-tighter mb-6">
                  Linha Directa 24/7
                </h3>
                <p className="text-white/60 font-medium mb-8">
                  Apoio psicológico e técnico imediato para famílias em choque. Não está sozinho.
                </p>
                <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-secondary transition-all">
                  Ligar Agora
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-3xl font-extrabold mb-1">113</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase">Polícia</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <p className="text-3xl font-extrabold mb-1">115</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase">Bombeiros</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal & Bold */}
      <section className="py-48 px-8 text-center bg-[#F9F8F6]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl lg:text-[120px] font-display font-extrabold tracking-tighter text-primary leading-[0.9] mb-12">
            VAMOS TRAZER <br />
            <span className="text-secondary italic">TODOS</span> PARA CASA.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/registar" className="text-2xl font-display font-bold border-b-4 border-secondary pb-2 hover:text-secondary transition-all">
              Junte-se como Voluntário
            </Link>
            <span className="text-gray-300 hidden sm:block">/</span>
            <Link to="/contactos" className="text-2xl font-display font-bold border-b-4 border-primary pb-2 hover:text-primary transition-all">
              Falar com a Equipa
            </Link>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}

