import React from 'react';
import { FunctionCategory, MySQLFunction } from '../types/functions';
import { ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

interface FunctionTableProps {
  category: FunctionCategory;
  functions: MySQLFunction[];
  onSelectFunction: (fn: MySQLFunction) => void;
  searchQuery: string;
}

export const FunctionTable: React.FC<FunctionTableProps> = ({
  category,
  functions,
  onSelectFunction,
  searchQuery
}) => {
  if (functions.length === 0) return null;

  return (
    <div className="mb-10 scroll-mt-24" id={`cat-${category.key}`}>
      {/* Category Section Header matching handwritten style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-300 gap-1.5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-cyan-700 rounded-xs"></span>
            {category.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {category.subtitle} &middot; {category.description}
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium shrink-0">
          {functions.length} fonction{functions.length > 1 ? 's' : ''} répertoriée{functions.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* The 2-Column Table matching Image 1: [ syntaxe | rôle ] */}
      <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th scope="col" className="py-3 px-4 sm:px-6 w-[40%] sm:w-[35%]">
                  Syntaxe
                  <span className="block text-[10px] text-slate-400 font-normal lowercase tracking-normal font-sans">
                    structure de l'appel
                  </span>
                </th>
                <th scope="col" className="py-3 px-4 sm:px-6 w-[50%] sm:w-[55%]">
                  Rôle
                  <span className="block text-[10px] text-slate-400 font-normal lowercase tracking-normal font-sans">
                    explication & description
                  </span>
                </th>
                <th scope="col" className="py-3 px-3 w-[10%] text-right font-normal text-[11px] text-slate-400">
                  Détail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 text-sm">
              {functions.map((fn) => {
                const levelColor =
                  fn.level === 'fundamental'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : fn.level === 'intermediate'
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-rose-700 bg-rose-50 border-rose-200';

                const levelBadge =
                  fn.level === 'fundamental' ? '🟢' : fn.level === 'intermediate' ? '🟡' : '🔴';

                return (
                  <tr
                    key={fn.id}
                    onClick={() => onSelectFunction(fn)}
                    className="group cursor-pointer hover:bg-cyan-50/50 transition-colors focus-within:bg-cyan-50/60"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectFunction(fn);
                      }
                    }}
                  >
                    {/* Column 1: Syntaxe */}
                    <td className="py-3.5 px-4 sm:px-6 align-top">
                      <div className="flex items-start gap-2">
                        <span className="text-xs select-none mt-0.5 shrink-0" title={fn.level}>
                          {levelBadge}
                        </span>
                        <div className="space-y-1">
                          <code className="font-mono text-xs sm:text-sm font-semibold text-cyan-900 group-hover:text-cyan-700 break-words block">
                            {fn.syntax}
                          </code>
                          <div className="text-[11px] font-semibold text-slate-800">
                            {fn.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Rôle */}
                    <td className="py-3.5 px-4 sm:px-6 align-top text-slate-700 text-xs sm:text-sm leading-relaxed">
                      <div>{fn.role}</div>
                      {fn.cause && (
                        <div className="mt-1 text-[11px] text-amber-800 flex items-center gap-1 font-medium bg-amber-50/70 rounded px-1.5 py-0.5 w-fit">
                          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Note/Cause disponible (cliquer pour voir)</span>
                        </div>
                      )}
                    </td>

                    {/* Column 3: Action Indicator */}
                    <td className="py-3.5 px-3 align-middle text-right text-slate-400 group-hover:text-cyan-700">
                      <div className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        <span className="hidden lg:inline text-[11px]">Exemple</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
