'use client';

import { useState } from 'react';
import type { CreateReleaseInput } from '@/types';

interface CreateReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateReleaseInput) => Promise<void>;
}

export function CreateReleaseModal({ isOpen, onClose, onCreate }: CreateReleaseModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !date) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await onCreate({
        name,
        date,
        additionalInfo: additionalInfo || undefined,
      });
      setName('');
      setDate('');
      setAdditionalInfo('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Release</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Release Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., v2.1.0"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Target Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Additional Information (optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Add any notes or details..."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
