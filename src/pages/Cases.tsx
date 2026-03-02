import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Map as MapIcon, Grid } from 'lucide-react';
import axios from 'axios';
import { pageVariants, staggerContainer } from '../animations/variants';
import CaseCard from '../components/cases/CaseCard';
import { MissingPerson, CaseStatus } from '../types';

export default function Cases() {
  const [casos, setCasos] = React.useState<MissingPerson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterProvincia, setFilterProvincia] = React.useState('Todas');
  const [filterEstado, setFilterEstado] = React.useState('Todos');

  const provincias = [
    'Todas', 'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte', 
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte', 'Lunda Sul', 
    'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
  ];

  const estados = ['Todos', 'Desaparecido', 'Em Investigação', 'Encontrado'];

  React.useEffect(() => {
    const fetchCasos = async () => {
      try {
        const response = await axios.get('/api/casos');
        setCasos(response.data);
      } catch (error) {
        console.error("Erro ao procurar casos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCasos();
  }, []);

  const filteredCasos = casos.filter(caso => {
    const matchesSearch = caso.nome_completo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvincia = filterProvincia === 'Todas' || caso.provincia === filterProvincia;
    const matchesEstado = filterEstado === 'Todos' || 
      (filterEstado === 'Desaparecido' && caso.estado === CaseStatus.MISSING) ||
      (filterEstado === 'Em Investigação' && caso.estado === CaseStatus.INVESTIGATING) ||
      (filterEstado === 'Encontrado' && caso.estado === CaseStatus.FOUND);
    
    return matchesSearch && matchesProvincia && matchesEstado;
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20 px-4 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display font-extrabold text-4xl text-primary mb-2">Casos Activos</h1>
          <p className="text-gray-500">Existem {filteredCasos.length} casos correspondentes aos seus filtros.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm">
            <Grid size={18} />
            Grelha
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
            <MapIcon size={18} />
            Mapa
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
              <Filter size={18} className="text-secondary" />
              Filtros de Pesquisa
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pesquisar Nome</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: António Manuel..."
                    className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Província</label>
                <select
                  value={filterProvincia}
                  onChange={(e) => setFilterProvincia(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary"
                >
                  {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estado do Caso</label>
                <div className="space-y-2">
                  {estados.map(e => (
                    <label key={e} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="estado"
                        checked={filterEstado === e}
                        onChange={() => setFilterEstado(e)}
                        className="w-4 h-4 text-secondary focus:ring-secondary border-gray-300"
                      />
                      <span className={`text-sm ${filterEstado === e ? 'text-primary font-bold' : 'text-gray-500 group-hover:text-primary'}`}>
                        {e}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setFilterProvincia('Todas');
                setFilterEstado('Todos');
              }}
              className="w-full mt-8 text-xs font-bold text-secondary uppercase tracking-widest hover:underline"
            >
              Limpar Todos os Filtros
            </button>
          </div>

          <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
            <h4 className="font-bold mb-4 relative z-10">Não encontrou quem procura?</h4>
            <p className="text-xs text-blue-100 mb-6 relative z-10 leading-relaxed">
              Se tem um familiar desaparecido, registe o caso agora para que a comunidade possa ajudar.
            </p>
            <button className="w-full bg-secondary text-primary font-bold py-3 rounded-xl text-sm hover:bg-opacity-90 transition-all relative z-10">
              Registar Novo Caso
            </button>
          </div>
        </aside>

        {/* Cases Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : filteredCasos.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCasos.map((person) => (
                <CaseCard key={person.id} person={person} />
              ))}
            </motion.div>
          ) : (
            <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-gray-300" />
              </div>
              <h3 className="font-display font-bold text-2xl text-primary mb-2">Nenhum caso encontrado</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Tente ajustar os seus filtros ou pesquisar por outro nome para encontrar o que procura.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
