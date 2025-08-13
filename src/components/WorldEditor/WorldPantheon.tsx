import React from 'react';
import { PantheonOption } from '../../types/PantheonOption';
import { Region } from '../../types/Region';
import { Option } from '../OptionSelector';
import ConfirmModal from '../ConfirmModal';
import Modal from '../Modal';
import PantheonEntryEditor from '../PantheonEntryEditor';

interface WorldPantheonProps {
  pantheon: PantheonOption[];
  setPantheon: React.Dispatch<React.SetStateAction<PantheonOption[]>>;
  regions: Region[];
  enabledDomains: Option[];
}

export default function WorldPantheon({
  pantheon,
  setPantheon,
  regions,
  enabledDomains,
}: WorldPantheonProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [editingPantheon, setEditingPantheon] =
    React.useState<PantheonOption | null>(null);
  const [pantheonToDelete, setPantheonToDelete] =
    React.useState<PantheonOption | null>(null);

  const handleAddPantheon = () => {
    setEditingPantheon(null);
    setIsModalOpen(true);
  };

  const handleEditPantheon = (pnthn: PantheonOption) => {
    setEditingPantheon(pnthn);
    setIsModalOpen(true);
  };

  const handleDeletePantheonClick = (pnthn: PantheonOption) => {
    setPantheonToDelete(pnthn);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pantheonToDelete) {
      setPantheon((prev) => prev.filter((p) => p.id !== pantheonToDelete.id));
    }
    setIsConfirmOpen(false);
    setPantheonToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setPantheonToDelete(null);
  };

  const handleSavePantheon = (entry: PantheonOption) => {
    setPantheon((prev) => {
      const exists = prev.find((p) => p.id === entry.id);
      if (exists) {
        return prev.map((p) => (p.id === entry.id ? entry : p));
      }
      return [...prev, entry];
    });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const allDomains = React.useMemo(() => enabledDomains, [enabledDomains]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pantheon</h2>

      {pantheon.length === 0 ? (
        <p className="text-gray-500">No pantheon entries added yet.</p>
      ) : (
        <ul className="space-y-2">
          {pantheon.map((pantheonEntry) => (
            <li
              key={pantheonEntry.id}
              className="flex justify-between border p-2 rounded"
            >
              <span>{pantheonEntry.name}</span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => handleEditPantheon(pantheonEntry)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePantheonClick(pantheonEntry)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleAddPantheon}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Add Pantheon Entry
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCancel}>
        <PantheonEntryEditor
          initialEntry={editingPantheon || undefined}
          allDomains={allDomains}
          allRegions={regions.map((region) => ({
            id: region.id,
            label: region.name,
          }))}
          onSave={handleSavePantheon}
          onCancel={handleCancel}
        />
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message={`Are you sure you want to delete the pantheon entry "${pantheonToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
