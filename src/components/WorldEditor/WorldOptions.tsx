import React from 'react';
import OptionSelector, { Option } from '../OptionSelector';

type Ruleset = '5e-2014' | '5e-2024';

interface WorldOptionsProps {
  allClasses: Option[];
  enabledClasses: string[];
  setEnabledClasses: React.Dispatch<React.SetStateAction<string[]>>;
  allSubclasses: Option[];
  enabledSubclasses: string[];
  setEnabledSubclasses: React.Dispatch<React.SetStateAction<string[]>>;
  allRaces: Option[];
  enabledRaces: string[];
  setEnabledRaces: React.Dispatch<React.SetStateAction<string[]>>;
  allBackgrounds: Option[];
  enabledBackgrounds: string[];
  setEnabledBackgrounds: React.Dispatch<React.SetStateAction<string[]>>;
  ruleset: Ruleset | '';
  includeHomebrew: boolean;
}

export default function WorldOptions({
  allClasses,
  enabledClasses,
  setEnabledClasses,
  allSubclasses,
  enabledSubclasses,
  setEnabledSubclasses,
  allRaces,
  enabledRaces,
  setEnabledRaces,
  allBackgrounds,
  enabledBackgrounds,
  setEnabledBackgrounds,
  ruleset,
  includeHomebrew,
}: WorldOptionsProps) {
  const toggle = (
    list: string[],
    id: string,
    setList: (list: string[]) => void,
  ) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <OptionSelector
        title="Classes"
        options={allClasses}
        selected={enabledClasses}
        onToggle={(id) => toggle(enabledClasses, id, setEnabledClasses)}
      />
      <OptionSelector
        title="Subclasses"
        options={allSubclasses.map((sub) => ({
          ...sub,
          disabled: !enabledClasses.includes(sub.id.split('_')[0]),
        }))}
        selected={enabledSubclasses}
        onToggle={(id) => toggle(enabledSubclasses, id, setEnabledSubclasses)}
      />
      <OptionSelector
        title="Races"
        options={allRaces}
        selected={enabledRaces}
        onToggle={(id) => toggle(enabledRaces, id, setEnabledRaces)}
      />
      <OptionSelector
        title="Backgrounds"
        options={allBackgrounds}
        selected={enabledBackgrounds}
        onToggle={(id) => toggle(enabledBackgrounds, id, setEnabledBackgrounds)}
      />
    </div>
  );
}
