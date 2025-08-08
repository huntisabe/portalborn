import React from 'react';

type Ruleset = '5e-2014' | '5e-2024';

interface WorldOverviewProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  ruleset: Ruleset | '';
  setRuleset: React.Dispatch<React.SetStateAction<Ruleset | ''>>;
  includeHomebrew: boolean;
  setIncludeHomebrew: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
}

export default function WorldOverview({
  name,
  setName,
  description,
  setDescription,
  ruleset,
  setRuleset,
  includeHomebrew,
  setIncludeHomebrew,
  isEditing,
}: WorldOverviewProps) {
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
        <label
          htmlFor="homebrew-toggle"
          className="font-medium flex items-center gap-2"
        >
          <input
            type="checkbox"
            id="homebrew-toggle"
            checked={includeHomebrew}
            onChange={(e) => setIncludeHomebrew(e.target.checked)}
          />
          Include Homebrew Content
        </label>
      </div>
    </div>
  );
}
