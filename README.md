# KULONDA - Encontra Angola

Plataforma humanitária para localização de pessoas desaparecidas em Angola.

## Pré-requisitos

Antes de começar, você vai precisar ter instalado em seu MacBook:
- [Node.js](https://nodejs.org/) (Versão 18 ou superior)
- [Git](https://git-scm.com/) (Opcional, para clonar)

## Como rodar localmente

1. **Baixe o projecto**:
   - Copie todos os ficheiros do projecto para uma pasta no seu Mac.

2. **Instale as dependências**:
   Abra o Terminal na pasta do projecto e execute:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   - Crie um ficheiro chamado `.env` na raiz do projecto.
   - Adicione a sua chave da API do Gemini:
     ```env
     GEMINI_API_KEY=sua_chave_aqui
     JWT_SECRET=uma_chave_secreta_qualquer
     ```

4. **Inicie o servidor de desenvolvimento**:
   No terminal, execute:
   ```bash
   npm run dev
   ```

5. **Aceda à aplicação**:
   Abra o seu navegador e vá para: `http://localhost:3000`

## Estrutura do Projecto

- `server.ts`: Servidor Express (Backend) e integração com Vite.
- `src/`: Código fonte do Frontend (React + Tailwind).
- `kulonda.db`: Base de dados SQLite (será criada automaticamente ao rodar).

## Scripts Disponíveis

- `npm run dev`: Inicia o backend e o frontend em modo de desenvolvimento.
- `npm run build`: Cria a versão de produção do frontend.
- `npm start`: Inicia o servidor em modo de produção (após o build).
