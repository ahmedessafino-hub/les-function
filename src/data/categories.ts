import { FunctionCategory } from '../types/functions';

export const CATEGORIES: FunctionCategory[] = [
  {
    key: 'control_flow',
    title: 'Fonctions de contrôle de flux',
    subtitle: 'Logique conditionnelle & branchements',
    description: 'Permet à MySQL de prendre des décisions selon une condition ou la présence de NULL (IF, IFNULL, NULLIF, CASE).',
    icon: 'GitBranch',
    color: 'emerald'
  },
  {
    key: 'numeric',
    title: 'Fonctions numériques (Mathématiques)',
    subtitle: 'Calculs mathématiques & trigonométrie',
    description: 'Calculs mathématiques directs : arrondi, troncature, puissances, racines, logarithmes et trigonométrie.',
    icon: 'Calculator',
    color: 'blue'
  },
  {
    key: 'string',
    title: 'Fonctions de chaînes de caractères',
    subtitle: 'Manipulation et traitement de texte',
    description: 'Manipulation de texte : concaténation, majuscules/minuscules, extraction, recherche, remplacement et découpage.',
    icon: 'Type',
    color: 'indigo'
  },
  {
    key: 'date_time',
    title: 'Fonctions de date et heure',
    subtitle: 'Gestion temporelle, dates & durées',
    description: 'Gestion temporelle complète : date/heure actuelle, extraction de composantes, arithmétique de date et formatage.',
    icon: 'Calendar',
    color: 'amber'
  },
  {
    key: 'aggregate',
    title: "Fonctions d'agrégation (GROUP BY)",
    subtitle: 'Agrégation statistique & regroupements',
    description: 'Calculs sur plusieurs lignes pour produire une valeur synthétique par groupe (COUNT, SUM, AVG, MIN, MAX).',
    icon: 'Layers',
    color: 'purple'
  },
  {
    key: 'window',
    title: 'Fonctions fenêtres (Window Functions)',
    subtitle: 'Analyse séquentielle & partitions',
    description: 'Calculs analytiques sur une partition de lignes sans réduire le nombre de lignes (ROW_NUMBER, RANK, LAG, LEAD).',
    icon: 'Sliders',
    color: 'sky'
  },
  {
    key: 'conversion',
    title: 'Fonctions de conversion de type (CAST & CONVERT)',
    subtitle: 'Transtypage explicite de données',
    description: 'Forcer la conversion explicite d’une valeur en entier, décimal, chaîne, date, binaire ou JSON.',
    icon: 'Repeat',
    color: 'teal'
  },
  {
    key: 'comparison',
    title: 'Fonctions & opérateurs de comparaison',
    subtitle: 'Opérateurs de test & prédicats',
    description: 'Tester des valeurs, gérer les intervalles inclusifs (BETWEEN), listes (IN), égalité sécurisée avec NULL (<=>) et COALESCE.',
    icon: 'Scale',
    color: 'rose'
  },
  {
    key: 'information',
    title: "Fonctions d'information",
    subtitle: 'Métadonnées système & session',
    description: 'Consulter la version du serveur, l’utilisateur connecté, la base active et le dernier identifiant auto-incrémenté.',
    icon: 'Info',
    color: 'cyan'
  },
  {
    key: 'encryption',
    title: 'Fonctions de chiffrement et de hachage',
    subtitle: 'Cryptographie, hachage & sécurité',
    description: 'Empreintes cryptographiques irréversibles (MD5, SHA2) et chiffrement symétrique réversible avec clé (AES).',
    icon: 'ShieldCheck',
    color: 'red'
  },
  {
    key: 'misc',
    title: 'Fonctions diverses (Miscellaneous)',
    subtitle: 'Utilitaires divers (UUID, réseau, verrous)',
    description: 'Génération d’UUID uniques, conversion d’adresses IP (v4/v6), gestion des verrous nommés et délais (SLEEP).',
    icon: 'Compass',
    color: 'violet'
  },
  {
    key: 'spatial',
    title: 'Fonctions spatiales (GIS & Géométrie)',
    subtitle: 'Données géographiques & géométrie',
    description: 'Création et analyse de coordonnées géographiques (Point, LineString, Polygon), distances et formats GeoJSON.',
    icon: 'MapPin',
    color: 'emerald'
  },
  {
    key: 'bit',
    title: 'Fonctions BIT (Bitwise)',
    subtitle: 'Opérations binaires et manipulation de bits',
    description: 'Opérations bit à bit (&, |, ^, ~, décalages << >>) et comptage des bits actifs (BIT_COUNT).',
    icon: 'Cpu',
    color: 'blue'
  },
  {
    key: 'json',
    title: 'Fonctions JSON',
    subtitle: 'Stockage & interrogation de documents JSON',
    description: 'Créer, extraire (-> / ->>), modifier (JSON_SET) et convertir des documents JSON en tables relationnelles (JSON_TABLE).',
    icon: 'FileCode',
    color: 'amber'
  }
];
