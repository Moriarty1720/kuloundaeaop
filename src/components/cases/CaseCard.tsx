import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, ArrowRight, User } from 'lucide-react';
import { MissingPerson, CaseStatus } from '../../types';
import { cardVariants } from '../../animations/variants';

interface CaseCardProps {
  person: MissingPerson;
  key?: React.Key;
}

export default function CaseCard({ person }: CaseCardProps) {
  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.MISSING: return 'bg-danger';
      case CaseStatus.INVESTIGATING: return 'bg-secondary';
      case CaseStatus.FOUND: return 'bg-success';
      case CaseStatus.CLOSED: return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.MISSING: return 'DESAPARECIDO';
      case CaseStatus.INVESTIGATING: return 'EM INVESTIGAÇÃO';
      case CaseStatus.FOUND: return 'ENCONTRADO';
      case CaseStatus.CLOSED: return 'ENCERRADO';
      default: return (status as string).toUpperCase();
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={person.foto_principal}
          alt={person.nome_completo}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg ${getStatusColor(person.estado)} ${person.estado === CaseStatus.MISSING ? 'pulse-red' : ''}`}>
          {getStatusLabel(person.estado)}
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-display font-bold text-lg text-primary mb-1 line-clamp-1">
          {person.nome_completo}
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          {new Date().getFullYear() - new Date(person.data_nascimento).getFullYear()} anos • {person.genero}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-secondary mt-0.5 shrink-0" />
            <span className="line-clamp-1">{person.local_desaparecimento}, {person.provincia}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-secondary shrink-0" />
            <span>{new Date(person.data_desaparecimento).toLocaleDateString('pt-AO')}</span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button className="flex-grow bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-accent transition-colors flex items-center justify-center gap-2">
            Ver Detalhes
            <ArrowRight size={16} />
          </button>
          <button className="p-2.5 border border-gray-200 rounded-xl text-primary hover:bg-gray-50 transition-colors" title="Reportar Avistamento">
            <MapPin size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
