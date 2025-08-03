import React, { useState, useEffect } from 'react';

interface Race {
  id: string;
  label: string;
}

interface Props {
  enabledRaces: Race[]; // races enabled in the world or region
  raceDistribution: { [raceId: string]: number }; // current percentages
  onChange: (updatedDistribution: { [raceId: string]: number }) => void;
}

export default function RacialDemographicsCustomizer({
  enabledRaces,
  raceDistribution,
  onChange,
}: Props) {
  const [localDistribution, setLocalDistribution] = useState<{
    [raceId: string]: number;
  }>({});

  // Initialize local state on mount or when raceDistribution changes
  useEffect(() => {
    // Start with raceDistribution, fill missing races with 0
    const initial = enabledRaces.reduce(
      (acc, race) => {
        acc[race.id] = raceDistribution[race.id] ?? 0;
        return acc;
      },
      {} as { [raceId: string]: number },
    );
    setLocalDistribution(initial);
  }, [enabledRaces, raceDistribution]);

  const handleChange = (raceId: string, value: string) => {
    let num = parseInt(value, 10);
    if (Number.isNaN(num) || num < 0) num = 0;
    if (num > 100) num = 100;

    const updated = { ...localDistribution, [raceId]: num };
    setLocalDistribution(updated);
    onChange(updated);
  };

  const total = Object.values(localDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Race Demographics</h3>
      <p>
        Total:{' '}
        <span className={total === 100 ? 'text-green-600' : 'text-red-600'}>
          {total}%
        </span>{' '}
        (Must total exactly 100%)
      </p>

      <div className="grid grid-cols-1 gap-2 max-w-sm">
        {enabledRaces.map((race) => (
          <div key={race.id} className="flex items-center gap-2">
            <label htmlFor={`race-${race.id}`} className="flex-1">
              {race.label}
            </label>
            <input
              id={`${race.id}`}
              type="number"
              min={0}
              max={100}
              value={localDistribution[race.id] ?? 0}
              onChange={(e) => handleChange(race.id, e.target.value)}
              className="w-16 border rounded px-2 py-1 text-right"
            />
            <span>%</span>
          </div>
        ))}
      </div>

      {total !== 100 && (
        <p className="text-red-600 font-semibold">
          The total percentage must equal 100% before saving.
        </p>
      )}
    </div>
  );
}
