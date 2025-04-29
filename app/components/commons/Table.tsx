"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

// Column Definition
export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

// TableProps Interface
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  itemsPerPage?: number;
  title?: string;
  showPagination?: boolean;
  showViewAllButton?: boolean;
  viewAllRoute?: string;
}

// Parse Date Helper
const parseDate = (dateString: string) => new Date(dateString).getTime();

// Sort Data Helper
const sortData = <T,>(
  data: T[],
  column: keyof T,
  order: "asc" | "desc"
): T[] => {
  return [...data].sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];

    const parsedValueA =
      column === "date" && typeof valueA === "string"
        ? parseDate(valueA)
        : valueA;
    const parsedValueB =
      column === "date" && typeof valueB === "string"
        ? parseDate(valueB)
        : valueB;

    const normalizedValueA =
      typeof parsedValueA === "string" ? parsedValueA.toLowerCase() : parsedValueA;
    const normalizedValueB =
      typeof parsedValueB === "string" ? parsedValueB.toLowerCase() : parsedValueB;

    if (normalizedValueA < normalizedValueB) return order === "asc" ? -1 : 1;
    if (normalizedValueA > normalizedValueB) return order === "asc" ? 1 : -1;
    return 0;
  });
};

export default function Table<T>({
  data,
  columns,
  onRowClick,
  itemsPerPage = 10,
  title,
  showPagination = false,
  showViewAllButton = false,
  viewAllRoute,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof T) => {
    const newOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  const router = useRouter();

  const sortedData = sortColumn
    ? sortData(data, sortColumn, sortOrder)
    : data;

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData =
    showPagination || showViewAllButton
      ? sortedData.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : sortedData;

  const handleRouteChange = () => {
    if (viewAllRoute) {
      router.push(viewAllRoute);
    }
  };

  return (
    <div className="text-gray-500">
      <div className="flex justify-between items-center mb-4">
        {title && (
          <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        )}

        {showViewAllButton && viewAllRoute && (
          <button
            onClick={handleRouteChange}
            className="px-2 py-1 flex items-center border rounded-md text-sm bg-pawa-light-blue text-white hover:bg-pawa-light-blue"
          >
            View All
          </button>
        )}
      </div>

      <div className="overflow-x-auto w-full card">
        <table className="w-full text-sm divide-gray-200">
          <thead className="text-left bg-white text-gray-700">
            <tr>
              {columns.map(({ key, label }) => (
                <th
                  key={String(key)}
                  onClick={() => handleSort(key)}
                  className="p-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    {label}
                    {sortColumn === key ? (
                      sortOrder === "asc" ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )
                    ) : (
                      <ChevronUpDownIcon className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-gray-100 cursor-pointer ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                {columns.map(({ key, render }) => (
                  <td key={`${String(key)}-${index}`} className="p-3">
                    {render
                      ? render(row[key], row)
                      : (row[key] as React.ReactNode) ?? null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Info & Controls */}
      {showPagination && (
        <div className="mt-6 flex justify-between items-center text-lg text-gray-500">
          <span>
            Showing {itemsPerPage * (currentPage - 1) + 1} to{" "}
            {Math.min(itemsPerPage * currentPage, data.length)} of {data.length}{" "}
            entries
          </span>

          <div className="flex gap-2">
            {[
              {
                label: "Previous",
                onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
                disabled: currentPage === 1,
                icon: <ChevronLeftIcon className="w-3 h-3 mr-1" />,
              },
              {
                label: "Next",
                onClick: () =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1)),
                disabled: currentPage === totalPages,
                icon: <ChevronRightIcon className="w-3 h-3 ml-1" />,
              },
            ].map(({ label, onClick, disabled, icon }) => (
              <button
                key={label}
                onClick={onClick}
                disabled={disabled}
                className={`flex items-center px-2 py-1 card ${
                  disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
              >
                {label === "Previous" ? icon : null}
                {label}
                {label === "Next" ? icon : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}