import React from 'react';
import { Region } from '../../types/Region';
import Modal from '../Modal';
import ConfirmModal from '../ConfirmModal';
import RegionEditor from '../RegionEditor';
import { Option } from '../OptionSelector';

interface WorldRegionsProps {
  regions: Region[];
  setRegions: React.Dispatch<React.SetStateAction<Region[]>>;
  allRaces: Option[];
  enabledRaces: string[];
  allBackgrounds: Option[];
  enabledBackgrounds: string[];
}

export default function WorldRegions({
  regions,
  setRegions,
  allRaces,
  enabledRaces,
  allBackgrounds,
  enabledBackgrounds,
}: WorldRegionsProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [editingRegion, setEditingRegion] = React.useState<Region | null>(null);
  const [regionToDelete, setRegionToDelete] = React.useState<Region | null>(
    null,
  );

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Regions</h2>

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

      <button
        type="button"
        onClick={handleAddRegion}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Add Region
      </button>

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
  );
}
