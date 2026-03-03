import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Initialization (SQLite for dev)
const db = new Database("kulonda.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    tipo TEXT NOT NULL,
    provincia TEXT,
    status TEXT DEFAULT 'activo',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS desaparecidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nome_completo TEXT NOT NULL,
    data_nascimento TEXT NOT NULL,
    genero TEXT NOT NULL,
    cor_pele TEXT NOT NULL,
    foto_principal TEXT NOT NULL,
    data_desaparecimento TEXT NOT NULL,
    local_desaparecimento TEXT NOT NULL,
    latitude_desaparecimento REAL,
    longitude_desaparecimento REAL,
    provincia TEXT NOT NULL,
    municipio TEXT NOT NULL,
    circunstancias TEXT NOT NULL,
    contacto_emergencia TEXT NOT NULL,
    estado TEXT DEFAULT 'desaparecido',
    aprovado INTEGER DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS avistamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    desaparecido_id INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    local TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    data_avistamento TEXT NOT NULL,
    verificado INTEGER DEFAULT 0,
    FOREIGN KEY (desaparecido_id) REFERENCES desaparecidos(id)
  );
`);

// Seed Data
const userCount = db.prepare("SELECT COUNT(*) as count FROM usuarios").get() as any;
if (userCount.count === 0) {
  const hashedAdmin = bcrypt.hashSync("admin123", 10);
  const hashedUser = bcrypt.hashSync("user123", 10);
  
  db.prepare("INSERT INTO usuarios (nome, email, senha, tipo, provincia) VALUES (?, ?, ?, ?, ?)").run("Admin Kulonda", "admin@kulonda.ao", hashedAdmin, "admin", "Luanda");
  const userId = db.prepare("INSERT INTO usuarios (nome, email, senha, tipo, provincia) VALUES (?, ?, ?, ?, ?)").run("Maria Santos", "maria@email.com", hashedUser, "familia", "Luanda").lastInsertRowid;

  db.prepare(`
    INSERT INTO desaparecidos (usuario_id, nome_completo, data_nascimento, genero, cor_pele, foto_principal, data_desaparecimento, local_desaparecimento, latitude_desaparecimento, longitude_desaparecimento, provincia, municipio, circunstancias, contacto_emergencia)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId, 
    "António Manuel", 
    "2015-05-10", 
    "masculino", 
    "Negra", 
    "https://picsum.photos/seed/child1/400/500", 
    "2024-02-20 14:30:00", 
    "Mercado do Roque Santeiro", 
    -8.8089, 
    13.2567,
    "Luanda", 
    "Sambizanga", 
    "Desapareceu enquanto a mãe fazia compras.", 
    "923-000-000"
  );

  db.prepare(`
    INSERT INTO desaparecidos (usuario_id, nome_completo, data_nascimento, genero, cor_pele, foto_principal, data_desaparecimento, local_desaparecimento, latitude_desaparecimento, longitude_desaparecimento, provincia, municipio, circunstancias, contacto_emergencia)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId, 
    "Helena Vunge", 
    "2002-11-15", 
    "feminino", 
    "Mestiça", 
    "https://picsum.photos/seed/girl1/400/500", 
    "2024-03-01 18:00:00", 
    "Ilha de Luanda", 
    -8.7945, 
    13.2234,
    "Luanda", 
    "Ingombota", 
    "Vista pela última vez na zona dos restaurantes da Ilha.", 
    "931-111-222"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post("/api/auth/register", async (req, res) => {
    const { nome, email, senha, tipo, provincia } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);
    try {
      const stmt = db.prepare("INSERT INTO usuarios (nome, email, senha, tipo, provincia) VALUES (?, ?, ?, ?, ?)");
      const info = stmt.run(nome, email, hashedSenha, tipo, provincia);
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (error) {
      res.status(400).json({ message: "Email já registado" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, senha } = req.body;
    const user: any = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo } });
  });

  app.get("/api/casos", (req, res) => {
    const casos = db.prepare("SELECT * FROM desaparecidos WHERE aprovado = 1 ORDER BY id DESC").all();
    res.json(casos);
  });

  app.get("/api/casos/:id", (req, res) => {
    const caso = db.prepare("SELECT * FROM desaparecidos WHERE id = ?").get(req.params.id);
    if (!caso) return res.status(404).json({ message: "Caso não encontrado" });
    const avistamentos = db.prepare("SELECT * FROM avistamentos WHERE desaparecido_id = ?").all(req.params.id);
    res.json({ ...caso, avistamentos });
  });

  app.post("/api/casos", authenticateToken, (req: any, res) => {
    const { nome_completo, data_nascimento, genero, cor_pele, foto_principal, data_desaparecimento, local_desaparecimento, latitude_desaparecimento, longitude_desaparecimento, provincia, municipio, circunstancias, contacto_emergencia } = req.body;
    const stmt = db.prepare(`
      INSERT INTO desaparecidos (usuario_id, nome_completo, data_nascimento, genero, cor_pele, foto_principal, data_desaparecimento, local_desaparecimento, latitude_desaparecimento, longitude_desaparecimento, provincia, municipio, circunstancias, contacto_emergencia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(req.user.id, nome_completo, data_nascimento, genero, cor_pele, foto_principal, data_desaparecimento, local_desaparecimento, latitude_desaparecimento, longitude_desaparecimento, provincia, municipio, circunstancias, contacto_emergencia);
    res.status(201).json({ id: info.lastInsertRowid });
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { email } = req.body;
    const user = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
    if (!user) return res.status(404).json({ message: "Utilizador não encontrado" });
    
    // In a real app, we would generate a token and send an email
    console.log(`Simulação: Link de recuperação enviado para ${email}`);
    res.json({ message: "Link de recuperação enviado para o seu email" });
  });

  app.get("/api/contactos-emergencia", (req, res) => {
    const contactos = [
      { id: 1, nome: 'Polícia Nacional', numero: '113', tipo: 'policia', provincia: 'Nacional' },
      { id: 2, nome: 'Bombeiros', numero: '115', tipo: 'bombeiros', provincia: 'Nacional' },
      { id: 3, nome: 'Emergência Médica', numero: '117', tipo: 'hospital', provincia: 'Nacional' },
      { id: 4, nome: 'Protecção Civil', numero: '118', tipo: 'protecao_civil', provincia: 'Nacional' },
      { id: 5, nome: 'Linha de Apoio à Criança', numero: '15011', tipo: 'outro', provincia: 'Nacional' }
    ];
    res.json(contactos);
  });

  app.post("/api/contacto", (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;
    console.log(`Novo contacto recebido de ${nome} (${email}): ${assunto} - ${mensagem}`);
    res.json({ message: "Mensagem enviada com sucesso! Entraremos em contacto em breve." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KULONDA Server running on http://localhost:${PORT}`);
  });
}

startServer();
