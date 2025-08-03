export interface Subclass {
  id: string;
  name: string;
}

export interface CharacterClass {
  id: string;
  name: string;
  subclasses: Subclass[];
}
