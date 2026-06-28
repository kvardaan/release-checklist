'use client';

import { useState, useEffect } from 'react';
import { ReleaseTable } from '@/components/ReleaseTable';
import { ReleaseDetailModal } from '@/components/ReleaseDetailModal';
import { CreateReleaseModal } from '@/components/CreateReleaseModal';
import { Button } from '@/components/ui/button';
import type { Release, CreateReleaseInput } from '@/types';

export default function Home() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  const fetchReleases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/releases');
      if (!response.ok) throw new Error('Failed to fetch releases');
      const data = await response.json();
      setReleases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const handleCreateRelease = async (data: CreateReleaseInput) => {
    try {
      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create release');
      await fetchReleases();
      setIsCreateOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleStepToggle = async (releaseId: string, stepIndex: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/releases/${releaseId}/steps/${stepIndex}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error('Failed to update step');
      const updated = await response.json();
      setReleases((prev) =>
        prev.map((r) => (r.id === releaseId ? updated : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateRelease = async (releaseId: string, additionalInfo: string) => {
    try {
      const response = await fetch(`/api/releases/${releaseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additionalInfo }),
      });
      if (!response.ok) throw new Error('Failed to update release');
      const updated = await response.json();
      setReleases((prev) =>
        prev.map((r) => (r.id === releaseId ? updated : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteRelease = async (releaseId: string) => {
    try {
      const response = await fetch(`/api/releases/${releaseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete release');
      setReleases((prev) => prev.filter((r) => r.id !== releaseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const selectedRelease = releases.find((r) => r.id === selectedReleaseId);

  const handleSelectRelease = (id: string) => {
    setSelectedReleaseId(id);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">ReleaseCheck</h1>
          <p className="text-blue-100 mt-1">Your all-in-one release checklist tool</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading releases...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm text-blue-600 font-medium">All releases</h2>
                <h3 className="text-xl font-bold text-gray-900 mt-1">Releases</h3>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <span>+</span> New release
              </Button>
            </div>

            {releases.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 mb-4">No releases yet</p>
                <Button onClick={() => setIsCreateOpen(true)}>Create your first release</Button>
              </div>
            ) : (
              <ReleaseTable
                releases={releases}
                onSelectRelease={handleSelectRelease}
                onDeleteRelease={handleDeleteRelease}
              />
            )}
          </div>
        )}
      </main>

      <CreateReleaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateRelease}
      />

      <ReleaseDetailModal
        release={selectedRelease || null}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onStepToggle={handleStepToggle}
        onUpdateInfo={handleUpdateRelease}
        onDelete={handleDeleteRelease}
      />
    </div>
  );
}
