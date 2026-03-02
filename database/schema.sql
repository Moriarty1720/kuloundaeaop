-- KULONDA – ENCONTRA-ANGOLA
-- Schema MySQL Completo

CREATE DATABASE IF NOT EXISTS kulonda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kulonda;

-- TABELA: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('admin', 'autoridade', 'familia', 'cidadao') NOT NULL,
  foto VARCHAR(255) DEFAULT NULL,
  google_id VARCHAR(255) DEFAULT NULL,
  telefone VARCHAR(20) DEFAULT NULL,
  provincia VARCHAR(100) DEFAULT NULL,
  status ENUM('activo', 'suspenso', 'pendente') DEFAULT 'activo',
  push_token TEXT DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- TABELA: desaparecidos
CREATE TABLE IF NOT EXISTS desaparecidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  nome_completo VARCHAR(200) NOT NULL,
  data_nascimento DATE NOT NULL,
  genero ENUM('masculino', 'feminino', 'outro') NOT NULL,
  altura DECIMAL(5,2) DEFAULT NULL,
  peso DECIMAL(5,2) DEFAULT NULL,
  cor_pele VARCHAR(50) NOT NULL,
  cor_olhos VARCHAR(50) DEFAULT NULL,
  cor_cabelo VARCHAR(50) DEFAULT NULL,
  sinais_particulares TEXT DEFAULT NULL,
  ultima_roupa TEXT DEFAULT NULL,
  foto_principal VARCHAR(255) NOT NULL,
  fotos_adicionais JSON DEFAULT NULL,
  data_desaparecimento DATETIME NOT NULL,
  local_desaparecimento VARCHAR(300) NOT NULL,
  latitude_desaparecimento DECIMAL(10,8) DEFAULT NULL,
  longitude_desaparecimento DECIMAL(11,8) DEFAULT NULL,
  provincia VARCHAR(100) NOT NULL,
  municipio VARCHAR(100) NOT NULL,
  circunstancias TEXT NOT NULL,
  contacto_emergencia VARCHAR(200) NOT NULL,
  estado ENUM('desaparecido', 'em_investigacao', 'encontrado', 'encerrado') DEFAULT 'desaparecido',
  aprovado TINYINT(1) DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TABELA: avistamentos
CREATE TABLE IF NOT EXISTS avistamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  desaparecido_id INT NOT NULL,
  reportado_por INT NOT NULL,
  descricao TEXT NOT NULL,
  local VARCHAR(300) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  data_avistamento DATETIME NOT NULL,
  foto VARCHAR(255) DEFAULT NULL,
  verificado TINYINT(1) DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (desaparecido_id) REFERENCES desaparecidos(id) ON DELETE CASCADE,
  FOREIGN KEY (reportado_por) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TABELA: notificacoes
CREATE TABLE IF NOT EXISTS notificacoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo ENUM('avistamento', 'actualizacao', 'novo_caso', 'sistema', 'alerta') NOT NULL,
  lida TINYINT(1) DEFAULT 0,
  link VARCHAR(255) DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TABELA: historico_casos
CREATE TABLE IF NOT EXISTS historico_casos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  desaparecido_id INT NOT NULL,
  usuario_id INT NOT NULL,
  acao VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  estado_anterior VARCHAR(50) DEFAULT NULL,
  estado_novo VARCHAR(50) DEFAULT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (desaparecido_id) REFERENCES desaparecidos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TABELA: autoridades
CREATE TABLE IF NOT EXISTS autoridades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL UNIQUE,
  numero_identificacao VARCHAR(50) NOT NULL,
  unidade_policial VARCHAR(200) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  provincia VARCHAR(100) NOT NULL,
  aprovado TINYINT(1) DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TABELA: contactos_emergencia
CREATE TABLE IF NOT EXISTS contactos_emergencia (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  numero VARCHAR(30) NOT NULL,
  tipo ENUM('policia', 'bombeiros', 'protecao_civil', 'hospital', 'outro') NOT NULL,
  provincia VARCHAR(100) NOT NULL,
  activo TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- Índices para performance
CREATE INDEX idx_desaparecidos_provincia ON desaparecidos(provincia);
CREATE INDEX idx_desaparecidos_estado ON desaparecidos(estado);
CREATE INDEX idx_avistamentos_desaparecido ON avistamentos(desaparecido_id);
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
