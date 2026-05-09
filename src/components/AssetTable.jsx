"use client";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import DeleteAssetButton from "@/components/DeleteAssetButton";
import { Search, ChevronDown, ArrowUpDown, SlidersHorizontal } from "lucide-react";

export default function AssetTable({ data, role }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Table Columns Definition
  const columns = [
    // 1. Naya Serial Number (S.No) Column 🔥
    {
      id: "serialNumber",
      header: "S.No",
      // row.index 0 se start hota hai, isliye + 1 kiya
      cell: ({ row }) => <span className="text-sm font-semibold text-gray-400">{row.index + 1}</span>,
      enableSorting: false, // S.No ko sort karne ki zaroorat nahi
    },
    // 2. Asset ID
    {
      accessorKey: "assetId",
      header: "Asset ID",
      cell: ({ row }) => <span className="font-mono text-xs text-[#e7000b] font-bold">{row.getValue("assetId")}</span>, // Isko bhi thoda brand color de diya
    },
    // 3. Product Details
    {
      id: "productDetails",
      accessorFn: (row) => `${row.assetName} ${row.category} ${row.product}`,
      header: "Product Details",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-800">{row.original.assetName}</div>
          <div className="text-[11px] text-gray-500">{row.original.category} &gt; {row.original.product}</div>
        </div>
      ),
    },
    // 4. Company
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-700">
          {row.getValue("company") || <span className="text-gray-400 italic">N/A</span>}
        </span>
      ),
    },
    // 5. Status & Condition
    {
      id: "status",
      accessorFn: (row) => `${row.status} ${row.currentCondition}`,
      header: "Status & Cond.",
      cell: ({ row }) => (
        <div>
          <div className={`inline-block px-2 py-1 text-[11px] font-bold rounded-full mb-1 ${
            row.original.status === "Available" ? "bg-green-100 text-green-700" :
            row.original.status === "Assigned" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
          }`}>
            {row.original.status}
          </div>
          <div className="text-[13px] text-gray-800">Cond: {row.original.currentCondition || "Unknown"}</div>
        </div>
      ),
    },
    // 6. Actions Column (Sirf super-admin ke liye)
    ...(role === "super-admin"
      ? [
          {
            id: "actions",
            header: () => <div className="text-right">Manage</div>,
            enableSorting: false,
            cell: ({ row }) => (
              <div className="flex justify-end gap-2 items-center">
                <Link href={`/admin/assets/edit/${row.original.id}`} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition">
                  Edit
                </Link>
                <DeleteAssetButton assetId={row.original.id} />
              </div>
            ),
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
      
      {/* Top Toolbar: Search & Column Visibility */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
        
        {/* Global Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#e7000b] focus:ring-1 focus:ring-[#e7000b] transition-all"
          />
        </div>

        {/* Column Hiding Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Columns
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {isColumnDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
              {table.getAllLeafColumns().map((column) => {
                return (
                  <div key={column.id} className="px-2 py-1.5 flex items-center gap-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      className="rounded text-[#e7000b] focus:ring-[#e7000b] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 capitalize">{column.id}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 font-semibold text-gray-700 text-sm whitespace-nowrap">
                    {header.isPlaceholder ? null : (
                      <div 
                        className={`flex items-center gap-2 ${header.column.getCanSort() ? "cursor-pointer select-none hover:text-[#e7000b]" : ""}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {/* Sort Icon */}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  No assets found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <span className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {data.length} entries
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition-all font-medium text-gray-700"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100 transition-all font-medium text-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}