# Documentação do VisionToSmell

[English Documentation](README.md) | **Documentação em Português**

## Visão Geral do Projeto

Video-converte é uma aplicação web full-stack projetada para converter arquivos de vídeo para formato de áudio (MP3). A aplicação consiste em:

- **Backend**: Uma API REST Node.js/Express que gerencia uploads de arquivos, conversão de vídeo para áudio e armazena o histórico de conversões
- **Frontend**: Uma aplicação React com Tailwind CSS para estilização que fornece uma interface amigável para upload de vídeos e download dos arquivos de áudio convertidos

A aplicação permite aos usuários:
1. Fazer upload de arquivos de vídeo (formatos suportados: MP4, AVI, MOV, MKV, FLV, WMV)
2. Converter vídeos para formato de áudio MP3
3. Visualizar o histórico de conversões
4. Baixar os arquivos de áudio convertidos

## Requisitos do Sistema

- Node.js (v14 ou superior recomendado)
- Banco de dados MongoDB (local ou instância na nuvem via Atlas)
- FFmpeg instalado e configurado corretamente no PATH do sistema

## Dependências

### Dependências do Backend
- **express**: Framework para servidor web
- **mongoose**: Modelagem de objetos para MongoDB
- **fluent-ffmpeg**: Wrapper Node.js para FFmpeg
- **multer**: Middleware para manipulação de uploads de arquivos
- **cors**: Compartilhamento de recursos de origem cruzada
- **dotenv**: Gerenciamento de variáveis de ambiente
- **express-validator**: Validação de entrada
- **morgan**: Logger de requisições HTTP
- **uuid**: Geração de IDs únicos

### Dependências do Frontend
- **react**: Biblioteca de UI
- **axios**: Cliente HTTP
- **react-icons**: Biblioteca de ícones
- **react-toastify**: Notificações toast
- **tailwindcss**: Framework CSS utilitário

### Dependências de Desenvolvimento do Projeto Raiz
- **concurrently**: Permite executar múltiplos comandos simultaneamente (usado para iniciar backend e frontend juntos)

## Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/Luquitoos/VisionToSmell.git
cd Video-converte
```

### 2. Instalando FFmpeg

FFmpeg é uma dependência crítica para este projeto, pois realiza a conversão de vídeo para áudio.

#### Windows
1. Baixe o FFmpeg do [site oficial](https://ffmpeg.org/download.html) ou use a [build gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
2. Extraia o arquivo zip baixado para um local como `C:\ffmpeg`
3. Adicione o FFmpeg ao PATH do sistema:
   - Clique com o botão direito em "Este Computador" e selecione "Propriedades"
   - Clique em "Configurações avançadas do sistema"
   - Clique em "Variáveis de ambiente"
   - Em "Variáveis do sistema", encontre a variável "Path" e clique em "Editar"
   - Clique em "Novo" e adicione o caminho para o diretório bin do FFmpeg (ex: `C:\ffmpeg\bin`)
   - Clique em "OK" em todas as caixas de diálogo para salvar as alterações
4. Verifique a instalação abrindo o Prompt de Comando e digitando:
   ```
   ffmpeg -version
   ```
   OU https://www.youtube.com/watch?v=mEV5ZRqaWu8 (Alternativa mais facil)

#### macOS (usando Homebrew)
```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

### 3. Configure o MongoDB

1. Instale o MongoDB localmente ou crie um cluster gratuito no MongoDB Atlas
2. Obtenha sua URI de conexão do MongoDB

