'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton() {
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
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-32" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
