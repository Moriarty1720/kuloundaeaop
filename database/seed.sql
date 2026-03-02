-- KULONDA – ENCONTRA-ANGOLA
-- Seed Data Inicial

USE kulonda;

-- Inserir Administrador (Senha: admin123)
INSERT INTO usuarios (nome, email, senha, tipo, provincia, status)
VALUES ('Admin Kulonda', 'admin@kulonda.ao', '$2a$12$R9h/lIPzHZ75XYmHEyUcxuS.XvK6.f9f.W.f.f.f.f.f.f.f.f.f.', 'admin', 'Luanda', 'activo');

-- Inserir Autoridades
INSERT INTO usuarios (nome, email, senha, tipo, provincia, status)
VALUES ('Inspector João Silva', 'joao.silva@policia.ao', '$2a$12$R9h/lIPzHZ75XYmHEyUcxuS.XvK6.f9f.W.f.f.f.f.f.f.f.f.f.', 'autoridade', 'Luanda', 'activo');
SET @user_autoridade_id = LAST_INSERT_ID();

INSERT INTO autoridades (usuario_id, numero_identificacao, unidade_policial, cargo, provincia, aprovado)
VALUES (@user_autoridade_id, 'PN-998877', 'Comando Provincial de Luanda', 'Inspector Chefe', 'Luanda', 1);

-- Inserir Famílias
INSERT INTO usuarios (nome, email, senha, tipo, provincia, status)
VALUES ('Maria dos Santos', 'maria@email.com', '$2a$12$R9h/lIPzHZ75XYmHEyUcxuS.XvK6.f9f.W.f.f.f.f.f.f.f.f.f.', 'familia', 'Luanda', 'activo');
SET @user_familia_id = LAST_INSERT_ID();

-- Inserir Casos de Desaparecimento
INSERT INTO desaparecidos (usuario_id, nome_completo, data_nascimento, genero, cor_pele, foto_principal, data_desaparecimento, local_desaparecimento, latitude_desaparecimento, longitude_desaparecimento, provincia, municipio, circunstancias, contacto_emergencia, estado, aprovado)
VALUES (@user_familia_id, 'António Manuel', '2015-05-10', 'masculino', 'Negra', 'https://picsum.photos/seed/child1/400/500', '2024-02-20 14:30:00', 'Mercado do Roque Santeiro', -8.8147, 13.2306, 'Luanda', 'Sambizanga', 'Desapareceu enquanto a mãe fazia compras.', '923-000-000', 'desaparecido', 1);

INSERT INTO desaparecidos (usuario_id, nome_completo, data_nascimento, genero, cor_pele, foto_principal, data_desaparecimento, local_desaparecimento, latitude_desaparecimento, longitude_desaparecimento, provincia, municipio, circunstancias, contacto_emergencia, estado, aprovado)
VALUES (@user_familia_id, 'Isabel Costa', '1998-11-22', 'feminino', 'Mestiça', 'https://picsum.photos/seed/woman1/400/500', '2024-02-25 19:00:00', 'Paragem da Mutamba', -8.8159, 13.2345, 'Luanda', 'Ingombota', 'Não regressou do trabalho no final do dia.', '931-111-222', 'em_investigacao', 1);

-- Inserir Contactos de Emergência
INSERT INTO contactos_emergencia (nome, numero, tipo, provincia) VALUES ('Polícia Nacional', '113', 'policia', 'Luanda');
INSERT INTO contactos_emergencia (nome, numero, tipo, provincia) VALUES ('Bombeiros', '115', 'bombeiros', 'Luanda');
INSERT INTO contactos_emergencia (nome, numero, tipo, provincia) VALUES ('INEMA (Emergência Médica)', '117', 'hospital', 'Luanda');
INSERT INTO contactos_emergencia (nome, numero, tipo, provincia) VALUES ('Protecção Civil', '118', 'protecao_civil', 'Luanda');
