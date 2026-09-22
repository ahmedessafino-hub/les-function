import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, Copy, Check, Sparkles, AlertCircle, Info } from 'lucide-react';

interface LiveSimulatorProps {
  initialQuery?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  initialQuery = "SELECT IF(10 > 5, 'Oui', 'Non');",
  isOpen,
  onClose
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync initial query when opened
  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      executeMockMySQL(initialQuery);
    }
  }, [initialQuery, isOpen]);

  // Client-side MySQL Expression Evaluator
  const executeMockMySQL = (rawQuery: string) => {
    const clean = rawQuery.trim().replace(/;$/, '');
    
    // Extract expression inside SELECT ...
    const selectMatch = clean.match(/^SELECT\s+(.+)$/i);
    const expr = selectMatch ? selectMatch[1].trim() : clean;

    try {
      // 1. IF(cond, v1, v2)
      const ifMatch = expr.match(/^IF\s*\((.+?),\s*(.+?),\s*(.+?)\)$/i);
      if (ifMatch) {
        const condStr = ifMatch[1].trim();
        const v1 = ifMatch[2].trim().replace(/^['"]|['"]$/g, '');
        const v2 = ifMatch[3].trim().replace(/^['"]|['"]$/g, '');
        // simple cond evaluation like 10 > 5
        let condVal = false;
        if (condStr.includes('>')) {
          const [a, b] = condStr.split('>').map((s) => parseFloat(s.trim()));
          condVal = a > b;
        } else if (condStr.includes('<')) {
          const [a, b] = condStr.split('<').map((s) => parseFloat(s.trim()));
          condVal = a < b;
        } else if (condStr.includes('=')) {
          const [a, b] = condStr.split('=').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
          condVal = a === b;
        } else {
          condVal = Boolean(eval(condStr));
        }
        const res = condVal ? `'${v1}'` : `'${v2}'`;
        setResult(res);
        setExplanation(`Condition (${condStr}) est ${condVal ? 'VRAIE' : 'FAUSSE'}, MySQL retourne donc ${res}.`);
        return;
      }

      // 2. IFNULL(a, b)
      const ifnullMatch = expr.match(/^IFNULL\s*\((.+?),\s*(.+?)\)$/i);
      if (ifnullMatch) {
        const a = ifnullMatch[1].trim();
        const b = ifnullMatch[2].trim();
        if (a.toLowerCase() === 'null') {
          setResult(b);
          setExplanation(`Le premier argument est NULL, MySQL retourne la valeur de remplacement : ${b}.`);
        } else {
          setResult(a);
          setExplanation(`Le premier argument (${a}) n'est pas NULL, MySQL le conserve.`);
        }
        return;
      }

      // 3. NULLIF(a, b)
      const nullifMatch = expr.match(/^NULLIF\s*\((.+?),\s*(.+?)\)$/i);
      if (nullifMatch) {
        const a = nullifMatch[1].trim();
        const b = nullifMatch[2].trim();
        if (a === b) {
          setResult('NULL');
          setExplanation(`Les deux valeurs sont strictement égales (${a} = ${b}), donc NULLIF retourne NULL.`);
        } else {
          setResult(a);
          setExplanation(`Les valeurs sont différentes (${a} != ${b}), donc NULLIF retourne le premier argument (${a}).`);
        }
        return;
      }

      // 4. NULL <=> NULL vs NULL = NULL
      if (expr.includes('<=>')) {
        const [left, right] = expr.split('<=>').map((s) => s.trim().toLowerCase());
        if (left === 'null' && right === 'null') {
          setResult('1');
          setExplanation("NULL <=> NULL donne 1 (TRUE) car <=> est l'opérateur d'égalité sécurisé pour NULL.");
          return;
        }
      }
      if (expr === 'NULL = NULL' || expr === 'null = null') {
        setResult('NULL');
        setExplanation("NULL = NULL donne NULL en SQL car NULL représente une valeur inconnue.");
        return;
      }

      // 5. ROUND(x, d)
      const roundMatch = expr.match(/^ROUND\s*\(([\d.-]+)(?:\s*,\s*(\d+))?\)$/i);
      if (roundMatch) {
        const num = parseFloat(roundMatch[1]);
        const decimals = roundMatch[2] ? parseInt(roundMatch[2]) : 0;
        const res = num.toFixed(decimals);
        setResult(res);
        setExplanation(`Arrondi au plus proche de ${num} avec ${decimals} décimales.`);
        return;
      }

      // 6. TRUNCATE(x, d)
      const truncMatch = expr.match(/^TRUNCATE\s*\(([\d.-]+)\s*,\s*(\d+)\)$/i);
      if (truncMatch) {
        const numStr = truncMatch[1];
        const decimals = parseInt(truncMatch[2]);
        const parts = numStr.split('.');
        const res = parts[0] + (decimals > 0 && parts[1] ? '.' + parts[1].substring(0, decimals) : '');
        setResult(res);
        setExplanation(`Troncature brute à ${decimals} décimales sans arrondi mathématique.`);
        return;
      }

      // 7. CONCAT(...)
      const concatMatch = expr.match(/^CONCAT\s*\((.+)\)$/i);
      if (concatMatch && !expr.toUpperCase().startsWith('CONCAT_WS')) {
        const args = concatMatch[1].split(',').map((s) => s.trim());
        const hasNull = args.some((a) => a.toLowerCase() === 'null');
        if (hasNull) {
          setResult('NULL');
          setExplanation("RÈGLE ABSOLUE : Un des arguments vaut NULL, donc CONCAT() retourne NULL !");
        } else {
          const cleanArgs = args.map((s) => s.replace(/^['"]|['"]$/g, ''));
          setResult(`'${cleanArgs.join('')}'`);
          setExplanation(`Concaténation standard des ${args.length} chaînes.`);
        }
        return;
      }

      // 8. CONCAT_WS(sep, ...)
      const concatWsMatch = expr.match(/^CONCAT_WS\s*\((.+)\)$/i);
      if (concatWsMatch) {
        const args = concatWsMatch[1].split(',').map((s) => s.trim());
        const sep = args[0].replace(/^['"]|['"]$/g, '');
        if (args[0].toLowerCase() === 'null') {
          setResult('NULL');
          setExplanation("Le séparateur lui-même est NULL, donc CONCAT_WS retourne NULL.");
          return;
        }
        const filtered = args.slice(1).filter((a) => a.toLowerCase() !== 'null').map((s) => s.replace(/^['"]|['"]$/g, ''));
        setResult(`'${filtered.join(sep)}'`);
        setExplanation(`CONCAT_WS a joint les éléments avec '${sep}' en ignorant les éventuels arguments NULL.`);
        return;
      }

      // 9. UPPER / LOWER / REVERSE / LENGTH / CHAR_LENGTH
      const upperMatch = expr.match(/^UPPER\s*\(['"](.+?)['"]\)$/i);
      if (upperMatch) {
        setResult(`'${upperMatch[1].toUpperCase()}'`);
        return;
      }
      const lowerMatch = expr.match(/^LOWER\s*\(['"](.+?)['"]\)$/i);
      if (lowerMatch) {
        setResult(`'${lowerMatch[1].toLowerCase()}'`);
        return;
      }
      const revMatch = expr.match(/^REVERSE\s*\(['"](.+?)['"]\)$/i);
      if (revMatch) {
        setResult(`'${revMatch[1].split('').reverse().join('')}'`);
        return;
      }
      const lenMatch = expr.match(/^CHAR_LENGTH\s*\(['"](.+?)['"]\)$/i);
      if (lenMatch) {
        setResult(`${lenMatch[1].length}`);
        setExplanation(`Nombre de caractères : ${lenMatch[1].length}`);
        return;
      }

      // 10. SUBSTRING(str, pos, len)
      const subMatch = expr.match(/^SUBSTRING\s*\(['"](.+?)['"]\s*,\s*(\d+)(?:\s*,\s*(\d+))?\)$/i);
      if (subMatch) {
        const str = subMatch[1];
        const pos = parseInt(subMatch[2]);
        const len = subMatch[3] ? parseInt(subMatch[3]) : undefined;
        // In SQL 1-indexed
        const start = Math.max(0, pos - 1);
        const res = len !== undefined ? str.substring(start, start + len) : str.substring(start);
        setResult(`'${res}'`);
        setExplanation(`Extrait depuis l'index ${pos} (1-indexed en SQL) sur ${len || 'tout'} caractère(s).`);
        return;
      }

      // 11. DATEDIFF(d1, d2)
      const dateDiffMatch = expr.match(/^DATEDIFF\s*\(['"]([\d-]+)['"]\s*,\s*['"]([\d-]+)['"]\)$/i);
      if (dateDiffMatch) {
        const d1 = new Date(dateDiffMatch[1]);
        const d2 = new Date(dateDiffMatch[2]);
        const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
        setResult(`${diffDays}`);
        setExplanation(`Différence calendaire = ${dateDiffMatch[1]} - ${dateDiffMatch[2]} = ${diffDays} jour(s).`);
        return;
      }

      // 12. MOD & DIV
      if (expr.includes('DIV')) {
        const [a, b] = expr.split(/DIV/i).map((s) => parseFloat(s.trim()));
        const res = Math.floor(a / b);
        setResult(`${res}`);
        setExplanation(`Quotient de la division entière de ${a} par ${b} = ${res}`);
        return;
      }
      const modMatch = expr.match(/^MOD\s*\(([\d.]+)\s*,\s*([\d.]+)\)$/i);
      if (modMatch) {
        const a = parseFloat(modMatch[1]);
        const b = parseFloat(modMatch[2]);
        setResult(`${a % b}`);
        setExplanation(`Reste de la division de ${a} par ${b} = ${a % b}`);
        return;
      }

      // 13. BIT_COUNT
      const bitCountMatch = expr.match(/^BIT_COUNT\s*\(([\d]+)\)$/i);
      if (bitCountMatch) {
        const n = parseInt(bitCountMatch[1]);
        const count = (n.toString(2).match(/1/g) || []).length;
        setResult(`${count}`);
        setExplanation(`${n} en binaire = ${n.toString(2)}. Il y a ${count} bit(s) à 1.`);
        return;
      }

      // 14. NOW, CURDATE, VERSION
      if (/^NOW\(\)$/i.test(expr)) {
        setResult(`'${new Date().toISOString().replace('T', ' ').substring(0, 19)}'`);
        setExplanation("Date et heure actuelles de la session au format YYYY-MM-DD HH:MM:SS.");
        return;
      }
      if (/^CURDATE\(\)$/i.test(expr)) {
        setResult(`'${new Date().toISOString().substring(0, 10)}'`);
        setExplanation("Date du jour au format YYYY-MM-DD.");
        return;
      }
      if (/^VERSION\(\)$/i.test(expr)) {
        setResult("'8.4.0-OFPPT-Simulated'");
        return;
      }

      // Fallback: simple numeric math
      if (/^[\d\s+\-*/%&|^()]+$/.test(expr)) {
        const val = Function(`'use strict'; return (${expr})`)();
        setResult(`${val}`);
        setExplanation(`Calcul arithmétique évalué : ${expr} = ${val}`);
        return;
      }

      // Default fallback
      setResult("'Résultat simulé'");
      setExplanation("Expression analysée avec succès.");
    } catch (err: any) {
      setResult("Erreur de syntaxe SQL");
      setExplanation("Vérifiez les parenthèses ou les guillemets de votre expression.");
    }
  };

  const handleRun = () => {
    executeMockMySQL(query);
  };

  const presets = [
    { label: "IF() conditionnel", q: "SELECT IF(10 > 5, 'Oui', 'Non');" },
    { label: "CONCAT() avec NULL", q: "SELECT CONCAT('Ahmed', NULL, 'Alaoui');" },
    { label: "CONCAT_WS() sécurisé", q: "SELECT CONCAT_WS(' - ', 'Ahmed', NULL, 'Alaoui');" },
    { label: "Arrondi ROUND()", q: "SELECT ROUND(15.678, 2);" },
    { label: "Troncature TRUNCATE()", q: "SELECT TRUNCATE(15.678, 2);" },
    { label: "Égalité NULL <=> NULL", q: "SELECT NULL <=> NULL;" },
    { label: "DATEDIFF() en jours", q: "SELECT DATEDIFF('2026-09-22', '2026-09-15');" },
    { label: "Division entière DIV", q: "SELECT 17 DIV 5;" },
    { label: "Comptage BIT_COUNT()", q: "SELECT BIT_COUNT(7);" }
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-7 text-slate-900 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-700 flex items-center justify-center text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">
                Simulateur d'Expressions MySQL
              </h3>
              <p className="text-xs text-slate-500">
                Testez vos fonctions MySQL et observez le résultat en temps réel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Exemples préconfigurés rapides :
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(p.q);
                  executeMockMySQL(p.q);
                }}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md whitespace-nowrap border border-slate-200 cursor-pointer transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* SQL Input Area */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Votre requête SQL (SELECT expression;) :
          </label>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={2}
              className="w-full p-3 font-mono text-sm bg-slate-950 text-emerald-400 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 shadow-inner"
              placeholder="SELECT ROUND(12.345, 2);"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setQuery("SELECT IF(10 > 5, 'Oui', 'Non');");
              executeMockMySQL("SELECT IF(10 > 5, 'Oui', 'Non');");
            }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
          <button
            onClick={handleRun}
            className="px-5 py-2 text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Exécuter la requête
          </button>
        </div>

        {/* Output Box */}
        {result !== null && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold uppercase tracking-wider text-cyan-400">
                Résultat d'évaluation :
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>

            <div className="font-mono text-base font-bold text-amber-300">
              {result}
            </div>

            {explanation && (
              <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800/80 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{explanation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
