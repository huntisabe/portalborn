import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { World } from '../types/World';
import { Region } from '../types/Region';
import { NameList } from '../types/NameList';
import Tabs from '../components/Tabs';
import { Option } from '../components/OptionSelector';

import { useSettings } from '../context/SettingsContext';
import WorldOverview from '../components/WorldEditor/WorldOverview';
import WorldOptions from '../components/WorldEditor/WorldOptions';
import WorldRegions from '../components/WorldEditor/WorldRegions';
import { PantheonOption } from '../types/PantheonOption';
import WorldPantheon from '../components/WorldEditor/WorldPantheon';
import WorldNameLists from '../components/WorldEditor/WorldNameLists';

type Ruleset = '5e-2014' | '5e-2024';

const dataFiles = {
  '5e-2014': {
    classes: () => import('../data/5e-2014/Classes.json'),
    races: () => import('../data/5e-2014/Races.json'),
    backgrounds: () => import('../data/5e-2014/Backgrounds.json'),
  },
  '5e-2024': {
    classes: () => import('../data/5e-2024/Classes.json'),
    races: () => import('../data/5e-2024/Races.json'),
    backgrounds: () => import('../data/5e-2024/Backgrounds.json'),
  },
  homebrew: {
    classes: () => import('../data/homebrew/Classes.json'),
    races: () => import('../data/homebrew/Races.json'),
    backgrounds: () => import('../data/homebrew/Backgrounds.json'),
  },
} as const;

function mergeData<T extends Record<string, any>>(
  baseData: T,
  homebrewData: Partial<T>,
): T {
  return {
    ...baseData,
    ...homebrewData,
  };
}

