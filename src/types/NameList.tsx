export interface Assignment {
  raceId: string;
  regionId: string | null;
}

export interface NameList {
  id: string;
  name: string;
  masculine: string[];
  feminine: string[];
  other: string[];
  surnames: string[];
  assignments: Assignment[];
}
