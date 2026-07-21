# BlockVote Front

Frontend (React + Vite + Tailwind) del sistema de votación institucional
sobre blockchain, migrado desde el mockup HTML/JS estático a una SPA modular.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
├── App.jsx                 # Composición de providers + rutas
├── main.jsx                 # Entry point (ReactDOM.createRoot)
├── context/                  # Estado global vía React Context
│   ├── AuthContext.jsx        # Sesión del elector autenticado
│   └── NetworkContext.jsx     # Altura de bloque / nodos activos (header)
├── views/                    # Una carpeta por vista, con sus subcomponentes
│   ├── Login/
│   │   ├── LoginView.jsx
│   │   └── components/ (LoginForm)
│   ├── Voting/
│   │   ├── VotingView.jsx
│   │   └── components/ (CandidateCard, SigningModal, VotedBlocker)
├── repositories/              # Capa de acceso a datos (patrón repository)
│   ├── authRepository.js       # Login/logout, credenciales demo
│   ├── votingRepository.js     # Candidatos, emisión de voto
├── services/
│   └── apiClient.js            # Instancia axios centralizada + interceptores
├── shared/                    # Utilidades y componentes reutilizables
│   ├── components/ (Header, Footer, ToastContainer)
│   ├── hooks/ (useToast)
│   └── utils/ (formatters)
└── styles/
    └── index.css               # Tailwind + estilos globales (scrollbar, etc.)
```

## Patrón repository

Cada vista se comunica con la API únicamente a través de su repositorio
correspondiente (`authRepository`, `votingRepository`).
Ningún componente llama a `axios`/`fetch` directamente.

Para conectar el backend real, basta con:

1. Definir `VITE_API_URL` apuntando al gateway/API real.
2. Verificar que los endpoints coincidan con el backend.

## Notas de diseño

- El estilo visual (paleta, tipografía Inter, componentes) se conservó fiel
  al mockup original para no alterar la identidad ya validada del producto.
- El polling usado en la demo no forma parte de la ruta de votación principal.
