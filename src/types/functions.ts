export type FunctionCategoryKey =
  | 'control_flow'
  | 'numeric'
  | 'string'
  | 'date_time'
  | 'aggregate'
  | 'window'
  | 'conversion'
  | 'comparison'
  | 'information'
  | 'encryption'
  | 'misc'
  | 'spatial'
  | 'bit'
  | 'json';

export type FunctionLevel = 'fundamental' | 'intermediate' | 'advanced';

export interface MySQLFunction {
  id: string;
  name: string;
  category: FunctionCategoryKey;
  level: FunctionLevel;
  syntax: string;
  role: string;
  example: string;
  result: string;
  cause?: string; // "si existe ecrire, else n'est pas écrit"
  tableExample?: {
    schema?: string;
    query: string;
    output: string;
    explanation?: string;
  };
  tips?: string[];
  simulatorDefault?: string;
}

export interface FunctionCategory {
  key: FunctionCategoryKey;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}
