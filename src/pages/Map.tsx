import React from 'react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Search, Filter, MapPin, User, Calendar } from 'lucide-react';
import { pageVariants } from '../animations/variants';
import { MissingPerson, CaseStatus } from '../types';

// Fix for default marker icons in Leaflet with React
const markerIcon = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const markerShadow = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different states
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

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapPage() {
  const [casos, setCasos] = React.useState<MissingPerson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([-8.8390, 13.2894]); // Luanda
  const [zoom, setZoom] = React.useState(12);
  const [filterProvincia, setFilterProvincia] = React.useState('Todas');

  const provincias = [
    'Todas', 'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte', 
    'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte', 'Lunda Sul', 
    'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
  ];

  React.useEffect(() => {
    const fetchCasos = async () => {
      try {
        const response = await axios.get('/api/casos');
        // Filter out cases without coordinates for the map
        const validCasos = response.data.filter((c: MissingPerson) => c.latitude_desaparecimento && c.longitude_desaparecimento);
        setCasos(validCasos);
      } catch (error) {
        console.error("Erro ao carregar casos para o mapa:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCasos();
  }, []);

  const getIcon = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.MISSING: return missingIcon;
      case CaseStatus.INVESTIGATING: return investigatingIcon;
      case CaseStatus.FOUND: return foundIcon;
      default: return DefaultIcon;
    }
  };

  const filteredCasos = filterProvincia === 'Todas' 
    ? casos 
    : casos.filter(c => c.provincia === filterProvincia);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-20 h-screen flex flex-col"
    >
      {/* Map Header / Filters */}
      <div className="bg-white border-b border-gray-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div>
          <h1 className="font-display font-bold text-xl text-primary flex items-center gap-2">
            <MapPin className="text-secondary" />
            Mapa de Casos Activos
          </h1>
          <p className="text-xs text-gray-500">Visualize a distribuição geográfica dos desaparecimentos em Angola.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterProvincia}
              onChange={(e) => setFilterProvincia(e.target.value)}
              className="w-full md:w-48 bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-secondary"
            >
              {provincias.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
          <button 
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                  setZoom(14);
                });
              }
            }}
            className="bg-primary text-white p-2 rounded-xl hover:bg-accent transition-colors"
            title="Minha Localização"
          >
            <MapPin size={20} />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-grow relative z-0">
        {loading ? (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">A carregar mapa...</p>
            </div>
          </div>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <ChangeView center={mapCenter} zoom={zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredCasos.map((caso) => (
              <Marker 
                key={caso.id} 
                position={[caso.latitude_desaparecimento!, caso.longitude_desaparecimento!]}
                icon={getIcon(caso.estado)}
              >
                <Popup className="custom-popup">
                  <div className="w-48">
                    <img 
                      src={caso.foto_principal} 
                      alt={caso.nome_completo} 
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="font-bold text-primary text-sm mb-1">{caso.nome_completo}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                      <Calendar size={10} />
                      <span>{new Date(caso.data_desaparecimento).toLocaleDateString('pt-AO')}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 line-clamp-2 mb-3">{caso.circunstancias}</p>
                    <button 
                      onClick={() => window.location.href = `/casos/${caso.id}`}
                      className="w-full bg-primary text-white py-1.5 rounded-md text-[10px] font-bold hover:bg-accent transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-[1000] border border-white/20">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Legenda</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-danger rounded-full"></div>
              <span className="text-[10px] font-bold text-gray-700">Desaparecido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-[10px] font-bold text-gray-700">Em Investigação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-[10px] font-bold text-gray-700">Encontrado</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
