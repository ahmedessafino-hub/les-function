import { MySQLFunction } from '../types/functions';

export const MYSQL_FUNCTIONS: MySQLFunction[] = [
  // ==========================================
  // 1. CONTRÔLE DE FLUX (Flow Control)
  // ==========================================
  {
    id: 'cf-if',
    name: 'IF()',
    category: 'control_flow',
    level: 'fundamental',
    syntax: 'IF(condition, valeur_si_vrai, valeur_si_faux)',
    role: 'Permet de choisir entre deux valeurs selon qu’une condition est vraie ou fausse.',
    example: "SELECT IF(10 > 5, 'Oui', 'Non');",
    result: "'Oui'",
    cause: "10 > 5 est évalué à TRUE (1), MySQL renvoie donc directement le 2e argument 'Oui' sans évaluer le 3e.",
    tableExample: {
      schema: "Employe (id INT, nom VARCHAR(50), salaire DECIMAL(10,2))",
      query: "SELECT nom, salaire, IF(salaire >= 5000, 'Élevé', 'Normal') AS niveau FROM Employe;",
      output: "Ahmed (6000) -> 'Élevé' | Sara (3000) -> 'Normal' | Omar (7000) -> 'Élevé'",
      explanation: "Chaque ligne est testée individuellement : si salaire >= 5000 le niveau est 'Élevé', sinon 'Normal'."
    },
    tips: [
      "IF() fonction (dans SELECT/WHERE) est différente de l'instruction IF...THEN...ELSE des procédures stockées.",
      "Trois arguments sont obligatoires : condition, valeur si vrai, valeur si faux."
    ],
    simulatorDefault: "IF(10 > 5, 'Admis', 'Ajourné')"
  },
  {
    id: 'cf-ifnull',
    name: 'IFNULL()',
    category: 'control_flow',
    level: 'fundamental',
    syntax: 'IFNULL(expr1, valeur_si_null)',
    role: 'Retourne la deuxième valeur si la première expression est NULL, sinon retourne la première.',
    example: "SELECT IFNULL(NULL, 100);",
    result: '100',
    cause: 'Null + 10 : MySQL ne connaît pas la valeur de NULL (valeur absente/inconnue). IFNULL permet de substituer une valeur par défaut comme 0 ou 100.',
    tableExample: {
      schema: "Employe (nom VARCHAR(50), prime DECIMAL(10,2))",
      query: "SELECT nom, IFNULL(prime, 0) AS prime_reelle FROM Employe;",
      output: "Ahmed (500) -> 500 | Sara (NULL) -> 0",
      explanation: "Si Sara n'a pas de prime (NULL), on affiche 0 au lieu de laisser NULL se propager dans les calculs."
    },
    tips: [
      "Ne pas confondre avec NULLIF(). IFNULL teste si le 1er est NULL. NULLIF compare l'égalité des deux.",
      "NULL n'est ni 0 ni une chaîne vide '', c'est l'absence de donnée."
    ],
    simulatorDefault: "IFNULL(null, 50)"
  },
  {
    id: 'cf-nullif',
    name: 'NULLIF()',
    category: 'control_flow',
    level: 'fundamental',
    syntax: 'NULLIF(expr1, expr2)',
    role: 'Retourne NULL si les deux expressions sont égales, sinon retourne la première expression expr1.',
    example: 'SELECT NULLIF(10, 10);',
    result: 'NULL',
    cause: '10 = 10 est VRAI : la règle de NULLIF(a, b) stipule que si a = b, la fonction produit intentionnellement NULL.',
    tableExample: {
      schema: "Stats (departement VARCHAR(30), nb_erreurs INT)",
      query: "SELECT departement, 100 / NULLIF(nb_erreurs, 0) AS ratio FROM Stats;",
      output: "Dev (0 erreurs) -> NULL (évite une division par zéro fatale)",
      explanation: "NULLIF(nb_erreurs, 0) transforme 0 en NULL pour que la division 100 / NULL donne NULL au lieu d'une erreur."
    },
    tips: [
      "NULLIF(50, 100) -> 50 (puisque 50 != 100).",
      "Très utilisé pour neutraliser les divisions par zéro."
    ],
    simulatorDefault: 'NULLIF(25, 25)'
  },
  {
    id: 'cf-coalesce',
    name: 'COALESCE()',
    category: 'control_flow',
    level: 'fundamental',
    syntax: 'COALESCE(valeur1, valeur2, valeur3, ...)',
    role: 'Retourne le tout premier argument qui n’est pas NULL dans la liste.',
    example: "SELECT COALESCE(NULL, NULL, 50, 100);",
    result: '50',
    cause: 'Les deux premiers arguments sont NULL, ils sont ignorés. 50 est la 1ère valeur non-NULL rencontrée.',
    tableExample: {
      schema: "Clients (nom VARCHAR(50), telephone VARCHAR(20), email VARCHAR(50))",
      query: "SELECT nom, COALESCE(telephone, email, 'Aucun contact') AS contact FROM Clients;",
      output: "Ahmed (tel: NULL, email: 'ahmed@mail.com') -> 'ahmed@mail.com'",
      explanation: "Prend le téléphone en priorité ; s'il est NULL, prend l'email ; si les deux sont NULL, prend 'Aucun contact'."
    },
    tips: [
      "COALESCE peut prendre un nombre illimité d'arguments.",
      "Si tous les arguments sont NULL, COALESCE retourne NULL."
    ],
    simulatorDefault: "COALESCE(null, null, 'Ahmed', 'Inconnu')"
  },
  {
    id: 'cf-case-simple',
    name: 'CASE (simple)',
    category: 'control_flow',
    level: 'fundamental',
    syntax: 'CASE expression WHEN val1 THEN res1 WHEN val2 THEN res2 ELSE res_defaut END',
    role: 'Compare une expression unique à une liste de valeurs fixes (équivalent à un switch).',
    example: "SELECT CASE 2 WHEN 1 THEN 'Un' WHEN 2 THEN 'Deux' ELSE 'Autre' END AS resultat;",
    result: "'Deux'",
    // Pas de cause particulière -> "else n'est pas écrit"
    tableExample: {
      schema: "Employe (nom VARCHAR(50), statut_code INT)",
      query: "SELECT nom, CASE statut_code WHEN 1 THEN 'Actif' WHEN 2 THEN 'En congé' ELSE 'Inconnu' END AS statut FROM Employe;",
      output: "Ahmed (1) -> 'Actif' | Sara (2) -> 'En congé'",
      explanation: "Compare la colonne statut_code aux valeurs 1 et 2."
    },
    tips: [
      "Le mot-clé END est obligatoire pour fermer le bloc CASE.",
      "Si ELSE est omis et qu'aucune valeur ne correspond, MySQL retourne NULL."
    ],
    simulatorDefault: "CASE 2 WHEN 1 THEN 'Premier' WHEN 2 THEN 'Deuxième' ELSE 'Autre' END"
  },
  {
    id: 'cf-case-searched',
    name: 'CASE (recherché)',
    category: 'control_flow',
    level: 'fundamental',
    syntax: 'CASE WHEN cond1 THEN res1 WHEN cond2 THEN res2 ELSE res_defaut END',
    role: 'Évalue plusieurs conditions booléennes indépendantes dans l’ordre (équivalent à if-elseif-else).',
    example: "SELECT CASE WHEN 90 >= 80 THEN 'Très bien' WHEN 90 >= 60 THEN 'Bien' ELSE 'Insuffisant' END AS mention;",
    result: "'Très bien'",
    cause: "L'ordre des WHEN est critique : 90 >= 80 est vraie en premier, donc MySQL s'arrête immédiatement sans tester les conditions suivantes.",
    tableExample: {
      schema: "Employe (nom VARCHAR(50), salaire DECIMAL(10,2))",
      query: "SELECT nom, CASE WHEN salaire >= 6000 THEN 'Élevé' WHEN salaire >= 4000 THEN 'Moyen' ELSE 'Faible' END AS tranche FROM Employe;",
      output: "Ahmed (7000) -> 'Élevé' | Sara (4500) -> 'Moyen' | Omar (2500) -> 'Faible'",
      explanation: "Placez toujours les conditions les plus strictes en premier (ex: >= 6000 avant >= 4000)."
    },
    tips: [
      "Piège d'examen : si vous écrivez 'WHEN salaire >= 3000 THEN Moyen WHEN salaire >= 6000 THEN Élevé', un salaire de 7000 recevra 'Moyen' !"
    ],
    simulatorDefault: "CASE WHEN 75 >= 80 THEN 'A' WHEN 75 >= 70 THEN 'B' ELSE 'C' END"
  },

  // ==========================================
  // 2. NUMÉRIQUES (Mathématiques)
  // ==========================================
  {
    id: 'num-round',
    name: 'ROUND()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'ROUND(X [, D])',
    role: 'Arrondit un nombre X à D décimales (par défaut 0 décimale) au plus proche.',
    example: 'SELECT ROUND(15.678, 2);',
    result: '15.68',
    cause: 'Le 3e chiffre après la virgule est 8 (>= 5), donc le 7 est arrondi au supérieur à 8, donnant 15.68.',
    tableExample: {
      schema: "Produit (designation VARCHAR(50), prix_ht DECIMAL(10,3))",
      query: "SELECT designation, ROUND(prix_ht * 1.20, 2) AS prix_ttc FROM Produit;",
      output: "Souris (149.567) -> 179.48",
      explanation: "Calcule le TTC avec TVA 20% et arrondit proprement à 2 décimales pour la facturation."
    },
    tips: [
      "ROUND(12.4) -> 12 | ROUND(12.6) -> 13.",
      "ROUND arrondit au plus proche, alors que TRUNCATE coupe brutalement."
    ],
    simulatorDefault: 'ROUND(15.678, 2)'
  },
  {
    id: 'num-ceil',
    name: 'CEIL() / CEILING()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'CEIL(X) ou CEILING(X)',
    role: 'Retourne le plus petit entier supérieur ou égal à X (arrondi par excès / plafond).',
    example: 'SELECT CEIL(4.2);',
    result: '5',
    cause: '4.2 se situe entre 4 et 5. Le plus petit entier qui est >= 4.2 est 5. Pour -4.2, CEIL(-4.2) donne -4.',
    tableExample: {
      schema: "Commandes (id INT, total_articles INT, articles_par_carton INT)",
      query: "SELECT id, CEIL(total_articles / articles_par_carton) AS cartons_necessaires FROM Commandes;",
      output: "Commande 1 (11 articles, 5 par carton) -> CEIL(2.2) = 3 cartons",
      explanation: "Même s'il ne reste que 1 article dans le dernier carton, il faut un carton entier de plus."
    },
    tips: [
      "CEIL() et CEILING() sont deux synonymes parfaits.",
      "Attention aux négatifs : CEIL(-4.2) = -4, CEIL(-4.9) = -4."
    ],
    simulatorDefault: 'CEIL(4.2)'
  },
  {
    id: 'num-floor',
    name: 'FLOOR()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'FLOOR(X)',
    role: 'Retourne le plus grand entier inférieur ou égal à X (arrondi par défaut / plancher).',
    example: 'SELECT FLOOR(4.8);',
    result: '4',
    cause: '4.8 se situe entre 4 et 5. Le plus grand entier qui est <= 4.8 est 4. Piège avec les négatifs : FLOOR(-4.2) = -5 (car -5 <= -4.2).',
    tableExample: {
      schema: "Employe (nom VARCHAR(50), anciennete_mois INT)",
      query: "SELECT nom, FLOOR(anciennete_mois / 12) AS annees_completes FROM Employe;",
      output: "Yassine (35 mois) -> 2 années complètes",
      explanation: "FLOOR permet d'ignorer la fraction d'année non terminée."
    },
    tips: [
      "Piège d'examen fréquent : FLOOR(-4.2) donne -5 et non -4 !"
    ],
    simulatorDefault: 'FLOOR(4.8)'
  },
  {
    id: 'num-truncate',
    name: 'TRUNCATE()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'TRUNCATE(X, D)',
    role: 'Tronque le nombre X à D décimales sans effectuer d’arrondi.',
    example: 'SELECT TRUNCATE(12.9876, 2);',
    result: '12.98',
    cause: 'TRUNCATE coupe brutalement les chiffres au-delà de la 2e décimale sans regarder le chiffre suivant (qui était un 8). ROUND aurait donné 12.99.',
    tips: [
      "ROUND(12.9876, 2) -> 12.99",
      "TRUNCATE(12.9876, 2) -> 12.98"
    ],
    simulatorDefault: 'TRUNCATE(12.9876, 2)'
  },
  {
    id: 'num-format',
    name: 'FORMAT()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'FORMAT(X, D [, locale])',
    role: 'Formate un nombre avec séparateurs de milliers et D décimales (retourne une CHAÎNE).',
    example: 'SELECT FORMAT(1234567.891, 2);',
    result: "'1,234,567.89'",
    cause: "ATTENTION PIÈGE : FORMAT() retourne une chaîne de caractères (VARCHAR), pas un nombre. Ne pas utiliser pour des calculs ultérieurs !",
    tips: [
      "Utile uniquement pour l'affichage final dans une vue ou un rapport."
    ],
    simulatorDefault: 'FORMAT(1234567.89, 2)'
  },
  {
    id: 'num-abs',
    name: 'ABS()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'ABS(X)',
    role: 'Retourne la valeur absolue d’un nombre (supprime le signe négatif).',
    example: 'SELECT ABS(-20);',
    result: '20',
    simulatorDefault: 'ABS(-20)'
  },
  {
    id: 'num-sign',
    name: 'SIGN()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'SIGN(X)',
    role: 'Indique le signe d’un nombre : -1 (négatif), 0 (zéro), ou 1 (positif).',
    example: 'SELECT SIGN(-25);',
    result: '-1',
    simulatorDefault: 'SIGN(-25)'
  },
  {
    id: 'num-mod',
    name: 'MOD() / %',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'MOD(N, M) ou N % M',
    role: 'Retourne le reste de la division entière de N par M (modulo).',
    example: 'SELECT MOD(10, 3);',
    result: '1',
    cause: '10 = (3 * 3) + 1. Le reste est donc 1.',
    tips: [
      "Pour tester la parité d'un nombre : WHERE MOD(id, 2) = 0 (nombres pairs)."
    ],
    simulatorDefault: 'MOD(17, 5)'
  },
  {
    id: 'num-div',
    name: 'DIV',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'N DIV M',
    role: 'Effectue une division entière et retourne le quotient entier (sans décimales).',
    example: 'SELECT 10 DIV 3;',
    result: '3',
    cause: "10 / 3 donne 3.3333... tandis que 10 DIV 3 donne 3 (quotient entier) et MOD(10, 3) donne 1 (reste).",
    tips: [
      "DIV est un opérateur de division entière, pas une fonction avec parenthèses."
    ],
    simulatorDefault: '17 DIV 5'
  },
  {
    id: 'num-sqrt',
    name: 'SQRT()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'SQRT(X)',
    role: 'Calcule la racine carrée d’un nombre positif.',
    example: 'SELECT SQRT(25);',
    result: '5',
    cause: '5 * 5 = 25. Pour un nombre négatif comme SQRT(-1), MySQL retourne NULL.',
    simulatorDefault: 'SQRT(81)'
  },
  {
    id: 'num-exp',
    name: 'EXP()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'EXP(X)',
    role: 'Calcule la fonction exponentielle e^X (e élevé à la puissance X).',
    example: 'SELECT EXP(1);',
    result: '2.718281828459045',
    simulatorDefault: 'EXP(2)'
  },
  {
    id: 'num-pow',
    name: 'POW() / POWER()',
    category: 'numeric',
    level: 'fundamental',
    syntax: 'POW(X, Y) ou POWER(X, Y)',
    role: 'Élève le nombre X à la puissance Y (X^Y).',
    example: 'SELECT POW(2, 3);',
    result: '8',
    cause: '2 * 2 * 2 = 8.',
    simulatorDefault: 'POW(2, 5)'
  },
  {
    id: 'num-log',
    name: 'LOG() / LN()',
    category: 'numeric',
    level: 'intermediate',
    syntax: 'LN(X) ou LOG(X) ou LOG(B, X)',
    role: 'Calcule le logarithme naturel (base e) ou en base B.',
    example: 'SELECT LOG(10, 1000);',
    result: '3',
    cause: '10^3 = 1000. Donc le logarithme de 1000 en base 10 est 3. LOG(0) ou LOG(-X) retourne NULL.',
    simulatorDefault: 'LOG(10, 1000)'
  },
  {
    id: 'num-log2',
    name: 'LOG2() / LOG10()',
    category: 'numeric',
    level: 'intermediate',
    syntax: 'LOG2(X) ou LOG10(X)',
    role: 'Calcule le logarithme en base 2 ou en base 10.',
    example: 'SELECT LOG2(8);',
    result: '3',
    simulatorDefault: 'LOG2(8)'
  },
  {
    id: 'num-trigo',
    name: 'SIN(), COS(), TAN(), COT()',
    category: 'numeric',
    level: 'intermediate',
    syntax: 'SIN(rad), COS(rad), TAN(rad), COT(rad)',
    role: 'Fonctions trigonométriques standard (prennent des angles en RADIANS).',
    example: 'SELECT COS(0);',
    result: '1',
    cause: 'Attention : MySQL attend des angles en radians, pas en degrés. Utiliser RADIANS(degres) pour convertir.',
    simulatorDefault: 'COS(0)'
  },
  {
    id: 'num-asin',
    name: 'ASIN(), ACOS(), ATAN(), ATAN2()',
    category: 'numeric',
    level: 'intermediate',
    syntax: 'ASIN(X), ACOS(X), ATAN(X), ATAN2(Y, X)',
    role: 'Fonctions trigonométriques inverses (arc sinus, arc cosinus, arc tangente).',
    example: 'SELECT ASIN(1);',
    result: '1.5707963267948966',
    simulatorDefault: 'ASIN(1)'
  },
  {
    id: 'num-deg-rad',
    name: 'DEGREES() / RADIANS()',
    category: 'numeric',
    level: 'intermediate',
    syntax: 'DEGREES(rad) ou RADIANS(deg)',
    role: 'Convertit les angles entre radians et degrés.',
    example: 'SELECT DEGREES(PI());',
    result: '180',
    simulatorDefault: 'DEGREES(3.14159265)'
  },
  {
    id: 'num-pi',
    name: 'PI()',
    category: 'numeric',
    level: 'intermediate',
    syntax: 'PI()',
    role: 'Retourne la constante mathématique Pi (environ 3.141593).',
    example: 'SELECT PI();',
    result: '3.141593',
    simulatorDefault: 'PI()'
  },
  {
    id: 'num-rand',
    name: 'RAND()',
    category: 'numeric',
    level: 'intermediate',
    syntax: 'RAND([seed])',
    role: 'Génère un nombre décimal aléatoire compris dans l’intervalle [0, 1).',
    example: 'SELECT RAND();',
    result: '0.4829371...',
    cause: "Pour générer un entier entre Min et Max : FLOOR(Min + RAND() * (Max - Min + 1)).",
    simulatorDefault: 'RAND()'
  },

  // ==========================================
  // 3. CHAÎNES DE CARACTÈRES (String)
  // ==========================================
  {
    id: 'str-concat',
    name: 'CONCAT()',
    category: 'string',
    level: 'fundamental',
    syntax: 'CONCAT(str1, str2, str3, ...)',
    role: 'Assemble (concatène) plusieurs chaînes bout à bout.',
    example: "SELECT CONCAT('Bonjour', ' ', 'Ahmed');",
    result: "'Bonjour Ahmed'",
    cause: "PIÈGE CRITIQUE : Si un seul argument vaut NULL, toute la fonction CONCAT() retourne NULL (ex: CONCAT('Ahmed', NULL) -> NULL). Utiliser CONCAT_WS() pour éviter ce piège !",
    tableExample: {
      schema: "Clients (prenom VARCHAR(50), nom VARCHAR(50))",
      query: "SELECT CONCAT(prenom, ' ', nom) AS nom_complet FROM Clients;",
      output: "Ahmed Alaoui | Si nom est NULL -> retourne NULL !",
      explanation: "Pour éviter que le nom complet soit NULL si le nom manque, utilisez COALESCE(nom, '') ou CONCAT_WS."
    },
    tips: [
      "CONCAT('A', NULL, 'B') donne NULL.",
      "Pour insérer un séparateur automatique qui ignore les NULL, préférez CONCAT_WS()."
    ],
    simulatorDefault: "CONCAT('Bonjour', ' ', 'Ahmed')"
  },
  {
    id: 'str-concat-ws',
    name: 'CONCAT_WS()',
    category: 'string',
    level: 'fundamental',
    syntax: 'CONCAT_WS(separateur, str1, str2, ...)',
    role: 'Concatène avec un séparateur imposé et IGNORE automatiquement les valeurs NULL.',
    example: "SELECT CONCAT_WS(' - ', 'Ahmed', 'Alaoui', '18');",
    result: "'Ahmed - Alaoui - 18'",
    cause: "CONCAT_WS(' ', 'Ahmed', NULL, 'Alaoui') donne 'Ahmed Alaoui'. Contrairement à CONCAT(), les valeurs NULL sont ignorées. Mais si le séparateur lui-même est NULL, le résultat est NULL.",
    tableExample: {
      schema: "Clients (ville VARCHAR(50), pays VARCHAR(50))",
      query: "SELECT CONCAT_WS(', ', ville, pays) AS adresse FROM Clients;",
      output: "Rabat, Maroc | Si ville est NULL -> 'Maroc' (pas de virgule vide ni de résultat NULL)",
      explanation: "Idéal pour formater des adresses et noms sans gestion complexe de NULL."
    },
    tips: [
      "Le premier argument est TOUJOURS le séparateur.",
      "CONCAT_WS(NULL, 'A', 'B') retourne NULL car le séparateur est NULL."
    ],
    simulatorDefault: "CONCAT_WS(' - ', '2026', '09', '22')"
  },
  {
    id: 'str-upper',
    name: 'UPPER() / UCASE()',
    category: 'string',
    level: 'fundamental',
    syntax: 'UPPER(str) ou UCASE(str)',
    role: 'Convertit tous les caractères d’une chaîne en MAJUSCULES.',
    example: "SELECT UPPER('ahmed');",
    result: "'AHMED'",
    simulatorDefault: "UPPER('developpement web')"
  },
  {
    id: 'str-lower',
    name: 'LOWER() / LCASE()',
    category: 'string',
    level: 'fundamental',
    syntax: 'LOWER(str) ou LCASE(str)',
    role: 'Convertit tous les caractères d’une chaîne en minuscules.',
    example: "SELECT LOWER('BONJOUR');",
    result: "'bonjour'",
    simulatorDefault: "LOWER('MYSQL 8.4')"
  },
  {
    id: 'str-length',
    name: 'LENGTH()',
    category: 'string',
    level: 'fundamental',
    syntax: 'LENGTH(str)',
    role: 'Retourne la longueur de la chaîne en OCTETS (bytes).',
    example: "SELECT LENGTH('Ahmed');",
    result: '5',
    cause: "En encodage UTF-8, un caractère accentué comme 'é' occupe 2 octets. Donc LENGTH('é') retourne 2, alors que CHAR_LENGTH('é') retourne 1.",
    tips: [
      "LENGTH = octets (Bytes).",
      "CHAR_LENGTH = nombre de caractères."
    ],
    simulatorDefault: "LENGTH('Développement')"
  },
  {
    id: 'str-char-length',
    name: 'CHAR_LENGTH() / CHARACTER_LENGTH()',
    category: 'string',
    level: 'fundamental',
    syntax: 'CHAR_LENGTH(str) ou CHARACTER_LENGTH(str)',
    role: 'Retourne le nombre exact de CARACTÈRES d’une chaîne (indépendamment des octets).',
    example: "SELECT CHAR_LENGTH('é');",
    result: '1',
    cause: "'é' est un seul caractère, donc CHAR_LENGTH donne 1. Comparez avec LENGTH('é') qui donne 2.",
    tips: [
      "Toujours utiliser CHAR_LENGTH pour valider la longueur d'un mot de passe ou d'un nom."
    ],
    simulatorDefault: "CHAR_LENGTH('Développement')"
  },
  {
    id: 'str-substring',
    name: 'SUBSTRING() / SUBSTR() / MID()',
    category: 'string',
    level: 'fundamental',
    syntax: 'SUBSTRING(str, pos [, len])',
    role: 'Extrait une sous-chaîne à partir de la position pos (index commençant à 1).',
    example: "SELECT SUBSTRING('Ahmed', 2, 3);",
    result: "'hme'",
    cause: "En SQL les index commencent à 1 : position 1 = 'A', 2 = 'h', 3 = 'm', 4 = 'e'. En prenant 3 caractères depuis la pos 2, on extrait 'hme'.",
    tableExample: {
      schema: "Employe (nom VARCHAR(50))",
      query: "SELECT nom, SUBSTRING(nom, 1, 3) AS trigramme FROM Employe;",
      output: "Ahmed -> 'Ahm' | Yassine -> 'Yas'",
      explanation: "Génère les initiales ou abréviations des employés."
    },
    tips: [
      "SUBSTR() et MID() sont des synonymes stricts de SUBSTRING().",
      "Si pos est négatif (ex: -3), MySQL compte à rebours depuis la fin."
    ],
    simulatorDefault: "SUBSTRING('Developpement', 1, 4)"
  },
  {
    id: 'str-left',
    name: 'LEFT()',
    category: 'string',
    level: 'fundamental',
    syntax: 'LEFT(str, len)',
    role: 'Extrait les len premiers caractères situés au début (à gauche) de la chaîne.',
    example: "SELECT LEFT('Ahmed', 2);",
    result: "'Ah'",
    simulatorDefault: "LEFT('Maroc', 3)"
  },
  {
    id: 'str-right',
    name: 'RIGHT()',
    category: 'string',
    level: 'fundamental',
    syntax: 'RIGHT(str, len)',
    role: 'Extrait les len derniers caractères situés à la fin (à droite) de la chaîne.',
    example: "SELECT RIGHT('Ahmed', 2);",
    result: "'ed'",
    simulatorDefault: "RIGHT('2026-09-22', 2)"
  },
  {
    id: 'str-substring-index',
    name: 'SUBSTRING_INDEX()',
    category: 'string',
    level: 'fundamental',
    syntax: 'SUBSTRING_INDEX(str, delim, count)',
    role: 'Extrait la partie d’une chaîne avant le count-ième délimiteur (ou après si count négatif).',
    example: "SELECT SUBSTRING_INDEX('user@gmail.com', '@', 1);",
    result: "'user'",
    cause: "count = 1 extrait avant le premier '@' ('user'). Si count = -1, il extrait après le dernier '@' ('gmail.com').",
    tableExample: {
      schema: "Employe (email VARCHAR(100))",
      query: "SELECT email, SUBSTRING_INDEX(email, '@', -1) AS domaine FROM Employe;",
      output: "ahmed@gmail.com -> 'gmail.com' | sara@ofppt.ma -> 'ofppt.ma'",
      explanation: "Permet de regrouper facilement les utilisateurs par domaine de messagerie."
    },
    tips: [
      "SUBSTRING_INDEX('www.exemple.com', '.', 2) -> 'www.exemple'",
      "SUBSTRING_INDEX('www.exemple.com', '.', -1) -> 'com'"
    ],
    simulatorDefault: "SUBSTRING_INDEX('ahmed@gmail.com', '@', -1)"
  },
  {
    id: 'str-locate',
    name: 'LOCATE() / INSTR() / POSITION()',
    category: 'string',
    level: 'fundamental',
    syntax: 'LOCATE(needle, haystack) ou INSTR(haystack, needle)',
    role: 'Retourne la position de la première occurrence d’une sous-chaîne (commence à 1, 0 si absente).',
    example: "SELECT LOCATE('Ahmed', 'Bonjour Ahmed');",
    result: '9',
    cause: "ATTENTION PIÈGE D'EXAMEN : L'ordre des arguments est inversé entre LOCATE(ce_qu_on_cherche, texte) et INSTR(texte, ce_qu_on_cherche) !",
    tips: [
      "LOCATE('Ahmed', 'Bonjour Ahmed') = 9",
      "INSTR('Bonjour Ahmed', 'Ahmed') = 9",
      "Si la chaîne n'est pas trouvée, la fonction retourne 0 (pas -1)."
    ],
    simulatorDefault: "LOCATE('Ahmed', 'Bonjour Ahmed')"
  },
  {
    id: 'str-trim',
    name: 'TRIM() / LTRIM() / RTRIM()',
    category: 'string',
    level: 'fundamental',
    syntax: 'TRIM([rem FROM] str) / LTRIM(str) / RTRIM(str)',
    role: 'Supprime les espaces (ou un caractère spécifique) au début, à la fin ou des deux côtés.',
    example: "SELECT TRIM('   Ahmed   ');",
    result: "'Ahmed'",
    cause: "TRIM() ne supprime QUE les espaces en bordure. Les espaces situés au milieu d'une chaîne (ex: 'Ahmed   Ali') ne sont PAS supprimés.",
    tips: [
      "LTRIM supprime à gauche, RTRIM supprime à droite.",
      "TRIM(BOTH 'x' FROM 'xxxAhmedxxx') donne 'Ahmed'."
    ],
    simulatorDefault: "TRIM('   MySQL 8.4   ')"
  },
  {
    id: 'str-lpad-rpad',
    name: 'LPAD() / RPAD()',
    category: 'string',
    level: 'fundamental',
    syntax: 'LPAD(str, len, padstr) ou RPAD(str, len, padstr)',
    role: 'Remplit une chaîne à gauche (LPAD) ou à droite (RPAD) jusqu’à atteindre la longueur totale len.',
    example: "SELECT LPAD('123', 5, '0');",
    result: "'00123'",
    cause: "La longueur finale souhaitée est 5. La chaîne '123' mesurant 3, LPAD ajoute deux zéros '00' à gauche pour faire 5 caractères au total.",
    tableExample: {
      schema: "Factures (id INT)",
      query: "SELECT id, CONCAT('FAC-', LPAD(id, 6, '0')) AS num_facture FROM Factures;",
      output: "id 42 -> 'FAC-000042'",
      explanation: "Permet de générer des codes de référence alignés avec zéros de tête."
    },
    tips: [
      "Si la chaîne initiale est plus longue que len, elle est tronquée à len caractères."
    ],
    simulatorDefault: "LPAD('42', 6, '0')"
  },
  {
    id: 'str-replace',
    name: 'REPLACE()',
    category: 'string',
    level: 'fundamental',
    syntax: 'REPLACE(str, from_str, to_str)',
    role: 'Remplace TOUTES les occurrences d’une sous-chaîne par une nouvelle chaîne.',
    example: "SELECT REPLACE('Bonjour Ahmed', 'Ahmed', 'Sara');",
    result: "'Bonjour Sara'",
    cause: "REPLACE remplace sans exception toutes les occurrences trouvées : REPLACE('abc abc', 'abc', 'X') donne 'X X'.",
    simulatorDefault: "REPLACE('Bonjour Ahmed', 'Ahmed', 'Sara')"
  },
  {
    id: 'str-insert',
    name: 'INSERT()',
    category: 'string',
    level: 'fundamental',
    syntax: 'INSERT(str, pos, len, newstr)',
    role: 'Remplace une portion de chaîne définie par sa position de départ et sa longueur.',
    example: "SELECT INSERT('abcdef', 2, 3, 'XYZ');",
    result: "'aXYZef'",
    cause: "Ne pas confondre avec l'instruction SQL INSERT INTO ! Ici à la position 2 de 'abcdef', 3 caractères ('bcd') sont remplacés par 'XYZ'.",
    simulatorDefault: "INSERT('abcdef', 2, 3, 'XYZ')"
  },
  {
    id: 'str-repeat-reverse',
    name: 'REPEAT() / REVERSE()',
    category: 'string',
    level: 'intermediate',
    syntax: 'REPEAT(str, count) / REVERSE(str)',
    role: 'Répète une chaîne un nombre de fois ou inverse l’ordre de ses caractères.',
    example: "SELECT REPEAT('A', 5);",
    result: "'AAAAA'",
    tips: [
      "REVERSE('Ahmed') -> 'demhA'",
      "REPEAT('ab', 3) -> 'ababab'"
    ],
    simulatorDefault: "REVERSE('MySQL')"
  },
  {
    id: 'str-strcmp',
    name: 'STRCMP()',
    category: 'string',
    level: 'intermediate',
    syntax: 'STRCMP(expr1, expr2)',
    role: 'Compare deux chaînes selon la collation active (0 si égales, < 0 si expr1 < expr2, > 0 si expr1 > expr2).',
    example: "SELECT STRCMP('abc', 'abc');",
    result: '0',
    cause: "0 signifie égalité stricte. Si expr1 est classée avant expr2 dans l'ordre alphabétique, retourne une valeur négative (-1).",
    simulatorDefault: "STRCMP('abc', 'abd')"
  },
  {
    id: 'str-regexp',
    name: 'REGEXP / REGEXP_LIKE()',
    category: 'string',
    level: 'intermediate',
    syntax: "expr REGEXP pattern ou REGEXP_LIKE(expr, pattern)",
    role: 'Vérifie si une chaîne correspond à un motif d’expression régulière (ICU regex en MySQL 8).',
    example: "SELECT 'Ahmed' REGEXP '^A';",
    result: '1',
    cause: "'^A' signifie 'commence par la lettre A'. Comme 'Ahmed' commence bien par A, le test renvoie 1 (TRUE).",
    tips: [
      "LIKE utilise % et _ ; REGEXP utilise la puissance complète des regex (^, $, [0-9], +, *, etc.).",
      "REGEXP_REPLACE() permet de substituer par motif regex."
    ],
    simulatorDefault: "'Ahmed' REGEXP '^A'"
  },

  // ==========================================
  // 4. DATE ET HEURE
  // ==========================================
  {
    id: 'dt-now',
    name: 'NOW() / CURRENT_TIMESTAMP',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'NOW() ou CURRENT_TIMESTAMP',
    role: 'Retourne la date et l’heure actuelles de la session au début de la requête.',
    example: 'SELECT NOW();',
    result: "'2026-09-22 14:30:00'",
    cause: "DIFFÉRENCE CAPITALE D'EXAMEN : NOW() est figée et évaluée UNE SEULE FOIS au début de la requête. Plusieurs appels à NOW() dans une même requête retourneront la même valeur.",
    tips: [
      "LOCALTIME et LOCALTIMESTAMP sont des synonymes de NOW().",
      "SYSDATE() quant à elle retourne l'heure exacte au moment où elle s'exécute."
    ],
    simulatorDefault: 'NOW()'
  },
  {
    id: 'dt-sysdate',
    name: 'SYSDATE()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'SYSDATE()',
    role: 'Retourne l’heure exacte en temps réel au moment même de l’exécution de la fonction.',
    example: 'SELECT NOW(), SLEEP(2), SYSDATE();',
    result: "'14:30:00', 0, '14:30:02'",
    cause: "NOW() reste figée à 14:30:00 (début de requête), tandis que SYSDATE() a attendu les 2 secondes de SLEEP et renvoie 14:30:02.",
    tips: [
      "À cause de cette nature non déterministe, SYSDATE() peut compliquer la réplication MySQL."
    ],
    simulatorDefault: 'SYSDATE()'
  },
  {
    id: 'dt-curdate',
    name: 'CURDATE() / CURRENT_DATE',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'CURDATE() ou CURRENT_DATE',
    role: 'Retourne UNIQUEMENT la date actuelle du jour (sans composante heure).',
    example: 'SELECT CURDATE();',
    result: "'2026-09-22'",
    tips: [
      "Format retourné : YYYY-MM-DD.",
      "Ne pas confondre avec NOW() qui inclut les heures, minutes et secondes."
    ],
    simulatorDefault: 'CURDATE()'
  },
  {
    id: 'dt-curtime',
    name: 'CURTIME() / CURRENT_TIME',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'CURTIME() ou CURRENT_TIME',
    role: 'Retourne UNIQUEMENT l’heure actuelle (sans la date).',
    example: 'SELECT CURTIME();',
    result: "'14:30:00'",
    simulatorDefault: 'CURTIME()'
  },
  {
    id: 'dt-extract-parts',
    name: 'YEAR(), MONTH(), DAY(), HOUR()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'YEAR(date), MONTH(date), DAY(date), HOUR(time)',
    role: 'Extrait une composante précise (année, mois, jour du mois, heure) d’une date.',
    example: "SELECT YEAR('2026-09-22'), MONTH('2026-09-22'), DAY('2026-09-22');",
    result: '2026, 9, 22',
    tips: [
      "DAY() est un synonyme de DAYOFMONTH().",
      "MONTHNAME('2026-09-22') -> 'September' (selon lc_time_names).",
      "DAYNAME('2026-09-22') -> 'Tuesday'."
    ],
    simulatorDefault: "YEAR('2026-09-22')"
  },
  {
    id: 'dt-dayofweek-weekday',
    name: 'DAYOFWEEK() vs WEEKDAY()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'DAYOFWEEK(date) vs WEEKDAY(date)',
    role: 'Retourne le numéro du jour de la semaine selon deux indexations différentes.',
    example: "SELECT DAYOFWEEK('2026-09-22'), WEEKDAY('2026-09-22');",
    result: '3, 1',
    cause: "PIÈGE D'EXAMEN TYPIQUE OFPPT : DAYOFWEEK commence à 1 (Dimanche=1, Lundi=2, Mardi=3...) tandis que WEEKDAY commence à 0 (Lundi=0, Mardi=1, Mercredi=2...).",
    tips: [
      "Pour le mardi 22 sept : DAYOFWEEK = 3 (dimanche, lundi, mardi), WEEKDAY = 1 (lundi, mardi)."
    ],
    simulatorDefault: "DAYOFWEEK('2026-09-22')"
  },
  {
    id: 'dt-date-add',
    name: 'DATE_ADD() / ADDDATE()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'DATE_ADD(date, INTERVAL n UNIT)',
    role: 'Ajoute un intervalle temporel (jours, mois, années, heures) à une date.',
    example: "SELECT DATE_ADD('2026-09-22', INTERVAL 10 DAY);",
    result: "'2026-10-02'",
    cause: "Ajoute 10 jours au 22 septembre, ce qui fait basculer au 2 octobre en respectant le calendrier.",
    tableExample: {
      schema: "Commandes (id INT, date_commande DATE)",
      query: "SELECT id, date_commande, DATE_ADD(date_commande, INTERVAL 7 DAY) AS date_livraison FROM Commandes;",
      output: "Commande 1 (2026-09-10) -> 2026-09-17",
      explanation: "Permet de calculer automatiquement une date d'échéance ou de livraison."
    },
    tips: [
      "Unités possibles : SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, QUARTER, YEAR.",
      "Unités complexes : INTERVAL '1-3' YEAR_MONTH (ajoute 1 an et 3 mois)."
    ],
    simulatorDefault: "DATE_ADD('2026-09-22', INTERVAL 10 DAY)"
  },
  {
    id: 'dt-date-sub',
    name: 'DATE_SUB() / SUBDATE()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'DATE_SUB(date, INTERVAL n UNIT)',
    role: 'Soustrait un intervalle temporel à une date.',
    example: "SELECT DATE_SUB('2026-09-22', INTERVAL 10 DAY);",
    result: "'2026-09-12'",
    simulatorDefault: "DATE_SUB('2026-09-22', INTERVAL 10 DAY)"
  },
  {
    id: 'dt-datediff',
    name: 'DATEDIFF()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'DATEDIFF(date1, date2)',
    role: 'Calcule la différence entre deux dates uniquement en nombre de JOURS (date1 - date2).',
    example: "SELECT DATEDIFF('2026-09-22', '2026-09-15');",
    result: '7',
    cause: "DATEDIFF effectue d1 - d2. Si les dates sont inversées (d2, d1), le résultat devient -7. De plus, DATEDIFF ignore totalement la composante heure.",
    tableExample: {
      schema: "Employe (nom VARCHAR(50), date_embauche DATE)",
      query: "SELECT nom, DATEDIFF(CURDATE(), date_embauche) AS jours_anciennete FROM Employe;",
      output: "Ahmed (embauché 2020-09-17) -> 2196 jours",
      explanation: "Calcule le nombre de jours calendaires d'ancienneté."
    },
    tips: [
      "DATEDIFF ne fonctionne qu'en JOURS. Pour avoir des mois ou années, utilisez TIMESTAMPDIFF."
    ],
    simulatorDefault: "DATEDIFF('2026-09-22', '2026-09-15')"
  },
  {
    id: 'dt-timestampdiff',
    name: 'TIMESTAMPDIFF()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'TIMESTAMPDIFF(unit, date1, date2)',
    role: 'Calcule la différence entre deux dates dans l’unité de votre choix (date2 - date1).',
    example: "SELECT TIMESTAMPDIFF(YEAR, '2020-09-22', '2026-09-22');",
    result: '6',
    cause: "ATTENTION PIÈGE MAJEUR : DATEDIFF fait d1 - d2, mais TIMESTAMPDIFF fait d2 - d1 ! De plus le 1er argument est l'unité souhaitée (YEAR, MONTH, DAY, HOUR).",
    tableExample: {
      schema: "Employe (nom VARCHAR(50), date_naissance DATE)",
      query: "SELECT nom, TIMESTAMPDIFF(YEAR, date_naissance, CURDATE()) AS age FROM Employe;",
      output: "Ahmed (né en 2004) -> 22 ans",
      explanation: "Moyen exact de calculer l'âge d'une personne en SQL."
    },
    tips: [
      "Unité : SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, QUARTER, YEAR.",
      "TIMEDIFF(t1, t2) donne une différence sous format HH:MM:SS."
    ],
    simulatorDefault: "TIMESTAMPDIFF(MONTH, '2026-01-10', '2026-09-10')"
  },
  {
    id: 'dt-date-format',
    name: 'DATE_FORMAT()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'DATE_FORMAT(date, format)',
    role: 'Formate une date en chaîne textuelle selon des spécificateurs (%d, %m, %Y, etc.).',
    example: "SELECT DATE_FORMAT('2026-09-22 14:35:42', '%d/%m/%Y');",
    result: "'22/09/2026'",
    cause: "%d = jour sur 2 chiffres (22), %m = mois (09), %Y = année sur 4 chiffres (2026). Ne pas confondre avec FORMAT() qui formate des nombres décimaux.",
    tableExample: {
      schema: "Commandes (id INT, date_commande DATETIME)",
      query: "SELECT id, DATE_FORMAT(date_commande, '%d/%m/%Y à %H:%i') AS date_fr FROM Commandes;",
      output: "22/09/2026 à 14:35",
      explanation: "Permet de convertir le format interne MySQL en affichage lisible standard européen."
    },
    tips: [
      "%Y = année 4 chiffres (2026) | %y = année 2 chiffres (26)",
      "%H = heure 24h (14) | %h = heure 12h (02)",
      "%W = nom jour anglais (Tuesday) | %M = nom mois anglais (September)"
    ],
    simulatorDefault: "DATE_FORMAT('2026-09-22 14:35:00', '%d/%m/%Y')"
  },
  {
    id: 'dt-str-to-date',
    name: 'STR_TO_DATE()',
    category: 'date_time',
    level: 'fundamental',
    syntax: 'STR_TO_DATE(chaine, format)',
    role: 'Opération inverse de DATE_FORMAT : convertit une chaîne de texte en valeur DATE/DATETIME.',
    example: "SELECT STR_TO_DATE('22/09/2026', '%d/%m/%Y');",
    result: "'2026-09-22'",
    cause: "MySQL décode la chaîne '22/09/2026' selon le masque fourni et stocke le format ISO standard YYYY-MM-DD.",
    simulatorDefault: "STR_TO_DATE('22/09/2026', '%d/%m/%Y')"
  },
  {
    id: 'dt-last-day',
    name: 'LAST_DAY()',
    category: 'date_time',
    level: 'intermediate',
    syntax: 'LAST_DAY(date)',
    role: 'Retourne la date du dernier jour du mois correspondant (gère les années bissextiles).',
    example: "SELECT LAST_DAY('2024-02-10');",
    result: "'2024-02-29'",
    cause: "2024 est une année bissextile (divisible par 4), LAST_DAY renvoie donc automatiquement le 29 février.",
    simulatorDefault: "LAST_DAY('2026-09-22')"
  },
  {
    id: 'dt-unix-timestamp',
    name: 'UNIX_TIMESTAMP() / FROM_UNIXTIME()',
    category: 'date_time',
    level: 'intermediate',
    syntax: 'UNIX_TIMESTAMP([date]) / FROM_UNIXTIME(ts)',
    role: 'Convertit entre date et timestamp Unix (nombre de secondes écoulées depuis 1970-01-01 UTC).',
    example: "SELECT UNIX_TIMESTAMP('1970-01-01 00:00:00 UTC');",
    result: '0',
    simulatorDefault: 'UNIX_TIMESTAMP()'
  },

  // ==========================================
  // 5. AGRÉGATION (GROUP BY)
  // ==========================================
  {
    id: 'agg-count-star',
    name: 'COUNT(*)',
    category: 'aggregate',
    level: 'fundamental',
    syntax: 'COUNT(*)',
    role: 'Compte le nombre TOTAL de lignes d’une table ou d’un groupe, y compris celles avec NULL.',
    example: 'SELECT COUNT(*) FROM Employe;',
    result: '3',
    cause: "PIÈGE MAJEUR : COUNT(*) compte toutes les lignes sans exception. En revanche, COUNT(colonne) ignore les lignes où la colonne est NULL !",
    tableExample: {
      schema: "Employe (id INT, prime INT) -> Lignes: (1, 500), (2, NULL), (3, 200)",
      query: "SELECT COUNT(*) AS total_lignes, COUNT(prime) AS nb_primes FROM Employe;",
      output: "total_lignes = 3, nb_primes = 2",
      explanation: "Sara a une prime NULL, elle est comptée dans COUNT(*) mais rejetée dans COUNT(prime)."
    },
    tips: [
      "COUNT(DISTINCT col) compte les valeurs distinctes et non-nulles."
    ],
    simulatorDefault: 'COUNT(*)'
  },
  {
    id: 'agg-sum',
    name: 'SUM()',
    category: 'aggregate',
    level: 'fundamental',
    syntax: 'SUM([DISTINCT] expr)',
    role: 'Calcule la somme de toutes les valeurs non-NULL du groupe.',
    example: 'SELECT SUM(salaire) FROM Employe;',
    result: '15700.00',
    cause: 'Les valeurs NULL sont automatiquement ignorées dans le calcul et ne faussent pas l’addition.',
    simulatorDefault: 'SUM(salaire)'
  },
  {
    id: 'agg-avg',
    name: 'AVG()',
    category: 'aggregate',
    level: 'fundamental',
    syntax: 'AVG([DISTINCT] expr)',
    role: 'Calcule la moyenne arithmétique des valeurs non-NULL.',
    example: 'SELECT AVG(salaire) FROM Employe;',
    result: '5233.33',
    cause: "ATTENTION PIÈGE : AVG(colonne) divise par le nombre de valeurs NON-NULL, pas par le nombre total de lignes ! Si salaires=(5000, 6000, NULL), la moyenne est (5000+6000)/2 = 5500, pas 3666.67.",
    tips: [
      "Pour considérer NULL comme 0 dans la moyenne : AVG(IFNULL(salaire, 0))."
    ],
    simulatorDefault: 'AVG(salaire)'
  },
  {
    id: 'agg-min-max',
    name: 'MIN() / MAX()',
    category: 'aggregate',
    level: 'fundamental',
    syntax: 'MIN(expr) ou MAX(expr)',
    role: 'Retourne respectivement la plus petite ou la plus grande valeur d’un ensemble de lignes.',
    example: 'SELECT MIN(salaire), MAX(salaire) FROM Employe;',
    result: '3000.00, 7000.00',
    cause: "Ne pas confondre avec LEAST() et GREATEST() ! MIN/MAX travaillent sur PLUSIEURS LIGNES d'une colonne. GREATEST/LEAST comparent PLUSIEURS COLONNES sur une SEULE ligne.",
    simulatorDefault: 'MAX(salaire)'
  },
  {
    id: 'agg-group-concat',
    name: 'GROUP_CONCAT()',
    category: 'aggregate',
    level: 'fundamental',
    syntax: 'GROUP_CONCAT([DISTINCT] col [ORDER BY col] [SEPARATOR sep])',
    role: 'Concatène les valeurs de plusieurs lignes appartenant au même groupe dans une seule chaîne.',
    example: "SELECT departement, GROUP_CONCAT(nom SEPARATOR ' - ') FROM Employe GROUP BY departement;",
    result: "Dev -> 'Ahmed - Sara - Yassine'",
    cause: "Le séparateur par défaut est la virgule ','. Le mot-clé SEPARATOR permet de le personnaliser.",
    tips: [
      "On peut ajouter DISTINCT et ORDER BY à l'intérieur : GROUP_CONCAT(DISTINCT nom ORDER BY nom ASC SEPARATOR ', ')."
    ],
    simulatorDefault: "GROUP_CONCAT(nom SEPARATOR ', ')"
  },
  {
    id: 'agg-stats',
    name: 'STDDEV() / VARIANCE()',
    category: 'aggregate',
    level: 'intermediate',
    syntax: 'STDDEV_POP(), STDDEV_SAMP(), VAR_POP(), VAR_SAMP()',
    role: 'Calcule l’écart-type et la variance d’une série statistique (population vs échantillon).',
    example: 'SELECT STDDEV_POP(salaire) FROM Employe;',
    result: '1247.21',
    cause: "POP = Population complète (divise par N). SAMP = Échantillon / Sample (divise par N-1).",
    simulatorDefault: 'STDDEV_POP(salaire)'
  },

  // ==========================================
  // 6. FONCTIONS FENÊTRES (Window Functions)
  // ==========================================
  {
    id: 'win-row-number',
    name: 'ROW_NUMBER()',
    category: 'window',
    level: 'intermediate',
    syntax: 'ROW_NUMBER() OVER ([PARTITION BY col] ORDER BY col)',
    role: 'Attribue un numéro séquentiel unique (1, 2, 3...) à chaque ligne de la fenêtre.',
    example: 'SELECT nom, salaire, ROW_NUMBER() OVER (ORDER BY salaire DESC) AS rang FROM Employe;',
    result: 'Sara: 1, Ahmed: 2, Imane: 3, Omar: 4',
    cause: "Contrairement à GROUP BY qui fusionne les lignes, la fonction fenêtre OVER() conserve TOUTES les lignes individuelles tout en calculant leur classement.",
    tableExample: {
      schema: "Employe (nom VARCHAR(50), departement VARCHAR(30), salaire INT)",
      query: "SELECT nom, departement, ROW_NUMBER() OVER (PARTITION BY departement ORDER BY salaire DESC) AS rang_dept FROM Employe;",
      output: "Dev: Sara(1), Ahmed(2) | RH: Imane(1), Omar(2)",
      explanation: "PARTITION BY réinitialise le compteur à 1 pour chaque département."
    },
    simulatorDefault: 'ROW_NUMBER() OVER (ORDER BY salaire DESC)'
  },
  {
    id: 'win-rank',
    name: 'RANK() vs DENSE_RANK()',
    category: 'window',
    level: 'intermediate',
    syntax: 'RANK() OVER (...) vs DENSE_RANK() OVER (...)',
    role: 'Attribue un classement aux lignes avec gestion des ex-aequo (avec trou pour RANK, sans trou pour DENSE_RANK).',
    example: 'SELECT nom, salaire, RANK() OVER (ORDER BY salaire DESC) AS rk FROM Employe;',
    result: 'Sara (6000): 1 | Ahmed (5000): 2 | Imane (5000): 2 | Omar (4000): 4',
    cause: "PIÈGE D'EXAMEN : RANK() génère un trou après une égalité (1, 2, 2, 4). DENSE_RANK() ne crée aucun trou (1, 2, 2, 3).",
    simulatorDefault: 'RANK() OVER (ORDER BY salaire DESC)'
  },
  {
    id: 'win-lag-lead',
    name: 'LAG() / LEAD()',
    category: 'window',
    level: 'intermediate',
    syntax: 'LAG(expr [, offset]) OVER (...) / LEAD(expr [, offset]) OVER (...)',
    role: 'Accède à la valeur d’une ligne précédente (LAG) ou suivante (LEAD) sans auto-jointure.',
    example: 'SELECT date_vente, montant, LAG(montant) OVER (ORDER BY date_vente) AS vente_veille FROM Ventes;',
    result: '01/09: NULL | 02/09: 100 | 03/09: 200',
    cause: "La première ligne n'a pas de ligne précédente, LAG() retourne donc NULL.",
    simulatorDefault: 'LAG(montant) OVER (ORDER BY date_vente)'
  },
  {
    id: 'win-agg-over',
    name: 'SUM() / AVG() OVER()',
    category: 'window',
    level: 'intermediate',
    syntax: 'SUM(col) OVER (PARTITION BY dep) ou AVG(col) OVER ()',
    role: 'Calcule un total ou une moyenne générale/par groupe tout en gardant le détail de chaque employé.',
    example: 'SELECT nom, salaire, AVG(salaire) OVER (PARTITION BY departement) AS moy_dep FROM Employe;',
    result: 'Affiche chaque employé avec la moyenne de son propre département à côté de son salaire.',
    simulatorDefault: 'AVG(salaire) OVER (PARTITION BY departement)'
  },

  // ==========================================
  // 7. CONVERSION DE TYPE (CAST & CONVERT)
  // ==========================================
  {
    id: 'conv-cast-signed',
    name: 'CAST(... AS SIGNED / UNSIGNED)',
    category: 'conversion',
    level: 'fundamental',
    syntax: 'CAST(expr AS SIGNED / UNSIGNED)',
    role: 'Convertit explicitement une chaîne ou un nombre en entier signé ou non-signé.',
    example: "SELECT CAST('123' AS SIGNED) + 50;",
    result: '173',
    cause: "Convertit le texte '123' en véritable nombre BIGINT. PIÈGE : CAST('12a' AS UNSIGNED) extrait 12 mais émet un warning de troncature.",
    tips: [
      "SIGNED autorise les négatifs (-25), UNSIGNED n'autorise que les positifs (0 à 2^64-1)."
    ],
    simulatorDefault: "CAST('123' AS SIGNED)"
  },
  {
    id: 'conv-cast-decimal',
    name: 'CAST(... AS DECIMAL(M, D))',
    category: 'conversion',
    level: 'fundamental',
    syntax: 'CAST(expr AS DECIMAL(M, D))',
    role: 'Convertit en nombre décimal exact avec M chiffres au total et D décimales.',
    example: "SELECT CAST('123.456' AS DECIMAL(6, 2));",
    result: '123.46',
    cause: "Le chiffre après la 2e décimale est 6 (>= 5), la valeur est donc arrondie proprement à 123.46.",
    simulatorDefault: "CAST('123.456' AS DECIMAL(6, 2))"
  },
  {
    id: 'conv-cast-date',
    name: 'CAST(... AS DATE / DATETIME / TIME)',
    category: 'conversion',
    level: 'fundamental',
    syntax: 'CAST(expr AS DATE) / DATETIME / TIME',
    role: 'Convertit une chaîne ou un timestamp en type DATE, DATETIME ou TIME.',
    example: "SELECT CAST('2026-09-22 15:30:00' AS DATE);",
    result: "'2026-09-22'",
    simulatorDefault: "CAST('2026-09-22 15:30:00' AS DATE)"
  },
  {
    id: 'conv-convert',
    name: 'CONVERT() & USING charset',
    category: 'conversion',
    level: 'fundamental',
    syntax: 'CONVERT(expr, type) ou CONVERT(expr USING charset)',
    role: 'Équivalent de CAST(), ou utilisé avec USING pour transcoder un jeu de caractères.',
    example: "SELECT CONVERT('123', SIGNED);",
    result: '123',
    cause: "CONVERT(x, type) est synonyme de CAST(x AS type). Mais CONVERT('texte' USING utf8mb4) permet en plus la conversion de charset.",
    simulatorDefault: "CONVERT('123', SIGNED)"
  },

  // ==========================================
  // 8. COMPARAISON & LOGIQUE
  // ==========================================
  {
    id: 'comp-null-safe',
    name: '<=> (NULL-safe equal)',
    category: 'comparison',
    level: 'fundamental',
    syntax: 'expr1 <=> expr2',
    role: 'Opérateur d’égalité qui traite NULL comme une valeur normale (renvoie 1 si deux NULL sont comparés).',
    example: 'SELECT NULL <=> NULL;',
    result: '1',
    cause: "PIÈGE D'EXAMEN CRUCIAL : 'NULL = NULL' retourne NULL (inconnu). Alors que 'NULL <=> NULL' retourne 1 (TRUE) car <=> est sécurisé vis-à-vis de NULL.",
    tips: [
      "10 = NULL -> NULL",
      "10 <=> NULL -> 0",
      "NULL <=> NULL -> 1"
    ],
    simulatorDefault: 'NULL <=> NULL'
  },
  {
    id: 'comp-between',
    name: 'BETWEEN ... AND ...',
    category: 'comparison',
    level: 'fundamental',
    syntax: 'valeur BETWEEN min AND max',
    role: 'Vérifie si une valeur est comprise dans un intervalle (les deux bornes sont STRICTEMENT INCLUSIVES).',
    example: 'SELECT 10 BETWEEN 10 AND 20;',
    result: '1',
    cause: "10 BETWEEN 10 AND 20 est équivalent à 'valeur >= 10 AND valeur <= 20'. 10 et 20 font donc partie de l'intervalle.",
    simulatorDefault: '15 BETWEEN 10 AND 20'
  },
  {
    id: 'comp-in',
    name: 'IN() / NOT IN()',
    category: 'comparison',
    level: 'fundamental',
    syntax: 'expr IN (val1, val2, ...) ou NOT IN (...)',
    role: 'Vérifie si une expression appartient (ou n’appartient pas) à une liste de valeurs.',
    example: 'SELECT 5 IN (1, 3, 5, 7);',
    result: '1',
    cause: "PIÈGE AVEC NULL : Si la liste de NOT IN contient NULL (ex: 5 NOT IN (1, 2, NULL)), le résultat est UNKNOWN/NULL et aucune ligne n'est sélectionnée dans le WHERE !",
    simulatorDefault: '5 IN (1, 2, 5)'
  },
  {
    id: 'comp-is-null',
    name: 'IS NULL / IS NOT NULL',
    category: 'comparison',
    level: 'fundamental',
    syntax: 'colonne IS NULL ou colonne IS NOT NULL',
    role: 'Teste si une colonne contient (ou non) une valeur manquante/inconnue NULL.',
    example: 'SELECT 0 IS NULL, NULL IS NULL;',
    result: '0, 1',
    cause: "RÈGLE D'OR : En SQL on n'écrit JAMAIS 'WHERE col = NULL' (toujours faux/inconnu). On doit obligatoirement écrire 'WHERE col IS NULL'. 0 et '' ne sont pas NULL.",
    simulatorDefault: 'null IS NULL'
  },
  {
    id: 'comp-greatest-least',
    name: 'GREATEST() / LEAST()',
    category: 'comparison',
    level: 'fundamental',
    syntax: 'GREATEST(v1, v2, ...) / LEAST(v1, v2, ...)',
    role: 'Retourne la plus grande ou plus petite valeur parmi plusieurs arguments sur UNE MÊME LIGNE.',
    example: 'SELECT GREATEST(10, 30, 20);',
    result: '30',
    cause: "Ne pas confondre avec MAX() et MIN() qui agrègent plusieurs lignes d'une table !",
    simulatorDefault: 'GREATEST(10, 30, 20)'
  },

  // ==========================================
  // 9. INFORMATION
  // ==========================================
  {
    id: 'info-version',
    name: 'VERSION()',
    category: 'information',
    level: 'fundamental',
    syntax: 'VERSION()',
    role: 'Retourne la version exacte du serveur MySQL actif (ex: 8.4.0).',
    example: 'SELECT VERSION();',
    result: "'8.4.0-commercial'",
    simulatorDefault: 'VERSION()'
  },
  {
    id: 'info-user',
    name: 'USER() vs CURRENT_USER()',
    category: 'information',
    level: 'fundamental',
    syntax: 'USER() vs CURRENT_USER()',
    role: 'USER() donne l’utilisateur déclaré par le client ; CURRENT_USER() donne le compte authentifié déterminant les droits.',
    example: 'SELECT USER(), CURRENT_USER();',
    result: "'ahmed@localhost', 'root@localhost'",
    cause: "PIÈGE D'EXAMEN : USER() est ce que le client prétend être. CURRENT_USER() est le compte réellement utilisé par MySQL pour vérifier les privilèges.",
    tips: [
      "SYSTEM_USER() et SESSION_USER() sont des synonymes de USER()."
    ],
    simulatorDefault: 'USER()'
  },
  {
    id: 'info-database',
    name: 'DATABASE() / SCHEMA()',
    category: 'information',
    level: 'fundamental',
    syntax: 'DATABASE() ou SCHEMA()',
    role: 'Retourne le nom de la base de données actuellement sélectionnée (USE nom_base;).',
    example: 'SELECT DATABASE();',
    result: "'boutique_db'",
    cause: "Retourne NULL si aucune base n'a encore été sélectionnée avec la commande USE.",
    simulatorDefault: 'DATABASE()'
  },
  {
    id: 'info-last-insert-id',
    name: 'LAST_INSERT_ID()',
    category: 'information',
    level: 'fundamental',
    syntax: 'LAST_INSERT_ID()',
    role: 'Retourne le dernier identifiant AUTO_INCREMENT généré par un INSERT réussi dans la session.',
    example: 'SELECT LAST_INSERT_ID();',
    result: '15',
    cause: "Lié strictement à votre session en cours. Si un autre utilisateur insère en parallèle, cela n'affecte pas votre LAST_INSERT_ID().",
    simulatorDefault: 'LAST_INSERT_ID()'
  },
  {
    id: 'info-row-count',
    name: 'ROW_COUNT()',
    category: 'information',
    level: 'intermediate',
    syntax: 'ROW_COUNT()',
    role: 'Retourne le nombre de lignes affectées par le dernier UPDATE, DELETE ou INSERT exécuté.',
    example: 'SELECT ROW_COUNT();',
    result: '4',
    simulatorDefault: 'ROW_COUNT()'
  },

  // ==========================================
  // 10. CHIFFREMENT ET HACHAGE
  // ==========================================
  {
    id: 'enc-sha2',
    name: 'SHA2() / MD5() / SHA1()',
    category: 'encryption',
    level: 'intermediate',
    syntax: 'SHA2(chaine, hash_length) ou MD5(chaine)',
    role: 'Calcule l’empreinte cryptographique irréversible d’une chaîne (hachage à sens unique).',
    example: "SELECT SHA2('motdepasse123', 256);",
    result: "'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'",
    cause: "DIFFÉRENCE FONDAMENTALE : Le hachage est IRRÉVERSIBLE. Il n'existe pas de fonction 'SHA2_DECRYPT()'. MD5 produit 32 hex (128 bits), SHA1 produit 40 hex (160 bits), SHA2(256) produit 64 hex (256 bits).",
    tips: [
      "Pour chiffrer de manière RÉVERSIBLE avec une clé, utilisez AES_ENCRYPT() et AES_DECRYPT().",
      "L'ancienne fonction PASSWORD() a été supprimée dans MySQL 8.0."
    ],
    simulatorDefault: "SHA2('ofppt2026', 256)"
  },
  {
    id: 'enc-aes',
    name: 'AES_ENCRYPT() / AES_DECRYPT()',
    category: 'encryption',
    level: 'intermediate',
    syntax: 'AES_ENCRYPT(texte, cle) / AES_DECRYPT(chiffre, cle)',
    role: 'Chiffre et déchiffre des données de manière symétrique réversible à l’aide d’une clé secrète.',
    example: "SELECT CAST(AES_DECRYPT(AES_ENCRYPT('Secret', 'ma_cle_123'), 'ma_cle_123') AS CHAR);",
    result: "'Secret'",
    cause: "AES_ENCRYPT retourne une chaîne binaire (VARBINARY). Il faut utiliser CAST(... AS CHAR) pour réafficher le texte déchiffré.",
    simulatorDefault: "AES_ENCRYPT('Secret', 'cle')"
  },

  // ==========================================
  // 11. DIVERSES (Miscellaneous)
  // ==========================================
  {
    id: 'misc-uuid',
    name: 'UUID() / UUID_SHORT()',
    category: 'misc',
    level: 'intermediate',
    syntax: 'UUID() ou UUID_SHORT()',
    role: 'Génère un identifiant unique universel (128 bits textuel ou 64 bits entier).',
    example: 'SELECT UUID();',
    result: "'6ccd780c-baba-1026-9564-5b8c656024db'",
    cause: "UUID() produit 32 caractères hexadécimaux et 4 tirets. UUID_TO_BIN() permet de le compacter en VARBINARY(16) pour économiser de la mémoire.",
    simulatorDefault: 'UUID()'
  },
  {
    id: 'misc-ip',
    name: 'INET_ATON() / INET_NTOA()',
    category: 'misc',
    level: 'intermediate',
    syntax: 'INET_ATON(ip) ou INET_NTOA(nombre)',
    role: 'Convertit une adresse IPv4 textuelle en entier numérique compact (et vice-versa).',
    example: "SELECT INET_ATON('10.0.5.9');",
    result: '167773449',
    cause: "10 * 256^3 + 0 * 256^2 + 5 * 256 + 9 = 167773449. Stocker l'IP en INT UNSIGNED prend 4 octets au lieu de 15 octets en VARCHAR.",
    tips: [
      "INET6_ATON() et INET6_NTOA() prennent en charge à la fois IPv4 et IPv6."
    ],
    simulatorDefault: "INET_ATON('192.168.1.1')"
  },
  {
    id: 'misc-locks',
    name: 'GET_LOCK() / RELEASE_LOCK()',
    category: 'misc',
    level: 'advanced',
    syntax: 'GET_LOCK(nom_verrou, timeout) / RELEASE_LOCK(nom)',
    role: 'Gère des verrous d’application nommés au niveau du serveur MySQL.',
    example: "SELECT GET_LOCK('traitement_factures', 10);",
    result: '1',
    cause: "1 = verrou acquis avec succès. 0 = délai expiré sans obtenir le verrou. NULL = erreur.",
    simulatorDefault: "GET_LOCK('mon_verrou', 5)"
  },
  {
    id: 'misc-sleep',
    name: 'SLEEP()',
    category: 'misc',
    level: 'advanced',
    syntax: 'SLEEP(secondes)',
    role: 'Suspend l’exécution de la requête pendant le nombre de secondes indiqué.',
    example: 'SELECT SLEEP(1.5);',
    result: '0',
    simulatorDefault: 'SLEEP(1)'
  },

  // ==========================================
  // 12. SPATIALES (GIS)
  // ==========================================
  {
    id: 'spat-geom',
    name: 'Point(), LineString(), Polygon()',
    category: 'spatial',
    level: 'advanced',
    syntax: 'Point(x, y), LineString(p1, p2), Polygon(ls)',
    role: 'Constructeurs de formes géométriques spatiales (coordonnées cartésiennes ou GPS).',
    example: 'SELECT ST_AsText(Point(2.3522, 48.8566));',
    result: "'POINT(2.3522 48.8566)'",
    cause: "ST_AsText() convertit l'objet spatial binaire en texte WKT (Well-Known Text) lisible par l'humain.",
    simulatorDefault: 'ST_AsText(Point(2, 3))'
  },
  {
    id: 'spat-relations',
    name: 'ST_Distance(), ST_Contains(), ST_Within()',
    category: 'spatial',
    level: 'advanced',
    syntax: 'ST_Distance(g1, g2), ST_Contains(A, B)',
    role: 'Calcule la distance minimale entre deux géométries ou teste si B est contenu dans A.',
    example: "SELECT ST_Distance(ST_GeomFromText('POINT(0 0)'), ST_GeomFromText('POINT(3 4)'));",
    result: '5',
    cause: "Théorème de Pythagore : sqrt((3-0)^2 + (4-0)^2) = sqrt(25) = 5.",
    simulatorDefault: "ST_Distance(Point(0,0), Point(3,4))"
  },

  // ==========================================
  // 13. OPÉRATIONS BIT (Bitwise)
  // ==========================================
  {
    id: 'bit-ops',
    name: '&, |, ^, ~, <<, >>',
    category: 'bit',
    level: 'advanced',
    syntax: 'a & b (AND), a | b (OR), a ^ b (XOR), ~a (NOT), a << n, a >> n',
    role: 'Effectue des opérations arithmétiques bit à bit sur les représentations binaires des nombres.',
    example: 'SELECT 5 & 3;',
    result: '1',
    cause: "5 en binaire = 0101, 3 en binaire = 0011. Le AND bit à bit donne 0001 = 1.",
    simulatorDefault: '5 & 3'
  },
  {
    id: 'bit-count',
    name: 'BIT_COUNT()',
    category: 'bit',
    level: 'advanced',
    syntax: 'BIT_COUNT(N)',
    role: 'Compte le nombre de bits positionnés à 1 dans la représentation binaire du nombre.',
    example: 'SELECT BIT_COUNT(7);',
    result: '3',
    cause: "7 en binaire s'écrit 0111. Il y a 3 bits à '1', le résultat est donc 3.",
    simulatorDefault: 'BIT_COUNT(7)'
  },

  // ==========================================
  // 14. JSON
  // ==========================================
  {
    id: 'json-extract',
    name: 'JSON_EXTRACT() / -> / ->>',
    category: 'json',
    level: 'intermediate',
    syntax: "JSON_EXTRACT(doc, path) ou doc->'$.cle' ou doc->>'$.cle'",
    role: 'Extrait une valeur à l’intérieur d’un document JSON à l’aide d’un chemin $ (->> enlève les guillemets).',
    example: "SELECT JSON_EXTRACT('{\"nom\":\"Ahmed\",\"age\":18}', '$.nom');",
    result: "'\"Ahmed\"'",
    cause: "-> renvoie une valeur JSON avec guillemets '\"Ahmed\"'. L'opérateur ->> est un raccourci de JSON_UNQUOTE(JSON_EXTRACT(...)) et renvoie directement 'Ahmed' sans guillemets.",
    tableExample: {
      schema: "Profils (id INT, donnees JSON)",
      query: "SELECT id, donnees->>'$.ville' AS ville FROM Profils WHERE donnees->'$.age' >= 18;",
      output: "Filtre directement sur une clé JSON indexable.",
      explanation: "Permet d'exploiter la flexibilité du NoSQL au sein d'une table MySQL relationnelle."
    },
    simulatorDefault: "JSON_EXTRACT('{\"nom\":\"Ahmed\"}', '$.nom')"
  },
  {
    id: 'json-construct',
    name: 'JSON_OBJECT() / JSON_ARRAY()',
    category: 'json',
    level: 'intermediate',
    syntax: "JSON_OBJECT(cle, val, ...) / JSON_ARRAY(v1, v2, ...)",
    role: 'Construit dynamiquement un objet JSON ou un tableau JSON.',
    example: "SELECT JSON_OBJECT('nom', 'Ahmed', 'age', 18);",
    result: "'{\"nom\": \"Ahmed\", \"age\": 18}'",
    simulatorDefault: "JSON_OBJECT('nom', 'Ahmed', 'note', 20)"
  },
  {
    id: 'json-modify',
    name: 'JSON_SET() vs JSON_INSERT() vs JSON_REPLACE()',
    category: 'json',
    level: 'intermediate',
    syntax: "JSON_SET(doc, path, val) / JSON_INSERT / JSON_REPLACE",
    role: 'Modifie des données JSON : SET ajoute ou remplace, INSERT ajoute seulement, REPLACE remplace seulement.',
    example: "SELECT JSON_SET('{\"nom\":\"Ahmed\"}', '$.age', 18);",
    result: "'{\"nom\": \"Ahmed\", \"age\": 18}'",
    cause: "TABLEAU RÉCAPITULATIF : JSON_SET remplace si existe et ajoute si n'existe pas. JSON_INSERT n'ajoute que si la clé est absente. JSON_REPLACE ne fait rien si la clé est absente.",
    simulatorDefault: "JSON_SET('{\"nom\":\"Ahmed\"}', '$.ville', 'Rabat')"
  },
  {
    id: 'json-table',
    name: 'JSON_TABLE()',
    category: 'json',
    level: 'advanced',
    syntax: "JSON_TABLE(doc, '$[*]' COLUMNS (...))",
    role: 'Transforme un document ou tableau JSON en véritables lignes et colonnes SQL relationnelles.',
    example: "SELECT * FROM JSON_TABLE('[{\"id\":1,\"nom\":\"Ahmed\"},{\"id\":2,\"nom\":\"Sara\"}]', '$[*]' COLUMNS (id INT PATH '$.id', nom VARCHAR(50) PATH '$.nom')) AS t;",
    result: '1 | Ahmed\n2 | Sara',
    cause: "Permet de faire des JOIN, GROUP BY et WHERE SQL directement sur des données initialement stockées en JSON.",
    simulatorDefault: 'JSON_VALID(\'{"nom":"Ahmed"}\')'
  }
];
