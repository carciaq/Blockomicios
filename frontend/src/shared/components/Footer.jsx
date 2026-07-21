/** Pie de página institucional, común a toda la aplicación. */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-6 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono gap-2">
        <span>© 2026 BlockVote Protocol v2.0.1. Registro Oficial de Cómputo Digital.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-blue-600 transition font-bold">
            Código de Auditoría
          </a>
          <span>•</span>
          <a href="#" className="hover:text-blue-600 transition font-bold">
            Documentación Técnica (ZKP)
          </a>
          <span>•</span>
          <span className="text-emerald-600 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Nodos En Línea
          </span>
        </div>
      </div>
    </footer>
  );
}
