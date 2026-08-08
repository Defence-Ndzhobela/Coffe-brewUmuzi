import React, { useState, useEffect, useMemo } from 'react';
import { Brew, BrewFormData, MethodFilterType } from './types';
import {
  getBrews,
  createBrew,
  updateBrew,
  deleteBrew,
  resetBrews,
  setupDatabase,
} from './services/brewService';
import { Navbar } from './components/Navbar';
import { MethodFilter } from './components/MethodFilter';
import { BrewList } from './components/BrewList';
import { AddBrewModal } from './components/AddBrewModal';
import { EditBrewModal } from './components/EditBrewModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { StatsSummary } from './components/StatsSummary';
import { Plus, Coffee, Search } from 'lucide-react';

export default function App() {
  const [brews, setBrews] = useState<Brew[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<MethodFilterType>('All methods');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingBrew, setEditingBrew] = useState<Brew | null>(null);
  const [deletingBrew, setDeletingBrew] = useState<Brew | null>(null);

  // Load initial brews from API service
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        await setupDatabase();
        const loadedBrews = await getBrews();
        setBrews(loadedBrews);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load brews.';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  // Compute method counts for the filter dropdown
  const methodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    brews.forEach((b) => {
      counts[b.method] = (counts[b.method] || 0) + 1;
    });
    return counts;
  }, [brews]);

  // Keep page title in sync with current brew count.
  useEffect(() => {
    document.title = `Brews: ${brews.length}`;
  }, [brews.length]);

  // Filter brews based on selected method & optional search query
  const filteredBrews = useMemo(() => {
    return brews.filter((brew) => {
      const matchesMethod =
        selectedMethod === 'All methods' || brew.method === selectedMethod;
      const matchesSearch =
        !searchQuery.trim() ||
        brew.beans.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brew.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (brew.tastingNotes &&
          brew.tastingNotes.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesMethod && matchesSearch;
    });
  }, [brews, selectedMethod, searchQuery]);

  // Handle Add Brew
  const handleAddBrew = async (formData: BrewFormData) => {
    try {
      const newBrew = await createBrew(formData);
      setBrews((prev) => [newBrew, ...prev]);
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create brew.';
      setErrorMessage(message);
    }
  };

  // Handle Update Brew
  const handleUpdateBrew = async (id: string, formData: BrewFormData) => {
    try {
      const updated = await updateBrew(id, formData);
      setBrews((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update brew.';
      setErrorMessage(message);
    }
  };

  // Handle Delete Brew
  const handleDeleteConfirm = async () => {
    if (!deletingBrew) return;
    try {
      await deleteBrew(deletingBrew.id);
      setBrews((prev) => prev.filter((b) => b.id !== deletingBrew.id));
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete brew.';
      setErrorMessage(message);
    }
    
    // Close edit modal if it was open for this brew
    if (editingBrew && editingBrew.id === deletingBrew.id) {
      setEditingBrew(null);
    }
    setDeletingBrew(null);
  };

  // Handle reset by clearing brews in database
  const handleResetData = async () => {
    if (!window.confirm('Delete all brew records from the database?')) {
      return;
    }

    try {
      const reset = await resetBrews();
      setBrews(reset);
      setSelectedMethod('All methods');
      setSearchQuery('');
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset brews.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/80 text-stone-900 font-sans antialiased flex flex-col">
      {/* Navbar */}
      <Navbar
        onAddClick={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
        brewCount={brews.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif">
                Brew log
              </h2>
              {/* Dynamic Brew Count Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-mono text-sm font-bold border border-amber-300/80 shadow-2xs">
                <Coffee className="w-3.5 h-3.5 text-amber-800" />
                Brews: {brews.length}
              </span>
            </div>
            <p className="text-sm text-stone-500 font-medium">
              Record coffee bean profiles, water ratios, extraction methods, and ratings.
            </p>
          </div>

          {/* Action Button & Add Brew shortcut */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <StatsSummary brews={brews} />

        {isLoading && (
          <div className="bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-600">
            Loading brews from database...
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-800">
            {errorMessage}
          </div>
        )}

        {/* Controls Toolbar: Filter by Method & Search */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Method Filter Dropdown */}
          <MethodFilter
            selectedMethod={selectedMethod}
            onChange={setSelectedMethod}
            methodCounts={methodCounts}
          />

          {/* Search Filter */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search beans or notes..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Active Filter Indicator if filtered */}
        {(selectedMethod !== 'All methods' || searchQuery.trim() !== '') && (
          <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-950">
            <p>
              Showing <span className="font-bold">{filteredBrews.length}</span> of{' '}
              <span className="font-bold">{brews.length}</span> brews
              {selectedMethod !== 'All methods' && (
                <span> for <strong>"{selectedMethod}"</strong></span>
              )}
              {searchQuery && (
                <span> matching <strong>"{searchQuery}"</strong></span>
              )}
            </p>
            <button
              onClick={() => {
                setSelectedMethod('All methods');
                setSearchQuery('');
              }}
              className="text-amber-800 font-bold hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Brew List / Grid */}
        <BrewList
          brews={filteredBrews}
          selectedMethod={selectedMethod}
          onEditBrew={(brew) => setEditingBrew(brew)}
          onDeleteBrew={(brew) => setDeletingBrew(brew)}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-6 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Brew Log — Professional Coffee Tracker</p>
          <p className="text-stone-500">
            Connected to PostgreSQL API (GET/POST/PUT/DELETE /api/brews)
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddBrewModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBrew={handleAddBrew}
      />

      <EditBrewModal
        isOpen={editingBrew !== null}
        brew={editingBrew}
        onClose={() => setEditingBrew(null)}
        onUpdateBrew={handleUpdateBrew}
        onDeleteBrew={(brew) => {
          setEditingBrew(null);
          setDeletingBrew(brew);
        }}
      />

      <DeleteConfirmModal
        isOpen={deletingBrew !== null}
        brew={deletingBrew}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingBrew(null)}
      />
    </div>
  );
}
