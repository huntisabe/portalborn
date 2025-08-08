// context/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { World } from '../types/World';

interface SettingsContextType {
  worlds: World[];
  getWorldById: (id: string) => World | undefined;
  addWorld: (world: World) => void;
  updateWorld: (world: World) => void;
  deleteWorld: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [worlds, setWorlds] = useState<World[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('worlds');
    if (stored) {
      setWorlds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('worlds', JSON.stringify(worlds));
  }, [worlds]);

  const getWorldById = React.useCallback(
    (id: string) => worlds.find((w) => w.id === id),
    [worlds],
  );

  const addWorld = React.useCallback((world: World) => {
    setWorlds((prev) => [...prev, world]);
  }, []);

  const updateWorld = React.useCallback((updated: World) => {
    setWorlds((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  }, []);

  const deleteWorld = React.useCallback((id: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this world? This action cannot be undone.',
      )
    ) {
      setWorlds((prevWorlds) => {
        const updatedWorlds = prevWorlds.filter((w) => w.id !== id);
        try {
          localStorage.setItem('worlds', JSON.stringify(updatedWorlds));
        } catch (error) {
          console.error('Error saving worlds:', error);
        }
        return updatedWorlds;
      });
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({
      worlds,
      getWorldById,
      addWorld,
      updateWorld,
      deleteWorld,
    }),
    [worlds, getWorldById, addWorld, updateWorld, deleteWorld],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider };

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
