import React from 'react';
import { useNavigate } from 'react-router-dom';
import { World } from '../types/World';
import { useSettings } from '../context/SettingsContext';

function WorldList() {
  const navigate = useNavigate();
  const { worlds, deleteWorld } = useSettings();

  const handleEdit = (world: World) => {
    navigate(`/world/${world.id}/edit`);
  };

  const handleCreateNew = () => {
    navigate('/world/new');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">World Builder</h1>
        <button
          type="button"
          onClick={handleCreateNew}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New World
        </button>
      </div>

      {worlds.length === 0 ? (
        <div className="text-center p-8 bg-white rounded shadow">
          <p className="text-gray-600">
            No worlds created yet. Click &quot;Create New World&quot; to get
            started.
          </p>
        </div>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {worlds.map((world) => (
              <tr key={world.id}>
                <td className="p-2 border-b">{world.name}</td>
                <td className="p-2 border-b space-x-2">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(world)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-1"
                    >
                      Edit
                    </button>
                    <div>
                      <button
                        type="button"
                        onClick={() => deleteWorld(world.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorldList;
