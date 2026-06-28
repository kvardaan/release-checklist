'use client';

import { useState, useEffect } from 'react';
import { ReleaseCard } from '@/components/ReleaseCard';
import { CreateReleaseModal } from '@/components/CreateReleaseModal';
import type { Release, CreateReleaseInput } from '@/types';

export default function Home() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReleases();
  }, []);

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

  const handleCreateRelease = async (data: CreateReleaseInput) => {
    try {
      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create release');
      await fetchReleases();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Release Checklist</h1>
              <p className="text-gray-500 mt-1">Manage your software releases</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              New Release
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading releases...</p>
          </div>
        ) : releases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No releases yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create your first release
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {releases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                onStepToggle={handleStepToggle}
                onUpdate={handleUpdateRelease}
                onDelete={handleDeleteRelease}
              />
            ))}
          </div>
        )}
      </main>

      <CreateReleaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRelease}
      />
    </div>
  );
}
