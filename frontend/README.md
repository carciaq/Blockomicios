# BlockVote Front

Frontend (React + Vite + Tailwind) del sistema de votación institucional
sobre blockchain, migrado desde el mockup HTML/JS estático a una SPA modular.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación y ejecución

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL cuando exista backend real
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
│   │   └── components/ (LoginForm, DemoPanel)
│   ├── Voting/
│   │   ├── VotingView.jsx
│   │   └── components/ (CandidateCard, SigningModal, VotedBlocker)
│   └── Dashboard/
│       ├── DashboardView.jsx
│       └── components/ (KpiCards, ResultsChart, TransactionLedger)
├── repositories/              # Capa de acceso a datos (patrón repository)
│   ├── authRepository.js       # Login/logout, credenciales demo
│   ├── votingRepository.js     # Candidatos, emisión de voto
│   └── dashboardRepository.js  # Resultados, ledger, verificación de hash
├── services/
│   └── apiClient.js            # Instancia axios centralizada + interceptores
├── shared/                    # Utilidades y componentes reutilizables
│   ├── components/ (Header, Footer, ToastContainer)
│   ├── hooks/ (useToast)
│   └── utils/ (formatters, mockData)
└── styles/
    └── index.css               # Tailwind + estilos globales (scrollbar, etc.)
```

## Patrón repository y modo mock

Cada vista se comunica con la API únicamente a través de su repositorio
correspondiente (`authRepository`, `votingRepository`, `dashboardRepository`).
Ningún componente llama a `axios`/`fetch` directamente.

Mientras el backend blockchain no esté disponible, los repositorios operan
en **modo mock** (controlado por `VITE_USE_MOCKS=true` en `.env`): simulan
latencia de red y devuelven datos de ejemplo, manteniendo exactamente la
misma firma de función que usarán contra la API real. Para conectar el
backend real, basta con:

1. Definir `VITE_API_URL` apuntando al gateway/API real.
2. Poner `VITE_USE_MOCKS=false`.
3. Verificar que los endpoints (documentados como comentarios en cada método
   de los repositorios) coincidan con el contrato real del backend.

## Notas de diseño

- El estilo visual (paleta, tipografía Inter, componentes) se conservó fiel
  al mockup original para no alterar la identidad ya validada del producto.
- El polling usado en el dashboard para "tiempo real" (`generateMockVoteBatch`)
  es solo para la demo; en producción se recomienda reemplazarlo por
  WebSockets o Server-Sent Events, dejando `dashboardRepository` como único
  punto de integración a modificar.
