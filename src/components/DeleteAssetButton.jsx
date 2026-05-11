"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DeleteAssetButton({ assetId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Delete karne se pehle confirm popup
    const confirmDelete = window.confirm("Are you sure you want to delete this asset stock?");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      // Axios se teri separate API ko call
      const response = await axios.delete(`/api/assets/${assetId}`);
      
      if (response.data.success) {
        router.refresh(); // Table refresh karega
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      alert("Failed to delete asset.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-3 py-1.5 bg-red-50 text-[#e7000b] hover:bg-red-100 text-xs font-medium rounded transition disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}