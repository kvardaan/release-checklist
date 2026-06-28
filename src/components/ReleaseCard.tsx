'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/helpers';
import { RELEASE_STEPS } from '@/lib/constants';
import type { Release } from '@/types';

interface ReleaseCardProps {
  release: Release;
  onStepToggle: (releaseId: string, stepIndex: number, completed: boolean) => Promise<void>;
  onUpdate: (releaseId: string, additionalInfo: string) => Promise<void>;
  onDelete: (releaseId: string) => Promise<void>;
}

export function ReleaseCard({ release, onStepToggle, onUpdate, onDelete }: ReleaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(release.additionalInfo || '');

  const handleSaveInfo = async () => {
    await onUpdate(release.id, editValue);
    setIsEditing(false);
  };

  const completedCount = release.steps.filter((s) => s.completed).length;
  const totalSteps = RELEASE_STEPS.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const statusColor = {
    planned: 'bg-gray-100 text-gray-800',
    ongoing: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  }[release.status];

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{release.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{formatDate(release.date)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {release.status}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{completedCount} / {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {release.additionalInfo && (
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm text-gray-700">{release.additionalInfo}</p>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div className="space-y-2">
            {RELEASE_STEPS.map((step) => {
              const releaseStep = release.steps.find((s) => s.stepIndex === step.index);
              const isCompleted = releaseStep?.completed || false;

              return (
                <label
                  key={step.index}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => onStepToggle(release.id, step.index, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{step.name}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Additional Info
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    rows={3}
                    placeholder="Add any additional information..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveInfo}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditValue(release.additionalInfo || '');
                      }}
                      className="px-3 py-1 bg-gray-200 text-gray-900 text-sm rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full p-2 text-left border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  {release.additionalInfo || 'Click to add info...'}
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (window.confirm('Delete this release?')) {
                  onDelete(release.id);
                }
              }}
              className="w-full px-3 py-2 bg-red-50 text-red-700 text-sm rounded hover:bg-red-100"
            >
              Delete Release
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
