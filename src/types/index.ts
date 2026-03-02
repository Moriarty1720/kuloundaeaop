/**
 * KULONDA – ENCONTRA-ANGOLA
 * Global Types and Interfaces
 */

export enum UserType {
  ADMIN = 'admin',
  AUTHORITY = 'autoridade',
  FAMILY = 'familia',
  CITIZEN = 'cidadao'
}

export enum CaseStatus {
  MISSING = 'desaparecido',
  INVESTIGATING = 'em_investigacao',
  FOUND = 'encontrado',
  CLOSED = 'encerrado'
}

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo: UserType;
  foto?: string;
  telefone?: string;
  provincia?: string;
  status: 'activo' | 'suspenso' | 'pendente';
}

export interface MissingPerson {
  id: number;
  usuario_id: number;
  nome_completo: string;
  data_nascimento: string;
  genero: 'masculino' | 'feminino' | 'outro';
  altura?: number;
  peso?: number;
  cor_pele: string;
  cor_olhos?: string;
  cor_cabelo?: string;
  sinais_particulares?: string;
  ultima_roupa?: string;
  foto_principal: string;
  fotos_adicionais?: string[];
  data_desaparecimento: string;
  local_desaparecimento: string;
  latitude_desaparecimento?: number;
  longitude_desaparecimento?: number;
  provincia: string;
  municipio: string;
  circunstancias: string;
  contacto_emergencia: string;
  estado: CaseStatus;
  aprovado: boolean;
  criado_em: string;
}

export interface Sighting {
  id: number;
  desaparecido_id: number;
  reportado_por: number;
  descricao: string;
  local: string;
  latitude: number;
  longitude: number;
  data_avistamento: string;
  foto?: string;
  verificado: boolean;
  criado_em: string;
}

export interface EmergencyContact {
  id: number;
  nome: string;
  numero: string;
  tipo: 'policia' | 'bombeiros' | 'protecao_civil' | 'hospital' | 'outro';
  provincia: string;
}
