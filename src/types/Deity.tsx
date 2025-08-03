export interface Deity {
  id: string;
  name: string;
  domain: string; // e.g., "Grave", "Light"
  alignment: string; // e.g., "Chaotic Good"
  description?: string;
  global: boolean; // If true, automatically applies to all regions
}