function WorldEdit() {
  const [activeTab, setActiveTab] = useState('overview');

  const { worldId } = useParams<{ worldId: string }>();
  const isEditing = !!worldId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ruleset, setRuleset] = useState<Ruleset | ''>('5e-2014');
  const [includeHomebrew, setIncludeHomebrew] = useState(false);

  const [allClasses, setAllClasses] = useState<Option[]>([]);
  const [allSubclasses, setAllSubclasses] = useState<Option[]>([]);
  const [allRaces, setAllRaces] = useState<Option[]>([]);
  const [allBackgrounds, setAllBackgrounds] = useState<Option[]>([]);

  const [enabledClasses, setEnabledClasses] = useState<string[]>([]);
  const [enabledSubclasses, setEnabledSubclasses] = useState<string[]>([]);
  const [enabledRaces, setEnabledRaces] = useState<string[]>([]);
  const [enabledBackgrounds, setEnabledBackgrounds] = useState<string[]>([]);

  const [regions, setRegions] = useState<Region[]>([]);

  const [pantheon, setPantheon] = useState<PantheonOption[]>([]);

  const [nameLists, setNameLists] = useState<NameList[]>([]);

  const navigate = useNavigate();

  const { getWorldById } = useSettings();

  useEffect(() => {
    if (!isEditing) return;

    const world = getWorldById(worldId!);

    if (world) {
      setName(world.name);
      setDescription(world.description);
      setRuleset(world.ruleset as Ruleset);
      setIncludeHomebrew(world.homebrew);
      setEnabledClasses(world.enabledClasses);
      setEnabledSubclasses(world.enabledSubclasses);
      setEnabledRaces(world.enabledRaces);
      setEnabledBackgrounds(world.enabledBackgrounds);
      setRegions(world.regions);
      setPantheon(world.pantheon);
      setNameLists(world.nameLists);
    } else {
      console.error(`World with ID ${worldId} not found`);
      alert('The world you are trying to edit does not exist.');
      navigate('/worldbuilder');
    }
  }, [isEditing, worldId, getWorldById, navigate]);

  // Load available options from JSON
  useEffect(() => {
    if (!ruleset) return;

    const loadData = async () => {
      // Load base data
      const [classesBase, racesBase, backgroundsBase] = await Promise.all([
        dataFiles[ruleset].classes().then((mod) => mod.default),
        dataFiles[ruleset].races().then((mod) => mod.default),
        dataFiles[ruleset].backgrounds().then((mod) => mod.default),
      ]);

      let classes = classesBase;
      let races = racesBase;
      let backgrounds = backgroundsBase;

      if (includeHomebrew) {
        try {
          const [classesHB, racesHB, backgroundsHB] = await Promise.all([
            dataFiles.homebrew.classes().then((mod) => mod.default),
            dataFiles.homebrew.races().then((mod) => mod.default),
            dataFiles.homebrew.backgrounds().then((mod) => mod.default),
          ]);

          if (classesHB && Object.keys(classesHB).length > 0) {
            classes = mergeData(classesBase, classesHB);
          }
          if (racesHB && Object.keys(racesHB).length > 0) {
            races = mergeData(racesBase, racesHB);
          }
          if (backgroundsHB && Object.keys(backgroundsHB).length > 0) {
            backgrounds = mergeData(backgroundsBase, backgroundsHB);
          }
        } catch (error) {
          console.error('Error loading homebrew data:', error);
        }
      }

      setAllClasses(
        Object.values(classes).map((cls: any) => ({
          id: cls.id,
          label: cls.name,
          disabled: false,
        })),
      );

      setAllSubclasses(
        Object.values(classes).flatMap((cls: any) =>
          cls.subclasses
            ? Object.values(cls.subclasses).map((sub: any) => ({
                id: `${cls.id}_${sub.id}`,
                label: `${sub.name} (${cls.name})`,
                disabled: false,
              }))
            : [],
        ),
      );

      setAllRaces(
        Object.values(races).map((race: any) => ({
          id: race.id,
          label: race.name,
          disabled: false,
        })),
      );

      setAllBackgrounds(
        Object.values(backgrounds).map((bg: any) => ({
          id: bg.id,
          label: bg.name,
          disabled: false,
        })),
      );
    };

    loadData().catch(console.error);
  }, [ruleset, includeHomebrew]);

  const { addWorld, updateWorld } = useSettings();

  const allDomains: Option[] = React.useMemo(() => {
    return enabledSubclasses
      .filter((sub) => sub.startsWith('cleric_') || sub.startsWith('paladin_'))
      .map((subId) => {
        const found = allSubclasses.find((s) => s.id === subId);
        return {
          label: found ? found.label : subId,
          id: subId,
        };
      });
  }, [enabledSubclasses, allSubclasses]);

  const handleSave = () => {
    // Validate required fields
    if (!name.trim()) {
      alert('Please enter a world name');
      return;
    }

    if (!ruleset) {
      alert('Please select a ruleset');
      return;
    }

    // Validate subclasses
    const orphanSubclasses = enabledSubclasses.filter((subId) => {
      const parentId = subId.split('_')[0];
      return !enabledClasses.includes(parentId);
    });

    if (orphanSubclasses.length > 0) {
      alert(
        'Some subclasses are enabled without their parent class. Please enable the parent class.',
      );
      return;
    }

    const classHasSubclass = (classId: string) =>
      allSubclasses.some(
        (sub) =>
          sub.id.startsWith(`${classId}_`) &&
          enabledSubclasses.includes(sub.id),
      );

    const classesNeedingSubclass = enabledClasses.filter(
      (classId) =>
        allSubclasses.some((sub) => sub.id.startsWith(`${classId}:`)) &&
        !classHasSubclass(classId),
    );

    if (classesNeedingSubclass.length > 0) {
      alert(
        'Some classes have no enabled subclasses. Please enable at least one subclass for each.',
      );
      return;
    }
    const worldData: World = {
      id: isEditing ? worldId! : crypto.randomUUID(),
      name,
      description,
      ruleset,
      homebrew: includeHomebrew,
      enabledClasses,
      enabledSubclasses,
      enabledRaces,
      enabledBackgrounds,
      regions,
      pantheon,
      nameLists,
    };

    console.log(isEditing ? 'Updating world:' : 'Creating world:', worldData);

    if (isEditing) {
      updateWorld(worldData);
      alert('World updated successfully!');
    } else {
      addWorld(worldData);
      alert('World created successfully!');
    }

    navigate('/worldbuilder');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Tabs
        tabs={[
          { label: 'Overview', value: 'overview' },
          { label: 'Options', value: 'options' },
          { label: 'Regions', value: 'regions' },
          { label: 'Pantheon', value: 'pantheon' },
          { label: 'Name Lists', value: 'names' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'overview' && (
        <WorldOverview
          name={name}
          description={description}
          ruleset={ruleset}
          includeHomebrew={includeHomebrew}
          setName={setName}
          setDescription={setDescription}
          setRuleset={setRuleset}
          setIncludeHomebrew={setIncludeHomebrew}
          isEditing={isEditing}
        />
      )}

      {activeTab === 'options' && (
        <WorldOptions
          allClasses={allClasses}
          enabledClasses={enabledClasses}
          setEnabledClasses={setEnabledClasses}
          allSubclasses={allSubclasses}
          enabledSubclasses={enabledSubclasses}
          setEnabledSubclasses={setEnabledSubclasses}
          allRaces={allRaces}
          enabledRaces={enabledRaces}
          setEnabledRaces={setEnabledRaces}
          allBackgrounds={allBackgrounds}
          enabledBackgrounds={enabledBackgrounds}
          setEnabledBackgrounds={setEnabledBackgrounds}
          ruleset={ruleset}
          includeHomebrew={includeHomebrew}
        />
      )}

      {activeTab === 'regions' && (
        <WorldRegions
          regions={regions}
          setRegions={setRegions}
          allRaces={allRaces}
          enabledRaces={enabledRaces}
          allBackgrounds={allBackgrounds}
          enabledBackgrounds={enabledBackgrounds}
        />
      )}

      {activeTab === 'pantheon' && (
        <WorldPantheon
          pantheon={pantheon}
          setPantheon={setPantheon}
          regions={regions}
          enabledDomains={allDomains}
        />
      )}

      {activeTab === 'names' && (
        <WorldNameLists
          nameLists={nameLists}
          setNameLists={setNameLists}
          availableRaces={allRaces.filter((race) =>
            enabledRaces.includes(race.id),
          )}
          availableRegions={regions.map((region) => ({
            id: region.id,
            label: region.name,
            disabled: false,
          }))}
        />
      )}

      <div className="flex space-x-4">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          {isEditing ? 'Update World' : 'Save World'}
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => navigate('/worldbuilder')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default WorldEdit;
