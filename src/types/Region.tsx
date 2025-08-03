import { Location } from './Location';

export interface Region {
  id: string;
  name: string;
  description?: string;
  locations: Location[];
  racialDemographics: { [raceId: string]: number };
  regionalDeities?: string[]; // deity ids
}
