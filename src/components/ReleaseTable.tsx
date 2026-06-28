'use client';

import { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { formatDate } from '@/lib/helpers';
import type { Release } from '@/types';

interface ReleaseTableProps {
  releases: Release[];
  onSelectRelease: (id: string) => void;
  onDeleteRelease: (id: string) => Promise<void>;
}

export function ReleaseTable({
  releases,
  onSelectRelease,
  onDeleteRelease,
}: ReleaseTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReleaseId, setDeleteReleaseId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteReleaseId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteReleaseId) {
      setIsDeleting(true);
      try {
        await onDeleteRelease(deleteReleaseId);
        setShowDeleteConfirm(false);
        setDeleteReleaseId(null);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const selectedRelease = releases.find((r) => r.id === deleteReleaseId);

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Release</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <tr
              key={release.id}
              onClick={() => onSelectRelease(release.id)}
              className="border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900">{release.name}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{formatDate(release.date)}</p>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClasses(release.status)}`}>
                  {release.status.charAt(0).toUpperCase() + release.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onSelectRelease(release.id)}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(release.id, e)}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete release"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Release"
        description="Are you sure you want to delete"
        itemName={selectedRelease?.name || ''}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
