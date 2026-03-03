import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Search, Filter, MapPin, User, Calendar, Navigation, Layers, Info, X, ChevronRight } from 'lucide-react';
import { pageVariants } from '../animations/variants';
import { MissingPerson, CaseStatus } from '../types';

// Fix for default marker icons in Leaflet with React
const markerShadow = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const missingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const investigatingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center, zoom, follow }: { center: [number, number], zoom: number, follow: boolean }) {
  const map = useMap();
  if (follow) {
    map.setView(center, zoom);
  }
  return null;
}

export default function MapPage() {
  const [casos, setCasos] = React.useState<MissingPerson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([-8.8390, 13.2894]); // Luanda
  const [zoom, setZoom] = React.useState(13);
  const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null);
  const [followUser, setFollowUser] = React.useState(false);
  const [mapType, setMapType] = React.useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [selectedCase, setSelectedCase] = React.useState<MissingPerson | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterProvincia, setFilterProvincia] = React.useState('Todas');

  const provincias = [
    'Todas', 'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte', 
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte', 'Lunda Sul', 
    'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
  ];

  // Tile URLs - Fallback to OpenStreetMap if no Google Key is present
  const googleTileUrl = (type: string) => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (key && key !== 'insira_sua_chave_aqui') {
      const lyrs = type === 'satellite' ? 's,h' : type === 'terrain' ? 'p' : 'm';
      return `https://{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}&key=${key}`;
    }
    // Fallback to high-quality OSM style
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  React.useEffect(() => {
    const fetchCasos = async () => {
      try {
        const response = await axios.get('/api/casos');
        const validCasos = response.data.filter((c: MissingPerson) => c.latitude_desaparecimento && c.longitude_desaparecimento);
        setCasos(validCasos);
      } catch (error) {
        console.error("Erro ao carregar casos para o mapa:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCasos();

    // Live tracking
    let watchId: number;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLoc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(newLoc);
          if (followUser) {
            setMapCenter(newLoc);
          }
        },
        (err) => console.error("Erro na geolocalização:", err),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [followUser]);

  const getIcon = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.MISSING: return missingIcon;
      case CaseStatus.INVESTIGATING: return investigatingIcon;
      case CaseStatus.FOUND: return foundIcon;
      default: return missingIcon;
    }
  };

  const filteredCasos = casos.filter(c => {
    const matchesProvincia = filterProvincia === 'Todas' || c.provincia === filterProvincia;
    const matchesSearch = c.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.local_desaparecimento.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProvincia && matchesSearch;
  });

  // Angola Bounding Box
  const angolaBounds: L.LatLngBoundsExpression = [
    [-18.042, 11.673], // South West
    [-4.373, 24.082]   // North East
  ];

  const toggleFollow = () => {
    setFollowUser(!followUser);
    if (!followUser && userLocation) {
      setMapCenter(userLocation);
      setZoom(16);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-16 h-screen flex flex-col overflow-hidden"
    >
      {/* Search and Filter Overlay */}
      <div className="absolute top-20 left-4 right-4 md:left-6 md:right-auto md:w-96 z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex items-center gap-2">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Procurar pessoa ou local em Angola..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="h-8 w-px bg-gray-100"></div>
          <button className="p-2 text-primary hover:bg-gray-50 rounded-xl transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {provincias.slice(0, 8).map(p => (
            <button
              key={p}
              onClick={() => setFilterProvincia(p)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm border ${
                filterProvincia === p 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-gray-600 border-gray-100 hover:border-primary/30'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Map Type Toggle */}
      <div className="absolute top-20 right-4 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-primary hover:bg-gray-50 transition-all group"
          title="Alternar Camada"
        >
          <Layers size={22} className="group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={toggleFollow}
          className={`p-3 rounded-2xl shadow-xl border border-gray-100 transition-all group ${
            followUser ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-gray-50'
          }`}
          title="Seguir Minha Localização"
        >
          <Navigation size={22} className={`${followUser ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-grow relative z-0">
        {loading ? (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-primary font-display font-bold text-lg">KULONDA MAPS</p>
              <p className="text-gray-400 text-sm">A carregar dados geográficos...</p>
            </div>
          </div>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false}
            maxBounds={angolaBounds}
            maxBoundsViscosity={1.0}
            minZoom={6}
          >
            <ChangeView center={mapCenter} zoom={zoom} follow={followUser} />
            
            <TileLayer
              url={googleTileUrl(mapType)}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              attribution='&copy; Google Maps / OSM'
            />
            
            {/* User Location Marker (Blue Dot) */}
            {userLocation && (
              <>
                <CircleMarker 
                  center={userLocation}
                  radius={12}
                  pathOptions={{ color: '#fff', weight: 3, fillColor: '#4285F4', fillOpacity: 0.3 }}
                />
                <CircleMarker 
                  center={userLocation}
                  radius={7}
                  pathOptions={{ color: '#fff', weight: 2, fillColor: '#4285F4', fillOpacity: 1 }}
                />
              </>
            )}

            {filteredCasos.map((caso) => (
              <Marker 
                key={caso.id} 
                position={[caso.latitude_desaparecimento!, caso.longitude_desaparecimento!]}
                icon={getIcon(caso.estado)}
                eventHandlers={{
                  click: () => setSelectedCase(caso)
                }}
              >
                <Popup className="custom-popup">
                  <div className="w-48 p-1">
                    <img 
                      src={caso.foto_principal} 
                      alt={caso.nome_completo} 
                      className="w-full h-28 object-cover rounded-xl mb-3 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="font-display font-bold text-primary text-sm mb-1">{caso.nome_completo}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-3">
                      <Calendar size={12} className="text-secondary" />
                      <span>Desaparecido em {new Date(caso.data_desaparecimento).toLocaleDateString('pt-AO')}</span>
                    </div>
                    <button 
                      onClick={() => window.location.href = `/casos/${caso.id}`}
                      className="w-full bg-primary text-white py-2 rounded-xl text-[10px] font-bold hover:bg-accent transition-all flex items-center justify-center gap-2"
                    >
                      Ver Perfil Completo
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Selected Case Quick View (Mobile/Side Panel Style) */}
        <AnimatePresence>
          {selectedCase && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 md:left-6 md:bottom-6 md:right-auto md:w-96 bg-white rounded-t-3xl md:rounded-3xl shadow-2xl z-[1001] p-6 border-t md:border border-gray-100"
            >
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex gap-4 mb-6">
                <img 
                  src={selectedCase.foto_principal} 
                  alt={selectedCase.nome_completo} 
                  className="w-24 h-24 rounded-2xl object-cover shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedCase.estado === CaseStatus.MISSING ? 'bg-danger/10 text-danger' : 
                      selectedCase.estado === CaseStatus.INVESTIGATING ? 'bg-secondary/10 text-secondary' : 
                      'bg-success/10 text-success'
                    }`}>
                      {selectedCase.estado.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl text-primary leading-tight mb-1">{selectedCase.nome_completo}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} className="text-secondary" />
                    {selectedCase.municipio}, {selectedCase.provincia}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Circunstâncias</h4>
                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{selectedCase.circunstancias}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => window.location.href = `/casos/${selectedCase.id}`}
                  className="bg-primary text-white py-3 rounded-2xl text-sm font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20"
                >
                  Ver Detalhes
                </button>
                <button 
                  className="bg-secondary text-white py-3 rounded-2xl text-sm font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
                >
                  Reportar Avistamento
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend / Info Overlay */}
        <div className="absolute bottom-6 right-6 hidden md:flex flex-col gap-2 z-[1000]">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Legenda</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-danger rounded-full shadow-sm shadow-danger/40"></div>
                <span className="text-[11px] font-bold text-gray-700">Desaparecido</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-secondary rounded-full shadow-sm shadow-secondary/40"></div>
                <span className="text-[11px] font-bold text-gray-700">Em Investigação</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full shadow-sm shadow-success/40"></div>
                <span className="text-[11px] font-bold text-gray-700">Encontrado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

