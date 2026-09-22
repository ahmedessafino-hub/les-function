import React from 'react';
import { X, BookOpen, Code2, Check, ArrowRight, Lightbulb, Database } from 'lucide-react';

interface StoredFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoredFunctionModal: React.FC<StoredFunctionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-7 text-slate-900 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-700 text-white flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                Pourquoi exclure les Fonctions Stockées des Tableaux ?
              </h3>
              <p className="text-xs text-slate-500">
                Élucidation de la consigne : « dire fi tableaux 4ire les function ila la function stock »
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Categories of MySQL Functions */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Dans le moteur MySQL et selon le programme OFPPT (Partie 1 & Partie 17), il existe <strong>3 catégories fondamentales</strong> d'éléments appelés "fonctions" :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <div className="font-bold text-emerald-900 text-sm flex items-center gap-1">
                <span>1. Built-in (Intégrées)</span>
              </div>
              <p className="text-emerald-800 text-xs">
                Fournies <strong>par défaut</strong> avec MySQL (ex: <code className="font-mono">ROUND()</code>, <code className="font-mono">IF()</code>, <code className="font-mono">NOW()</code>). C'est exactement le contenu de nos tableaux !
              </p>
            </div>

            <div className="p-3.5 bg-cyan-50/70 border border-cyan-200 rounded-xl space-y-1">
              <div className="font-bold text-cyan-900 text-sm flex items-center gap-1">
                <span>2. Stored Functions</span>
              </div>
              <p className="text-cyan-800 text-xs">
                Créées <strong>par le développeur</strong> avec <code className="font-mono">CREATE FUNCTION</code>. Elles sont enregistrées dans la base de données.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <div className="font-bold text-amber-900 text-sm flex items-center gap-1">
                <span>3. UDF (Loadable)</span>
              </div>
              <p className="text-amber-800 text-xs">
                Fonctions externes développées en C/C++ et chargées dynamiquement dans le serveur MySQL.
              </p>
            </div>
          </div>

          {/* Stored Function Syntax Example */}
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              Exemple de Fonction Stockée (Stored Function) :
            </div>
            <pre className="font-mono text-xs text-emerald-400 overflow-x-auto p-2 bg-slate-950 rounded">
{`DELIMITER //

CREATE FUNCTION doubler(n INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE resultat INT;
    SET resultat = n * 2;
    RETURN resultat;
END//

DELIMITER ;

-- Utilisation dans un SELECT :
SELECT doubler(15); -- Retourne 30`}
            </pre>
          </div>

          {/* Comparison Table: Stored Function vs Stored Procedure */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 p-2.5 font-bold text-slate-800 text-xs uppercase tracking-wider">
              Différence clé : Stored Function vs Stored Procedure
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-2.5">Critère</th>
                  <th className="p-2.5">Stored Function</th>
                  <th className="p-2.5">Stored Procedure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">Mot-clé création</td>
                  <td className="p-2.5 font-mono text-cyan-800">CREATE FUNCTION</td>
                  <td className="p-2.5 font-mono text-slate-800">CREATE PROCEDURE</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">Méthode d'appel</td>
                  <td className="p-2.5 font-mono text-cyan-800">SELECT ma_fonction(...)</td>
                  <td className="p-2.5 font-mono text-slate-800">CALL ma_procedure(...)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">Valeur de retour</td>
                  <td className="p-2.5 text-emerald-700 font-semibold">OBLIGATOIRE (RETURN)</td>
                  <td className="p-2.5 text-slate-600">Optionnel via paramètres OUT</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">Dans une expression</td>
                  <td className="p-2.5 text-emerald-700 font-semibold">OUI (SELECT, WHERE, etc.)</td>
                  <td className="p-2.5 text-rose-700 font-semibold">NON (doit être appelée seule)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