### 4. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=sua_uri_de_conexão_mongoDB
MAX_FILE_SIZE=104857600
```

### 5. Instale as Dependências

#### Instale a Dependência Concurrently no Diretório Raiz
```bash
npm install --save-dev concurrently
```

#### Instale as Dependências do Backend
```bash
cd backend
npm install
cd ..
```

#### Instale as Dependências do Frontend
```bash
cd frontend
npm install
cd ..
```

## Iniciando a Aplicação

Existem três maneiras de iniciar a aplicação:

### 1. Iniciar Backend e Frontend Simultaneamente (Recomendado)

No diretório raiz do projeto, execute:
```bash
npm start
```

Este comando utilizará o pacote concurrently para iniciar tanto o servidor backend quanto o servidor frontend em paralelo.

### 2. Iniciar o Servidor Backend Separadamente

```bash
cd backend
npm run dev
```

O servidor backend iniciará na porta 5000 (ou na porta especificada no seu arquivo `.env`).

### 3. Iniciar o Servidor de Desenvolvimento Frontend Separadamente

```bash
cd frontend
npm start
```

O servidor de desenvolvimento frontend iniciará na porta 3000 e deverá abrir automaticamente no seu navegador.

## Estrutura do Projeto

```
Video-converte/
├── backend/                  # Backend Node.js/Express
│   ├── config/               # Arquivos de configuração
│   ├── controllers/          # Controladores de rotas
│   ├── middleware/           # Middleware personalizado
│   ├── models/               # Modelos Mongoose
│   ├── services/             # Lógica de negócios
│   ├── utils/                # Funções utilitárias
│   ├── app.js                # Configuração do app Express
│   └── server.js             # Ponto de entrada do servidor
├── frontend/                 # Frontend React
│   ├── public/               # Arquivos estáticos
│   └── src/                  # Arquivos fonte React
│       ├── components/       # Componentes reutilizáveis
│       ├── context/          # Context React
│       ├── pages/            # Componentes de página
│       ├── services/         # Serviços de API
│       └── utils/            # Funções utilitárias
├── uploads/                  # Armazenamento temporário para vídeos enviados
└── converted/                # Armazenamento para arquivos de áudio convertidos
```

## Uso

1. Acesse a aplicação através do seu navegador web em `http://localhost:3000`
2. Faça upload de um arquivo de vídeo usando o formulário de upload (formatos suportados: MP4, AVI, MOV, MKV, FLV, WMV)
3. Aguarde a conclusão do processo de conversão
4. Baixe o arquivo MP3 convertido

## Armazenamento de Arquivos

- Arquivos de vídeo enviados são armazenados temporariamente no diretório `uploads/`
- Arquivos de áudio convertidos são armazenados no diretório `converted/`
- Histórico de conversões e metadados de arquivos são armazenados no MongoDB
- Se você perder um arquivo convertido localmente, pode recuperá-lo do histórico de conversões desde que o registro no banco de dados exista

## Limitações

- Tamanho máximo de arquivo: 100MB (configurado em `backend/config/config.js`)
- Formatos de vídeo suportados: MP4, AVI, MOV, MKV, FLV, WMV
- Formato de saída: somente MP3

## Solução de Problemas

### FFmpeg Não Encontrado

Se você receber um erro sobre o FFmpeg não ser encontrado:

1. Verifique se o FFmpeg está instalado executando `ffmpeg -version` no seu terminal/prompt de comando
2. Certifique-se de que o FFmpeg está corretamente adicionado ao PATH do seu sistema
3. Reinicie seu terminal/prompt de comando e a aplicação

### Problemas de Conexão com MongoDB

Se a aplicação falhar ao conectar ao MongoDB:

1. Verifique sua string de conexão MongoDB no arquivo `.env`
2. Certifique-se de que seu servidor MongoDB está rodando ou o cluster Atlas está acessível
3. Verifique configurações de rede e regras de firewall

### Problemas de Upload de Arquivos

Se os uploads de arquivos falharem:

1. Verifique se o arquivo não excede o limite de tamanho de 100MB
2. Verifique se o formato do arquivo é suportado
3. Certifique-se de que os diretórios `uploads/` e `converted/` existem e têm permissões de escrita

## Notas de Desenvolvimento

- O backend usa módulos ES (type: "module" no package.json)
- O frontend usa Create React App com Tailwind CSS
- A aplicação usa um design responsivo com tema de cores personalizado
- Os testes são escritos usando Jest para o backend e React Testing Library para o frontend
