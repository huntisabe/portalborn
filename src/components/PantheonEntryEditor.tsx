import React, { useState } from 'react';
import OptionSelector, { Option } from './OptionSelector';
import { PantheonOption } from '../types/PantheonOption';

const ALL_ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
];

type PantheonType = 'deity' | 'cause';

interface PantheonEntryEditorProps {
  initialEntry?: PantheonOption;
  allDomains: Option[];
  allRegions: Option[];
  onSave: (pantheon: PantheonOption) => void;
  onCancel: () => void;
}

export default function PantheonEntryEditor({
  initialEntry,
  allDomains,
  allRegions,
  onSave,
  onCancel,
}: PantheonEntryEditorProps) {
  const [name, setName] = useState(initialEntry?.name ?? '');
  const [description, setDescription] = useState(
    initialEntry?.description ?? '',
  );
  const [type, setType] = useState<PantheonType | ''>(initialEntry?.type ?? '');
  const [domains, setDomains] = useState(initialEntry?.domains ?? []);
  const [alignments, setAlignments] = useState(initialEntry?.alignments ?? []);
  const [regions, setRegions] = useState(initialEntry?.regions ?? []);

  const handleSave = () => {
    const entryData: PantheonOption = {
      ...initialEntry,
      id: initialEntry?.id || crypto.randomUUID(),
      name,
      description,
      type,
      domains,
      alignments,
      regions,
    };
    onSave(entryData);
  };

  return (
    <div className="space-y-4 overflow-y-auto flex-1">
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="block font-semibold">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as PantheonType | '')}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select deity or cause</option>
          <option value="deity">Deity</option>
          <option value="cause">Cause</option>
        </select>
      </div>

      <OptionSelector
        title="Domains"
        options={allDomains}
        selected={domains}
        onToggle={(ids: string, replace?: boolean) => {
          if (replace) {
            setDomains([ids]);
          } else {
            setDomains((prev) =>
              prev.includes(ids)
                ? prev.filter((id) => id !== ids)
                : [...prev, ids],
            );
          }
        }}
      />

      <OptionSelector
        title="Alignments"
        options={ALL_ALIGNMENTS.map((a) => ({ id: a, label: a }))}
        selected={alignments}
        onToggle={(ids: string, replace?: boolean) => {
          if (replace) {
            setAlignments([ids]);
          } else {
            setAlignments((prev) =>
              prev.includes(ids)
                ? prev.filter((id) => id !== ids)
                : [...prev, ids],
            );
          }
        }}
      />

      <OptionSelector
        title="Regions"
        options={allRegions}
        selected={regions}
        onToggle={(ids: string, replace?: boolean) => {
          if (replace) {
            setRegions([ids]);
          } else {
            setRegions((prev) =>
              prev.includes(ids)
                ? prev.filter((id) => id !== ids)
                : [...prev, ids],
            );
          }
        }}
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
