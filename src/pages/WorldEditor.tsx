import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { World } from '../types/World';
import { Region } from '../types/Region';
import RegionEditor from '../components/RegionEditor';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import OptionSelector, { Option } from '../components/OptionSelector';

import { useSettings } from '../context/SettingsContext';

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
    ...homebrewData, // overwrites duplicates with homebrew version
  };
}

function WorldEdit() {
  const { worldId } = useParams<{ worldId: string }>();
  const isEditing = !!worldId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ruleset, setRuleset] = useState<Ruleset | ''>('5e-2014'); // Default to 5e-2014
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
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState<Region | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const navigate = useNavigate();

  const handleAddRegion = () => {
    setEditingRegion(null);
    setIsModalOpen(true);
  };

  const handleEditRegion = (region: Region) => {
    setEditingRegion(region);
    setIsModalOpen(true);
  };

  const handleDeleteRegionClick = (region: Region) => {
    setRegionToDelete(region);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (regionToDelete) {
      setRegions((prev) => prev.filter((r) => r.id !== regionToDelete.id));
    }
    setIsConfirmOpen(false);
    setRegionToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setRegionToDelete(null);
  };

  const handleSaveRegion = (region: Region) => {
    setRegions((prev) => {
      const exists = prev.find((r) => r.id === region.id);
      if (exists) {
        return prev.map((r) => (r.id === region.id ? region : r));
      }
      return [...prev, region];
    });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Load world data if editing
  const { getWorldById } = useSettings();

  useEffect(() => {
    if (!isEditing) return;

    const world = getWorldById(worldId!);

    if (world) {
      setName(world.name);
      setDescription(world.description || '');
      setRuleset(world.ruleset as Ruleset);
      setEnabledClasses(world.enabledClasses);
      setEnabledSubclasses(world.enabledSubclasses);
      setEnabledRaces(world.enabledRaces);
      setEnabledBackgrounds(world.enabledBackgrounds);
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

          // Only merge if the homebrew data is valid (non-empty object)
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

      // Convert to OptionSelector format
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
                id: `${cls.id}:${sub.id}`,
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

  const toggle = (
    list: string[],
    id: string,
    setList: (list: string[]) => void,
  ) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  const { addWorld, updateWorld } = useSettings();

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
      const parentId = subId.split(':')[0];
      return !enabledClasses.includes(parentId);
    });

    if (orphanSubclasses.length > 0) {
      alert(
        'Some subclasses are enabled without their parent class. Please enable the parent class.',
      );
      return;
    }

    // Validate classes with subclasses
    const classHasSubclass = (classId: string) =>
      allSubclasses.some(
        (sub) =>
          sub.id.startsWith(`${classId}:`) &&
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
      enabledClasses,
      enabledSubclasses,
      enabledRaces,
      enabledBackgrounds,
      regions: [],
    };

    // Save to disk or context — replace with your actual logic
    console.log(isEditing ? 'Updating world:' : 'Creating world:', worldData);

    // Simulating saving to localStorage - replace with your actual storage logic

    if (isEditing) {
      updateWorld(worldData);
      alert('World updated successfully!');
    } else {
      addWorld(worldData);
      alert('World created successfully!');
    }

    // Navigate back to world list
    navigate('/worldbuilder');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {isEditing ? 'Edit World' : 'Create New World'}
      </h1>

      <div className="space-y-2">
        <div className="block font-semibold">World Name</div>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="block font-semibold">Description</div>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <div className="block font-semibold">Ruleset</div>
        <select
          value={ruleset}
          onChange={(e) => setRuleset(e.target.value as Ruleset | '')}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select a ruleset</option>
          <option value="5e-2014">5e 2014</option>
          <option value="5e-2024">5e 2024</option>
        </select>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="homebrew-toggle"
          checked={includeHomebrew}
          onChange={(e) => setIncludeHomebrew(e.target.checked)}
        />
        <label htmlFor="homebrew-toggle" className="font-medium">
          Include Homebrew Content
        </label>
      </div>

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
            disabled: !enabledClasses.includes(sub.id.split(':')[0]),
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
          onToggle={(id) =>
            toggle(enabledBackgrounds, id, setEnabledBackgrounds)
          }
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Regions</h2>

        {/* Region list */}
        {regions.length === 0 ? (
          <p className="text-gray-500">No regions added yet.</p>
        ) : (
          <ul className="space-y-2">
            {regions.map((region) => (
              <li
                key={region.id}
                className="flex justify-between border p-2 rounded"
              >
                <span>{region.name}</span>
                <button
                  type="button"
                  onClick={() => handleEditRegion(region)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRegionClick(region)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add button */}
        <button
          type="button"
          onClick={handleAddRegion}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Add Region
        </button>

        {/* Editor modal / inline */}
        <Modal isOpen={isModalOpen} onClose={handleCancel}>
          <RegionEditor
            initialRegion={editingRegion || undefined}
            onSave={handleSaveRegion}
            onCancel={handleCancel}
            enabledRaces={allRaces.filter((race) =>
              enabledRaces.includes(race.id),
            )}
            enabledBackgrounds={allBackgrounds.filter((bkg) =>
              enabledBackgrounds.includes(bkg.id),
            )}
          />
        </Modal>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          message={`Are you sure you want to delete the region "${regionToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>

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
