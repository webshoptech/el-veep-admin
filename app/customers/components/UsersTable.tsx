"use client";

import React, { useEffect, useState, useMemo } from "react";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Avatar from "@/utils/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { User } from "@/types/UserType"; 
import { getRecentUsers } from "@/app/api_/users";

interface UsersTableProps {
  limit: number;
}

const UsersTable: React.FC<UsersTableProps> = ({ limit }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limit,
  });
  const [totalUsers, setTotalUsers] = useState(0);

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center space-x-2">
              <Avatar src={user.profile_photo} alt={user.name} />
              <span>{user.name}</span>
            </div>
          );
        },
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Phone",
        accessorKey: "phone",
      }, 
      {
        header: "Status",
        accessorKey: "is_active",
        cell: ({ getValue }) => {
          const isActive = getValue() === 1;
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        header: "Country",
        accessorKey: "country",
      },
      {
        header: "Date Joined",
        accessorKey: "created_at",
        cell: ({ getValue }) => formatHumanReadableDate(getValue() as string),
      },
      {
        header: "Action",
        accessorKey: "id",
        cell: ({ getValue }) => {
          const userId = getValue();
          return (
            <button
              className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 cursor-pointer"
              onClick={() => {
                window.location.href = `/users/${userId}`;
              }}
            >
              View
            </button>
          );
        },
      },
    ],
    []
  );

  const fetchUsers = async (pageIndex: number, search: string, type="customer" ) => {
    try {
      setLoading(true);
      const offset = pageIndex * pagination.pageSize;
      const response = await getRecentUsers(pagination.pageSize, offset, search, type);
      setUsers(response.data);
      setTotalUsers(response.total || 0);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUsers = useMemo(
    () =>
      debounce((pageIndex: number, search: string) => {
        fetchUsers(pageIndex, search);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchUsers(pagination.pageIndex, search);
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [pagination.pageIndex, debouncedFetchUsers, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, or phone..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900"
        />
      </div>
      <TanStackTable
        data={users}
        columns={columns}
        loading={loading}
        error={error}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalRows: totalUsers,
        }}
        onPaginationChange={(updatedPagination) => {
          setPagination({
            pageIndex: updatedPagination.pageIndex,
            pageSize: updatedPagination.pageSize,
          });
        }}
      />
    </div>
  );
};

export default UsersTable;
