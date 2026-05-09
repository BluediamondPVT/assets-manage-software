"use client";
import { deleteAsset } from "@/actions/assetActions";

export default function DeleteAssetButton({ assetId }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this asset?\nThis action cannot be undone and will remove it from the database."
    );
    if (confirmDelete) {
      await deleteAsset(assetId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#e7000b] border border-red-100 text-xs font-bold rounded-md transition-all hover:shadow-sm"
      title="Delete Asset"
    >
      <svg 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M3 6h18"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
      Delete
    </button>
  );
}