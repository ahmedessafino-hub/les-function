import React, { useState } from 'react';
import { MySQLFunction } from '../types/functions';
import {
  X,
  Copy,
  Check,
  Play,
  AlertCircle,
  Code2,
  Terminal,
  Table as TableIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FunctionModalProps {
  fn: MySQLFunction | null;
  onClose: () => void;
  onTestInSimulator: (sql: string) => void;
}

export const FunctionModal: React.FC<FunctionModalProps> = ({
  fn,
  onClose,
  onTestInSimulator
}) => {
  const [copiedExample, setCopiedExample] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  if (!fn) return null;

  const handleCopyExample = () => {
    navigator.clipboard.writeText(fn.example);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(fn.result);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const levelBadge =
    fn.level === 'fundamental'
      ? { text: 'Niveau Fondamental 🟢', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
      : fn.level === 'intermediate'
      ? { text: 'Niveau Intermédiaire 🟡', color: 'bg-amber-50 text-amber-800 border-amber-200' }
      : { text: 'Niveau Avancé 🔴', color: 'bg-rose-50 text-rose-800 border-rose-200' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-7 text-slate-900 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${levelBadge.color}`}>
                {levelBadge.text}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {fn.category.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 font-mono flex items-center gap-2">
              {fn.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exemple, résultat d'exécution et cause détaillée selon le schéma
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Syntaxe & Rôle */}
        <div className="space-y-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Syntaxe officielle
            </span>
            <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg font-mono text-sm font-semibold text-cyan-900 select-all">
              {fn.syntax}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Rôle / Description
            </span>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
              {fn.role}
            </p>
          </div>
        </div>

        {/* THE MAIN BOX MATCHING HANDWRITTEN IMAGE 2 */}
        {/* Box containing: Exemple: , résultat: , cause de la fonction : Null + 10 (si existe ecrire, else n'est pas écrit) */}
        <div className="border-2 border-slate-800 rounded-xl p-4 sm:p-5 bg-slate-900 text-white shadow-md space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Résultat d'exécution MySQL
            </span>
            <span className="text-[11px] text-slate-400">
              Conforme au schéma manuscrit
            </span>
          </div>

          {/* 1. Exemple : */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <span>Exemple :</span>
              </label>
              <button
                onClick={handleCopyExample}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {copiedExample ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedExample ? 'Copié !' : 'Copier SQL'}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm text-emerald-400 overflow-x-auto">
              <code>{fn.example}</code>
            </div>
          </div>

          {/* 2. Résultat : */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Résultat :
              </label>
              <button
                onClick={handleCopyResult}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {copiedResult ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedResult ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm text-amber-300 font-semibold whitespace-pre-wrap">
              {fn.result}
            </div>
          </div>

          {/* 3. Cause de la fonction : (SI EXISTE ECRIRE, ELSE N'EST PAS ÉCRIT) */}
          {fn.cause ? (
            <div className="pt-2 border-t border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Cause de la fonction / Explication :
              </label>
              <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-lg text-xs sm:text-sm text-rose-200 leading-relaxed">
                {fn.cause}
              </div>
            </div>
          ) : null}
        </div>

        {/* Practical Table Example (if available) */}
        {fn.tableExample && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <TableIcon className="w-4 h-4 text-cyan-700" />
              Exemple avec une table MySQL :
            </div>
            {fn.tableExample.schema && (
              <div className="text-[11px] font-mono text-slate-500">
                Table: {fn.tableExample.schema}
              </div>
            )}
            <div className="p-2.5 bg-white border border-slate-200 rounded font-mono text-xs text-slate-800 overflow-x-auto">
              {fn.tableExample.query}
            </div>
            <div className="text-xs text-slate-600 bg-slate-100 p-2 rounded font-mono">
              &rarr; {fn.tableExample.output}
            </div>
            {fn.tableExample.explanation && (
              <p className="text-xs text-slate-500 mt-1">
                {fn.tableExample.explanation}
              </p>
            )}
          </div>
        )}

        {/* Tips / Pièges */}
        {fn.tips && fn.tips.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Conseils & Pièges d'examen OFPPT
            </span>
            <ul className="space-y-1 text-xs text-slate-600">
              {fn.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-600 font-bold shrink-0">&bull;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button: Test in live simulator */}
        <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              onTestInSimulator(fn.example);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Tester dans le Simulateur SQL
          </button>
        </div>
      </div>
    </div>
  );
};
