import React from 'react';
import { AlertTriangle, X, CheckCircle2, XCircle, BookOpen } from 'lucide-react';

interface ExamTrapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (query: string) => void;
}

export const ExamTrapsModal: React.FC<ExamTrapsModalProps> = ({
  isOpen,
  onClose,
  onSelectSample
}) => {
  if (!isOpen) return null;

  const traps = [
    {
      title: "1. Tester la présence de NULL",
      bad: "WHERE salaire = NULL",
      good: "WHERE salaire IS NULL",
      explanation: "NULL représente une valeur absente/inconnue. En SQL, toute comparaison avec '=' renvoie NULL (ni vrai ni faux), donc la clause WHERE rejettera systématiquement la ligne.",
      sample: "SELECT NULL = NULL, NULL IS NULL;"
    },
    {
      title: "2. Égalité avec NULL : = vs <=>",
      bad: "SELECT NULL = NULL;  --> retourne NULL",
      good: "SELECT NULL <=> NULL; --> retourne 1 (TRUE)",
      explanation: "<=> est l'opérateur 'NULL-safe equal'. Il est conçu pour retourner 1 lorsque deux NULL sont comparés, là où '=' échoue.",
      sample: "SELECT NULL <=> NULL;"
    },
    {
      title: "3. Concaténation avec NULL : CONCAT vs CONCAT_WS",
      bad: "SELECT CONCAT('Ahmed', NULL);       --> retourne NULL !",
      good: "SELECT CONCAT_WS(' ', 'Ahmed', NULL); --> retourne 'Ahmed'",
      explanation: "Dans CONCAT(), si UN SEUL argument est NULL, tout le résultat devient NULL. CONCAT_WS (With Separator) ignore automatiquement les NULL.",
      sample: "SELECT CONCAT('A', NULL), CONCAT_WS(' ', 'A', NULL);"
    },
    {
      title: "4. Arrondi vs Troncature : ROUND vs TRUNCATE",
      bad: "ROUND(12.987, 2)    --> 12.99 (arrondit au supérieur)",
      good: "TRUNCATE(12.987, 2) --> 12.98 (coupe sans arrondir)",
      explanation: "ROUND regarde le chiffre suivant (7 >= 5) et arrondit. TRUNCATE supprime brutalement les chiffres après la virgule.",
      sample: "SELECT ROUND(12.987, 2), TRUNCATE(12.987, 2);"
    },
    {
      title: "5. Sens de calcul : DATEDIFF vs TIMESTAMPDIFF",
      bad: "DATEDIFF(d1, d2)       --> calcule (d1 - d2) en JOURS",
      good: "TIMESTAMPDIFF(unit, d1, d2) --> calcule (d2 - d1) dans l'unité voulue",
      explanation: "Attention à l'ordre des arguments ! Avec les mêmes dates dans le même ordre, DATEDIFF donne +7 alors que TIMESTAMPDIFF(DAY, d1, d2) donne -7.",
      sample: "SELECT DATEDIFF('2026-09-22', '2026-09-15');"
    },
    {
      title: "6. Comptage avec NULL : COUNT(*) vs COUNT(colonne)",
      bad: "COUNT(*)       --> compte TOUTES les lignes (même avec NULL)",
      good: "COUNT(colonne) --> compte UNIQUEMENT les valeurs NON-NULL",
      explanation: "Si 3 employés ont les primes (500, NULL, 200), COUNT(*) donne 3 alors que COUNT(prime) donne 2.",
      sample: "SELECT COUNT(*);"
    },
    {
      title: "7. Heure figée vs temps réel : NOW() vs SYSDATE()",
      bad: "NOW()     --> heure figée au DÉBUT de la requête",
      good: "SYSDATE() --> heure RÉELLE au moment de son exécution",
      explanation: "SELECT NOW(), SLEEP(2), NOW() donne 2 fois la même heure. Alors que SYSDATE() donne 2 secondes de différence.",
      sample: "SELECT NOW();"
    },
    {
      title: "8. Numérotation des jours : DAYOFWEEK vs WEEKDAY",
      bad: "DAYOFWEEK('2026-09-22') --> 3 (Dimanche=1, Lundi=2, Mardi=3)",
      good: "WEEKDAY('2026-09-22')   --> 1 (Lundi=0, Mardi=1, Mercredi=2)",
      explanation: "DAYOFWEEK commence à 1 le dimanche. WEEKDAY commence à 0 le lundi.",
      sample: "SELECT DAYOFWEEK('2026-09-22'), WEEKDAY('2026-09-22');"
    },
    {
      title: "9. Le piège NOT IN avec NULL",
      bad: "WHERE id NOT IN (1, 2, NULL)  --> ne retourne AUCUNE ligne !",
      good: "WHERE id NOT IN (1, 2) AND id IS NOT NULL",
      explanation: "En logique 3 valeurs SQL (TRUE, FALSE, UNKNOWN), '5 NOT IN (1, 2, NULL)' donne UNKNOWN/NULL car 5 != NULL ne peut être affirmé. La clause WHERE ne garde pas la ligne.",
      sample: "SELECT 5 NOT IN (1, 2, NULL);"
    },
    {
      title: "10. Scalaire vs Agrégation : GREATEST vs MAX",
      bad: "GREATEST(10, 20, 30) --> compare des arguments sur UNE MÊME ligne",
      good: "MAX(salaire)          --> agrège des valeurs sur PLUSIEURS lignes",
      explanation: "GREATEST(note1, note2) extrait la meilleure note d'un étudiant. MAX(salaire) trouve le salaire le plus élevé de toute la table.",
      sample: "SELECT GREATEST(10, 30, 20);"
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-7 text-slate-900 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                Les 10 Pièges d'Examen MySQL (OFPPT)
              </h3>
              <p className="text-xs text-slate-500">
                Fiche de révision indispensable pour les contrôles et examens de passage / fin de formation
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

        {/* List of Traps */}
        <div className="space-y-4">
          {traps.map((t, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>{t.title}</span>
                <button
                  onClick={() => {
                    onSelectSample(t.sample);
                    onClose();
                  }}
                  className="text-xs text-cyan-700 hover:underline font-medium cursor-pointer"
                >
                  Tester dans le simulateur &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-900 flex items-start gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="break-all">{t.bad}</span>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="break-all">{t.good}</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed pt-1">
                {t.explanation}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            J'ai compris, fermer
          </button>
        </div>
      </div>
    </div>
  );
};
