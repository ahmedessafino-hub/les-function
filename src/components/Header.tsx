import React from 'react';
import { Database, BookOpen, AlertTriangle, Terminal, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenTraps: () => void;
  onOpenStoredInfo: () => void;
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTraps,
  onOpenStoredInfo,
  onOpenSimulator
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark / Brand */}
          <a href="#" className="flex items-center gap-2.5 text-slate-900 group">
            <div className="w-9 h-9 rounded-lg bg-cyan-700 flex items-center justify-center text-white shadow-sm group-hover:bg-cyan-800 transition-colors">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-tight">
                MySQL Functions Hub
              </span>
              <span className="text-[11px] font-medium text-slate-500 block -mt-0.5">
                Guide Complet OFPPT &middot; Fonctions MySQL
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#definition" className="hover:text-cyan-700 transition-colors">
              Définition
            </a>
            <a href="#categories" className="hover:text-cyan-700 transition-colors">
              Tableaux des fonctions
            </a>
            <button
              onClick={onOpenTraps}
              className="flex items-center gap-1.5 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Pièges d'examen
            </button>
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 hover:text-cyan-700 transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-cyan-600" />
              Simulateur SQL
            </button>
            <button
              onClick={onOpenStoredInfo}
              className="hover:text-cyan-700 transition-colors text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md text-slate-700 cursor-pointer"
            >
              Fonctions stockées ?
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenTraps}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              10 Pièges d'Examen
            </button>
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 shadow-sm transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              Tester SQL
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
