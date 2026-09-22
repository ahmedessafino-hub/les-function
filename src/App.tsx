import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DefinitionSection } from './components/DefinitionSection';
import { CategoryNav } from './components/CategoryNav';
import { FunctionTable } from './components/FunctionTable';
import { FunctionModal } from './components/FunctionModal';
import { LiveSimulator } from './components/LiveSimulator';
import { ExamTrapsModal } from './components/ExamTrapsModal';
import { StoredFunctionModal } from './components/StoredFunctionModal';
import { CATEGORIES } from './data/categories';
import { MYSQL_FUNCTIONS } from './data/functionsData';
import { MySQLFunction, FunctionCategoryKey, FunctionLevel } from './types/functions';
import { Search, Database, ArrowUp, AlertCircle, BookOpen, Terminal } from 'lucide-react';

export default function App() {
  const [selectedFunction, setSelectedFunction] = useState<MySQLFunction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FunctionCategoryKey | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<FunctionLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isTrapsOpen, setIsTrapsOpen] = useState(false);
  const [isStoredInfoOpen, setIsStoredInfoOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulatorQuery, setSimulatorQuery] = useState<string>("SELECT IF(10 > 5, 'Oui', 'Non');");

  // Filtering functions based on search, category and level
  const filteredFunctions = useMemo(() => {
    return MYSQL_FUNCTIONS.filter((fn) => {
      // Category filter
      if (selectedCategory !== 'all' && fn.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && fn.level !== selectedLevel) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = fn.name.toLowerCase().includes(q);
        const matchSyntax = fn.syntax.toLowerCase().includes(q);
        const matchRole = fn.role.toLowerCase().includes(q);
        const matchExample = fn.example.toLowerCase().includes(q);
        const matchCause = fn.cause ? fn.cause.toLowerCase().includes(q) : false;
        return matchName || matchSyntax || matchRole || matchExample || matchCause;
      }
      return true;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  // Categories to display
  const activeCategories = useMemo(() => {
    if (selectedCategory !== 'all') {
      return CATEGORIES.filter((c) => c.key === selectedCategory);
    }
    return CATEGORIES;
  }, [selectedCategory]);

  const handleTestInSimulator = (query: string) => {
    setSimulatorQuery(query);
    setIsSimulatorOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        onOpenTraps={() => setIsTrapsOpen(true)}
        onOpenStoredInfo={() => setIsStoredInfoOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      <main className="flex-1">
        {/* Definition Section (Handwritten Image 1 top) */}
        <DefinitionSection onOpenStoredInfo={() => setIsStoredInfoOpen(true)} />

        {/* Categories Bar & Search */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLevel={selectedLevel}
          onSelectLevel={setSelectedLevel}
          totalCount={filteredFunctions.length}
        />

        {/* Content Area with Tables */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Handwritten Prompt Note Reminder */}
          <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-4 flex-wrap text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>
                <strong>Astuce :</strong> Cliquez sur n'importe quelle ligne d'un tableau pour afficher son exemple, son résultat et sa cause/explication (conforme au schéma manuscrit).
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="hidden sm:inline">Total filtré :</span>
              <span className="font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {filteredFunctions.length} fonctions
              </span>
            </div>
          </div>

          {filteredFunctions.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">
                Aucune fonction ne correspond à votre recherche
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Essayez d'autres mots-clés (ex: "IF", "ROUND", "DATE", "NULL", "CONCAT") ou réinitialisez les filtres.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
                className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-cyan-700 rounded-lg hover:bg-cyan-800 transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeCategories.map((category) => {
                const categoryFunctions = filteredFunctions.filter(
                  (fn) => fn.category === category.key
                );
                return (
                  <FunctionTable
                    key={category.key}
                    category={category}
                    functions={categoryFunctions}
                    onSelectFunction={setSelectedFunction}
                    searchQuery={searchQuery}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Simulator */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer"
          title="Retour en haut"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="px-4 py-2.5 rounded-full bg-cyan-700 text-white font-semibold text-xs shadow-lg hover:bg-cyan-800 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
          title="Ouvrir le simulateur SQL"
        >
          <Terminal className="w-4 h-4" />
          <span className="hidden sm:inline">Simulateur SQL</span>
        </button>
      </div>

      {/* Modals */}
      <FunctionModal
        fn={selectedFunction}
        onClose={() => setSelectedFunction(null)}
        onTestInSimulator={handleTestInSimulator}
      />

      <LiveSimulator
        initialQuery={simulatorQuery}
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      <ExamTrapsModal
        isOpen={isTrapsOpen}
        onClose={() => setIsTrapsOpen(false)}
        onSelectSample={handleTestInSimulator}
      />

      <StoredFunctionModal
        isOpen={isStoredInfoOpen}
        onClose={() => setIsStoredInfoOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-700 text-white flex items-center justify-center text-[10px] font-bold">
              SQL
            </div>
            <span className="font-semibold text-slate-800">
              MySQL Functions Hub &middot; Référence Pédagogique OFPPT
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Tous types de fonctions intégrées MySQL</span>
            <span>&middot;</span>
            <button
              onClick={() => setIsStoredInfoOpen(true)}
              className="hover:underline hover:text-slate-600 cursor-pointer"
            >
              Note fonctions stockées
            </button>
            <span>&middot;</span>
            <button
              onClick={() => setIsTrapsOpen(true)}
              className="hover:underline hover:text-slate-600 cursor-pointer"
            >
              10 Pièges d'examen
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
