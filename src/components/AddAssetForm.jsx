"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const assetDataMap = {
  Immovable: {
    "Electrical & Fixtures": ["AC", "Fans", "Lights", "Curtains", "Wall Stickers"],
    "Infrastructure / Interior": ["Boards", "Frames", "Racks / Stands (fixed)"],
  },
  Movable: {
    "IT & ELECTRONIC EQUIPMENT": [
      "Laptops", "Laptop Chargers", "Desktops", "CPU", "Keyboard", "Mouse",
      "Mobile Phones", "Mobile Chargers", "UPS", "Printer", "Projector",
      "Speakers", "Camera / CCTV", "Payment Scanner Machine"
    ],
    "FURNITURE & FIXTURES": ["Racks/Stands", "Tables", "Chairs", "Couch", "Carpets"],
    "OFFICE & UTILITY EQUIPMENT": ["Water Dispenser", "Mini Fridge", "Dustbins", "Tool Kit Box", "First Aid Kit", "Petty Cash Box"],
    "DECORATION & INTERIOR ITEMS": ["Showpieces", "Flower Pots", "Lamps", "Clocks", "Frames", "Trophies & Awards"],
    "EDUCATIONAL / OFFICE MATERIAL": ["Books", "Boards", "Merchandise"],
    "KITCHEN & PANTRY ITEMS": ["Kitchen Crockeries"],
  },
};

export default function AddAssetForm() {
  const router = useRouter();
  
  const [company, setCompany] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  
  // State Quantity ke liye
  const [quantity, setQuantity] = useState("");
  
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedCategory("");
    setSelectedProduct("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      // AXIOS POST REQUEST (Separate API call)
      const response = await axios.post("/api/assets", {
        company,
        selectedType,
        selectedCategory,
        selectedProduct,
        quantity: Number(quantity),
      });

      if (response.data.success) {
        setStatusMsg({ type: "success", text: "✅ " + response.data.message });
        setCompany("");
        setSelectedType("");
        setSelectedCategory("");
        setSelectedProduct("");
        setQuantity("");
        router.refresh(); // Table update karne ke liye
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to save inventory";
      setStatusMsg({ type: "error", text: "❌ " + errorMsg });
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
    }
  };

  const categoriesAvailable = selectedType ? Object.keys(assetDataMap[selectedType]) : [];
  const productsAvailable = selectedCategory ? assetDataMap[selectedType][selectedCategory] : [];

  return (
    <>
      {statusMsg.text && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium border transition-all ${
            statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-[#e7000b] border-red-200'
          }`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company / Branch</label>
          <select value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] bg-white transition-all" required>
            <option value="" disabled>Select Company</option>
            <option value="Bluediamond Infotech PVT LTD">Bluediamond Infotech PVT LTD</option>
            <option value="Trivesa HR Consultancy">Trivesa HR Consultancy</option>
            <option value="BDIT Institute">BDIT Institute</option>
            <option value="Inventory Management">Inventory Management</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Asset Type</label>
            <select value={selectedType} onChange={handleTypeChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] bg-white transition-all" required>
              <option value="" disabled>Select Type</option>
              <option value="Movable">Movable Asset</option>
              <option value="Immovable">Immovable Asset</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedProduct(""); }} disabled={!selectedType} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] disabled:bg-gray-50 disabled:text-gray-400 bg-white transition-all cursor-pointer disabled:cursor-not-allowed" required>
              <option value="" disabled>Select Category</option>
              {categoriesAvailable.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} disabled={!selectedCategory} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] disabled:bg-gray-50 disabled:text-gray-400 bg-white transition-all cursor-pointer disabled:cursor-not-allowed" required>
              <option value="" disabled>Select Product</option>
              {productsAvailable.map((prod) => <option key={prod} value={prod}>{prod}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Number of Products</label>
            <input 
              type="number" 
              min="1"
              placeholder="e.g., 20" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all" 
              required 
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer bg-[#e7000b] text-white font-semibold py-3.5 rounded-lg hover:bg-[#cc000a] transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? "Saving Inventory..." : "Save to Inventory"}
        </button>
      </form>
    </>
  );
}