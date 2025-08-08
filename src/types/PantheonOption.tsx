export type Ideal = 'deity' | 'cause';

export interface PantheonOption {
  id: string;
  name: string;
  type: Ideal | '';
  domains: string[];
  alignments: string[];
  description?: string;
  regions?: string[];
}
