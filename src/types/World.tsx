import { Region } from './Region';
import { PantheonOption } from './PantheonOption';
import { NameList } from './NameList';

export interface World {
  id: string;
  name: string;
  ruleset: '5e-2014' | '5e-2024';
  homebrew: boolean;
  description: string;
  enabledRaces: string[];
  enabledClasses: string[];
  enabledSubclasses: string[];
  enabledBackgrounds: string[];
  regions: Region[];
  pantheon: PantheonOption[];
  nameLists: NameList[];
}
