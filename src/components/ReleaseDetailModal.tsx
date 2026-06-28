'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/helpers';
import { RELEASE_STEPS } from '@/lib/constants';
import type { Release } from '@/types';

interface ReleaseDetailModalProps {
  release: Release | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStepToggle: (releaseId: string, stepIndex: number, completed: boolean) => Promise<void>;
  onUpdateInfo: (releaseId: string, additionalInfo: string) => Promise<void>;
  onDelete: (releaseId: string) => Promise<void>;
}

export function ReleaseDetailModal({
  release,
  isOpen,
  onOpenChange,
  onStepToggle,
  onUpdateInfo,
  onDelete,
}: ReleaseDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(release?.additionalInfo || '');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!release) return null;

  const handleSaveInfo = async () => {
    await onUpdateInfo(release.id, editValue);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this release?')) {
      setIsDeleting(true);
      try {
        await onDelete(release.id);
        onOpenChange(false);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const completedCount = release.steps.filter((s) => s.completed).length;
  const totalSteps = RELEASE_STEPS.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const getStatusBadgeClasses = () => {
    switch (release.status) {
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] sm:min-w-2xl max-w-3xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">{release.name}</DialogTitle>
              <p className="text-sm text-gray-500 mt-2">{formatDate(release.date)}</p>
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeClasses()}`}>
              {release.status.charAt(0).toUpperCase() + release.status.slice(1)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">
                {completedCount} / {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Release Steps</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              {RELEASE_STEPS.map((step) => {
                const releaseStep = release.steps.find((s) => s.stepIndex === step.index);
                const isCompleted = releaseStep?.completed || false;

                return (
                  <label
                    key={step.index}
                    className="flex items-start gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={(e) => onStepToggle(release.id, step.index, e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Additional Remarks / Tasks</h3>

            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Please enter any other important notes for the release"
                  rows={4}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditValue(release.additionalInfo || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveInfo}>Save</Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditValue(release.additionalInfo || '');
                }}
                className="w-full p-3 text-left border border-gray-300 rounded text-sm hover:bg-gray-50 text-gray-700 transition-colors"
              >
                {release.additionalInfo || 'Click to add remarks...'}
              </button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete Release
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
