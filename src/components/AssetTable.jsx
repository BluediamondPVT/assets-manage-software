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
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  SlidersHorizontal,
  Package,
  ExternalLink,
} from "lucide-react"; // 🔥 ExternalLink import kiya

export default function AssetTable({ data, role }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Table Columns Definition
  const columns = [
    // 1. Serial Number (S.No)
    {
      id: "serialNumber",
      header: "S.No",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-400">
          {row.index + 1}
        </span>
      ),
      enableSorting: false,
    },
    // 2. Batch ID (Godown Entry ID)
    {
      accessorKey: "assetId",
      header: "Batch ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-[#e7000b] font-bold">
          {row.getValue("assetId")}
        </span>
      ),
    },
    // 3. Product Details (🔥 AB CLICKABLE HAI)
    {
      id: "productDetails",
      accessorFn: (row) => `${row.type} ${row.category} ${row.product}`,
      header: "Product Details",
      cell: ({ row }) => (
        <Link
          href={`/admin/assign/list?filter=${encodeURIComponent(row.original.product)}`}
          className="group block"
        >
          <div className="font-bold text-gray-800 flex items-center gap-1 group-hover:text-[#e7000b] transition-colors cursor-pointer">
            {row.original.product}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-[11px] text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
            {row.original.type} &gt; {row.original.category}
          </div>
        </Link>
      ),
    },
    // 4. Company
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-700">
          {row.getValue("company") || (
            <span className="text-gray-400 italic">N/A</span>
          )}
        </span>
      ),
    },
    // 5. STOCK / QUANTITY
    {
      accessorKey: "quantity",
      header: "Total Stock",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1.5 shadow-sm">
            <Package className="w-3.5 h-3.5 text-gray-500" />
            {row.getValue("quantity")}
          </span>
        </div>
      ),
    },
    // 6. Actions Column
    ...(role === "super-admin"
      ? [
          {
            id: "actions",
            header: () => <div className="text-right">Manage</div>,
            enableSorting: false,
            cell: ({ row }) => (
              <div className="flex justify-end gap-2 items-center">
                <Link
                  href={`/admin/assets/edit/${row.original.id}`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition"
                >
                  Edit Stock
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
            placeholder="Search products, companies..."
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
                  <div
                    key={column.id}
                    className="px-2 py-1.5 flex items-center gap-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      className="rounded text-[#e7000b] focus:ring-[#e7000b] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {column.id}
                    </span>
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
              <tr
                key={headerGroup.id}
                className="bg-gray-50 border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-4 font-semibold text-gray-700 text-sm whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${header.column.getCanSort() ? "cursor-pointer select-none hover:text-[#e7000b]" : ""}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
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
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
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
                  className="p-8 text-center text-gray-500"
                >
                  No assets found in inventory. Add some to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <span className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {data.length} unique
          batches
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
