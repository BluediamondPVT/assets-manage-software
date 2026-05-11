"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios"; // API call ke liye Axios

export default function EditAssetForm({ asset }) {
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(0);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Jab data aaye tab input me set kar do
  useEffect(() => {
    if (asset && asset.quantity !== undefined) {
      setQuantity(asset.quantity);
    }
  }, [asset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const assetId = asset.id || asset._id;
      // NAYA TARIQA: AXIOS SE API CALL 🚀
      const response = await axios.put(`/api/assets/${assetId}`, {
        quantity: Number(quantity)
      });

      if (response.data.success) {
        setStatusMsg({ type: "success", text: "✅ Inventory quantity updated successfully!" });
        setTimeout(() => {
          router.push("/admin/assets/list");
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to update asset";
      setStatusMsg({ type: "error", text: "❌ " + errorMsg });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100 font-sans mx-auto mt-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Update Inventory Stock</h1>
        <Link href="/admin/assets/list" className="text-sm font-semibold text-gray-500 hover:text-[#e7000b] transition-colors">
          Cancel
        </Link>
      </div>

      {statusMsg.text && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium border transition-all ${
            statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-[#e7000b] border-red-200'
          }`}>
          {statusMsg.text}
        </div>
      )}

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-8 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-600 min-w-[80px]">Batch ID:</span>
          <span className="font-mono font-bold text-[#e7000b]">{asset?.assetId}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-600 min-w-[80px]">Product:</span>
          <span className="text-gray-800">{asset?.product}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Products (Update Stock)</label>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all bg-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#e7000b] text-white font-semibold py-3.5 rounded-lg hover:bg-[#cc000a] transition-all shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? "Updating Stock..." : "Update Stock Quantity"}
        </button>
      </form>
    </div>
  );
}