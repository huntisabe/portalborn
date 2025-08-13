import React, { useState } from 'react';
import { Option } from '../OptionSelector';
import { NameList, Assignment } from '../../types/NameList';

interface WorldNameListsProps {
  nameLists: NameList[];
  setNameLists: (lists: NameList[]) => void;
  availableRaces: Option[];
  availableRegions: Option[];
}

function WorldNameLists({
  nameLists,
  setNameLists,
  availableRaces,
  availableRegions,
}: WorldNameListsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedList = nameLists.find((list) => list.id === selectedId) || null;

  const handleAddList = () => {
    const newList: NameList = {
      id: `list_${Date.now()}`,
      name: 'New Name List',
      masculine: [],
      feminine: [],
      other: [],
      surnames: [],
      assignments: [],
    };
    setNameLists([...nameLists, newList]);
    setSelectedId(newList.id);
  };

  const handleDeleteList = (id: string) => {
    if (window.confirm('Delete this name list?')) {
      setNameLists(nameLists.filter((list) => list.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const updateSelectedList = (updates: Partial<NameList>) => {
    if (!selectedList) return;
    setNameLists(
      nameLists.map((list) =>
        list.id === selectedList.id ? { ...list, ...updates } : list,
      ),
    );
  };

  const handleAddAssignment = () => {
    if (!selectedList) return;
    const newAssignment: Assignment = { raceId: '', regionId: null };
    updateSelectedList({
      assignments: [...selectedList.assignments, newAssignment],
    });
  };

  const handleAssignmentChange = (
    index: number,
    field: keyof Assignment,
    value: string | null,
  ) => {
    if (!selectedList) return;
    const updated = [...selectedList.assignments];
    (updated[index] as any)[field] = value;
    updateSelectedList({ assignments: updated });
  };

  const handleDeleteAssignment = (index: number) => {
    if (!selectedList) return;
    const updated = [...selectedList.assignments];
    updated.splice(index, 1);
    updateSelectedList({ assignments: updated });
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div
        style={{
          width: '250px',
          borderRight: '1px solid #ccc',
          padding: '0.5rem',
        }}
      >
        <h2 className="text-xl font-bold">Name Lists</h2>
        <button
          type="button"
          onClick={handleAddList}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Add Name List
        </button>
        <ul>
          {nameLists.map((list) => (
            <li
              key={list.id}
              style={{
                padding: '0.25rem',
                background: 'transparent',
                listStyle: 'none',
              }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: list.id === selectedId ? '#eef' : 'transparent',
                  border: 'none',
                  padding: '0.25rem',
                  cursor: 'pointer',
                }}
                aria-pressed={list.id === selectedId}
                onClick={() => setSelectedId(list.id)}
              >
                {list.name}
              </button>
              <button
                type="button"
                style={{ marginLeft: '0.5rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteList(list.id);
                }}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1, padding: '0.5rem' }}>
        {selectedList ? (
          <>
            <input
              type="text"
              value={selectedList.name}
              onChange={(e) => updateSelectedList({ name: e.target.value })}
              placeholder="List Name"
              style={{
                fontSize: '1.2rem',
                marginBottom: '1rem',
                width: '100%',
              }}
            />

            {(['masculine', 'feminine', 'other', 'surnames'] as const).map(
              (type) => (
                <div key={type} style={{ marginBottom: '1rem' }}>
                  <label>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                  <textarea
                    value={selectedList[type].join('\n')}
                    onChange={(e) =>
                      updateSelectedList({
                        [type]: e.target.value.split('\n'),
                      } as any)
                    }
                    rows={4}
                    style={{ width: '100%' }}
                  />
                </div>
              ),
            )}

            <h2 className="text-xl font-bold">Assignments</h2>
            <button
              type="button"
              onClick={handleAddAssignment}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Add Assignment
            </button>
            <table style={{ width: '100%', marginTop: '0.5rem' }}>
              <thead>
                <tr>
                  <th>Race</th>
                  <th>Region</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {selectedList.assignments.map((a, index) => {
                  const assignmentKey = `${a.raceId}-${a.regionId ?? 'all'}-${index}`;
                  return (
                    <tr key={assignmentKey}>
                      <td>
                        <select
                          value={a.raceId}
                          onChange={(e) =>
                            handleAssignmentChange(
                              index,
                              'raceId',
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select Race</option>
                          {availableRaces.map((race) => (
                            <option key={race.id} value={race.id}>
                              {race.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={a.regionId ?? ''}
                          onChange={(e) =>
                            handleAssignmentChange(
                              index,
                              'regionId',
                              e.target.value || null,
                            )
                          }
                        >
                          <option value="">All Regions</option>
                          {availableRegions.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleDeleteAssignment(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <p>Select a name list to edit.</p>
        )}
      </div>
    </div>
  );
}

export default WorldNameLists;
