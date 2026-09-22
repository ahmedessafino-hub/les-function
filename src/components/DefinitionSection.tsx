import React from 'react';
import { ArrowRight, HelpCircle, CheckCircle2, AlertOctagon, Lightbulb } from 'lucide-react';

interface DefinitionSectionProps {
  onOpenStoredInfo: () => void;
}

export const DefinitionSection: React.FC<DefinitionSectionProps> = ({ onOpenStoredInfo }) => {
  return (
    <section id="definition" className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Handwritten Style Header Badge & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-700 mb-1">
            <span>Cours OFPPT &middot; Partie 1</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-slate-500 font-normal">Concepts fondamentaux des fonctions MySQL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Les fonctions MySQL
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-3xl leading-relaxed">
            Référence exhaustive des fonctions natives MySQL selon les programmes d'études OFPPT / Développement Web.
          </p>
        </div>

        {/* The Handwritten Concept Box: "Définition de fonction :" */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                Définition de fonction :
              </h2>
              <p className="mt-2 text-slate-700 leading-relaxed max-w-2xl text-sm sm:text-base">
                Une <strong>fonction MySQL</strong> est une opération qui reçoit éventuellement un ou plusieurs
                arguments en entrée, effectue un traitement de calcul ou de transformation, et <strong>retourne obligatoirement une valeur unique</strong>.
              </p>
            </div>
            
            {/* Visual Schema: argument -> FONCTION -> résultat */}
            <div className="w-full sm:w-auto bg-white border border-slate-200 rounded-lg p-4 shrink-0 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Schéma de fonctionnement
              </div>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono">
                <div className="px-2.5 py-1.5 bg-slate-100 rounded text-slate-700 border border-slate-200">
                  'ahmed'
                  <span className="block text-[10px] text-slate-400 font-sans">argument</span>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-600 shrink-0" />
                <div className="px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded font-bold text-cyan-800">
                  UPPER(...)
                  <span className="block text-[10px] text-cyan-600 font-sans font-normal">fonction</span>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-600 shrink-0" />
                <div className="px-2.5 py-1.5 bg-emerald-50 rounded text-emerald-800 border border-emerald-200 font-bold">
                  'AHMED'
                  <span className="block text-[10px] text-emerald-600 font-sans font-normal">résultat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Principles Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 text-xs sm:text-sm">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200/80">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                Pourquoi dans SQL ?
              </div>
              <p className="text-slate-600 leading-snug">
                Effectuer les calculs et transformations directement sur le serveur MySQL au lieu de charger PHP ou JavaScript.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200/80">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1 text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                Scalaire vs Agrégation
              </div>
              <p className="text-slate-600 leading-snug">
                <strong>Scalaire</strong> donne un résultat ligne par ligne (<code className="font-mono text-cyan-700">UPPER</code>). <strong>Agrégation</strong> regroupe plusieurs lignes (<code className="font-mono text-cyan-700">COUNT</code>, <code className="font-mono text-cyan-700">AVG</code>).
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200/80">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1 text-sm">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                Comportement de NULL
              </div>
              <p className="text-slate-600 leading-snug">
                <code className="font-mono text-amber-800">NULL + 10 = NULL</code> car MySQL ne connaît pas la valeur de NULL. Utilisez <code className="font-mono text-amber-800">IFNULL()</code> ou <code className="font-mono text-amber-800">COALESCE()</code>.
              </p>
            </div>
          </div>

          {/* Note explaining "Ila la function stock" (Pourquoi pas les fonctions stockées dans les tableaux) */}
          <div className="mt-5 p-3.5 bg-cyan-50/60 border border-cyan-200/70 rounded-lg flex items-start gap-3 text-xs sm:text-sm text-cyan-950">
            <Lightbulb className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-cyan-900">Règle importante pour ces tableaux (Sauf les fonctions stockées) :</strong> Les tableaux ci-dessous répertorient l'ensemble exhaustif des <strong>fonctions natives intégrées (Built-in)</strong> de MySQL. Les <em>fonctions stockées</em> (<code className="font-mono bg-cyan-100/70 px-1 py-0.5 rounded text-cyan-900">CREATE FUNCTION ...</code>) sont créées sur-mesure par le développeur et ne font pas partie des fonctions natives standards du serveur.
              <button
                onClick={onOpenStoredInfo}
                className="ml-2 font-semibold underline hover:text-cyan-800 cursor-pointer inline-block"
              >
                Comprendre la différence &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
