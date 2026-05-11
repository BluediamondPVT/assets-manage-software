"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, Package, User } from "lucide-react";

export default function AssignmentTable({ data }) {
  const router = useRouter();
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isReturning, setIsReturning] = useState(null); // Kis row ko return kar rahe hain track karne ke liye

  // RETURN ASSET FUNCTION 🔥
  const handleReturnAsset = async (assignmentId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to mark this asset as RETURNED? (Godown stock will increase by 1)",
    );
    if (!confirmReturn) return;

    setIsReturning(assignmentId);

    try {
      // API call jo abhi humne banayi
      const response = await axios.put(`/api/assignments/${assignmentId}`, {
        returnRemark: "Returned manually by Admin",
      });

      if (response.data.success) {
        alert("✅ Asset Returned Successfully!");
        router.refresh(); // Page refresh to get new stock & status
      }
    } catch (error) {
      alert(
        "❌ Failed to return asset: " +
          (error.response?.data?.error || error.message),
      );
    } finally {
      setIsReturning(null);
    }
  };

  const columns = [
    {
      id: "serialNumber",
      header: "S.No",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-400">
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "employeeName",
      header: "Employee Details",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <div className="font-bold text-gray-800">
              {row.original.employeeName}
            </div>
            <div className="text-[11px] text-gray-500">
              {row.original.department} | {row.original.personalNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "assetDetails",
      header: "Assigned Asset",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-800 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[#e7000b]" />
            {row.original.product}
          </div>
          <div className="text-[11px] text-gray-500">
            {row.original.category}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "assignedDate",
      header: "Assigned Date",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700 font-medium">
          {new Date(row.original.assignedDate).toLocaleDateString("en-GB")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
            row.original.status === "Assigned"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    // NAYA COLUMN: ACTIONS 🔥
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const isAssigned = row.original.status === "Assigned";

        return (
          <div className="flex justify-end">
            {isAssigned ? (
              <button
                onClick={() => handleReturnAsset(row.original._id)}
                disabled={isReturning === row.original._id}
                className="px-3 py-1.5 bg-[#e7000b]/10 text-[#e7000b] hover:bg-[#e7000b] hover:text-white text-xs font-bold rounded transition-all disabled:opacity-50"
              >
                {isReturning === row.original._id
                  ? "Processing..."
                  : "Return Asset"}
              </button>
            ) : (
              <span className="text-xs text-gray-400 font-medium italic">
                Returned on{" "}
                {new Date(row.original.returnedDate).toLocaleDateString(
                  "en-GB",
                )}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
      {/* Search Toolbar */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search employee or asset..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-[#e7000b] focus:border-[#e7000b]"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-50 border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 font-semibold text-gray-700 text-sm"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-gray-500 italic"
                >
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <span className="text-sm text-gray-600">
          Total {data.length} Records
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition-all font-medium"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition-all font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
