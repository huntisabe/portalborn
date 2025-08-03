import React, { useState } from 'react';
import RacialDemographicsCustomizer from './RacialDemographicsCustomizer';
import { Region } from '../types/Region';
import { Location } from '../types/Location';
import { Option } from './OptionSelector';

interface RegionEditorProps {
  initialRegion?: Region;
  onSave: (region: Region) => void;
  onCancel: () => void;
  enabledRaces: Option[];
  enabledBackgrounds: Option[];
}

function LocationList({
  locations,
  setLocations,
  enabledBackgrounds,
}: {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  enabledBackgrounds: Option[];
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempLocation, setTempLocation] = useState<Location | null>(null);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setTempLocation({ ...locations[index] });
  };

  const startAdd = () => {
    setEditingIndex(-1);
    setTempLocation({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      enabledBackgrounds: [],
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setTempLocation(null);
  };

  const saveLocation = () => {
    if (!tempLocation?.name.trim()) {
      alert('Location name is required.');
      return;
    }

    setLocations((prev) => {
      if (editingIndex === -1) {
        return [...prev, tempLocation];
      }
      if (editingIndex !== null) {
        const updated = [...prev];
        updated[editingIndex] = tempLocation;
        return updated;
      }
      return prev;
    });
    cancelEdit();
  };

  const deleteLocation = (index: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setLocations((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const toggleBackground = (id: string) => {
    if (!tempLocation) return;
    setTempLocation((prev) =>
      prev
        ? {
            ...prev,
            enabledBackgrounds: prev.enabledBackgrounds.includes(id)
              ? prev.enabledBackgrounds.filter((bg) => bg !== id)
              : [...prev.enabledBackgrounds, id],
          }
        : null,
    );
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Locations</h3>

      {locations.length === 0 && (
        <p className="text-sm text-gray-500">No locations yet.</p>
      )}

      <ul className="space-y-2">
        {locations.map((loc, index) => (
          <li
            key={loc.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{loc.name}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(index)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteLocation(index)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingIndex !== null && tempLocation && (
        <div className="border rounded p-3 mt-3 space-y-2">
          <label className="block font-semibold">Name</label>
          <input
            className="w-full border px-2 py-1 rounded"
            value={tempLocation.name}
            onChange={(e) =>
              setTempLocation({ ...tempLocation, name: e.target.value })
            }
          />

          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border px-2 py-1 rounded"
            value={tempLocation.description}
            onChange={(e) =>
              setTempLocation({ ...tempLocation, description: e.target.value })
            }
          />

          <label className="block font-semibold">Enabled Backgrounds</label>
          <div className="grid grid-cols-2 gap-2">
            {enabledBackgrounds.map((bg) => (
              <div key={bg.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tempLocation.enabledBackgrounds.includes(bg.id)}
                  onChange={() => toggleBackground(bg.id)}
                />
                <span>{bg.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={saveLocation}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingIndex === null && (
        <button
          type="button"
          className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
          onClick={startAdd}
        >
          Add Location
        </button>
      )}
    </div>
  );
}

export default function RegionEditor({
  initialRegion,
  onSave,
  onCancel,
  enabledRaces,
  enabledBackgrounds,
}: RegionEditorProps) {
  const [name, setName] = useState(initialRegion?.name || '');
  const [description, setDescription] = useState('');
  const [racialDemographics, setRacialDemographics] = useState(
    initialRegion?.racialDemographics || {},
  );
  const [locations, setLocations] = useState<Location[]>(
    initialRegion?.locations || [],
  );

  const handleSave = () => {
    const regionData: Region = {
      ...initialRegion,
      id: initialRegion?.id || crypto.randomUUID(),
      name,
      racialDemographics,
      locations,
    };

    onSave(regionData);
  };

  return (
    <div className="space-y-4 overflow-y-auto flex-1">
      <div>
        <label className="block font-semibold">Region Name</label>
        <input
          type="text"
          id="regionName"
          className="w-full border rounded px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Race distribution editor placeholder */}
      <RacialDemographicsCustomizer
        enabledRaces={enabledRaces}
        raceDistribution={racialDemographics}
        onChange={setRacialDemographics}
      />

      <LocationList
        locations={locations}
        setLocations={setLocations}
        enabledBackgrounds={enabledBackgrounds}
      />

      <div className="flex gap-2">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
