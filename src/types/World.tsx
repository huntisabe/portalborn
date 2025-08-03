import { Region } from './Region';

export interface World {
  id: string;
  name: string;
  ruleset: string;
  description?: string;
  enabledRaces: string[]; // race IDs
  enabledClasses: string[]; // class IDs
  enabledSubclasses: string[]; // subclass IDs
  enabledBackgrounds: string[]; // background IDs
  regions: Region[];
}
