"use client";
import { useState } from "react";
import { createNewAsset } from "@/actions/assetActions";

const assetDataMap = {
  Immovable: {
    "Electrical & Fixtures": [
      "AC",
      "Fans",
      "Lights",
      "Curtains",
      "Wall Stickers",
    ],
    "Infrastructure / Interior": ["Boards", "Frames", "Racks / Stands (fixed)"],
  },
  Movable: {
    "IT & ELECTRONIC EQUIPMENT": [
      "Laptops",
      "Laptop Chargers",
      "Desktops",
      "CPU",
      "Keyboard",
      "Mouse",
      "Mobile Phones",
      "Mobile Chargers",
      "UPS",
      "Printer",
      "Projector",
      "Speakers",
      "Camera / CCTV",
      "Payment Scanner Machine",
    ],
    "FURNITURE & FIXTURES": [
      "Racks/Stands",
      "Tables",
      "Chairs",
      "Couch",
      "Carpets",
    ],
    "OFFICE & UTILITY EQUIPMENT": [
      "Water Dispenser",
      "Mini Fridge",
      "Dustbins",
      "Tool Kit Box",
      "First Aid Kit",
      "Petty Cash Box",
    ],
    "DECORATION & INTERIOR ITEMS": [
      "Showpieces",
      "Flower Pots",
      "Lamps",
      "Clocks",
      "Frames",
      "Trophies & Awards",
    ],
    "EDUCATIONAL / OFFICE MATERIAL": ["Books", "Boards", "Merchandise"],
    "KITCHEN & PANTRY ITEMS": ["Kitchen Crockeries"],
  },
};

export default function AddAssetPage() {
  const [company, setCompany] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [assetName, setAssetName] = useState("");
  
  // Custom Status Message State (alert() hatane ke liye)
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
    setStatusMsg({ type: "", text: "" }); // Reset previous message

    const response = await createNewAsset({
      company,
      selectedType,
      selectedCategory,
      selectedProduct,
      assetName,
    });

    if (response.success) {
      setStatusMsg({ type: "success", text: "✅ " + response.message });
      // Reset form
      setCompany("");
      setSelectedType("");
      setSelectedCategory("");
      setSelectedProduct("");
      setAssetName("");
    } else {
      setStatusMsg({ type: "error", text: "❌ " + response.error });
    }
    
    setIsLoading(false);
    
    // 4 second baad message gayab ho jayega
    setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
  };

  const categoriesAvailable = selectedType
    ? Object.keys(assetDataMap[selectedType])
    : [];
  const productsAvailable = selectedCategory
    ? assetDataMap[selectedType][selectedCategory]
    : [];

  return (
    <div className="max-w-3xl bg-white p-10 rounded-2xl shadow-sm border border-gray-100 font-sans mx-auto">
      
      {/* Premium Header */}
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          Add New Asset
        </h1>
        <p className="text-gray-500 text-sm">
          Register a new physical or digital asset into the enterprise inventory system.
        </p>
      </div>

      {/* Inline Status Message */}
      {statusMsg.text && (
        <div 
          className={`p-4 rounded-lg mb-6 text-sm font-medium border transition-all ${
            statusMsg.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-[#e7000b] border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. COMPANY DROPDOWN */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Company / Branch
          </label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all bg-white"
            required
          >
            <option value="" disabled>Select Company</option>
            <option value="Bluediamond Infotech PVT LTD">Bluediamond Infotech PVT LTD</option>
            <option value="Trivesa HR Consultancy">Trivesa HR Consultancy</option>
            <option value="BDIT Institute">BDIT Institute</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. TYPE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Asset Type
            </label>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all bg-white"
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="Movable">Movable Asset</option>
              <option value="Immovable">Immovable Asset</option>
            </select>
          </div>

          {/* 3. CATEGORY */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedProduct("");
              }}
              disabled={!selectedType}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed bg-white"
              required
            >
              <option value="" disabled>Select Category</option>
              {categoriesAvailable.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 4. PRODUCT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Name
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              disabled={!selectedCategory}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed bg-white"
              required
            >
              <option value="" disabled>Select Product</option>
              {productsAvailable.map((prod) => (
                <option key={prod} value={prod}>{prod}</option>
              ))}
            </select>
          </div>

          {/* 5. CUSTOM NAME */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Number Of Products
            </label>
            <input
              type="text"
              placeholder="e.g., HR Dept Laptop"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#e7000b] text-white font-semibold py-3.5 rounded-lg hover:bg-[#cc000a] transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? "Saving Asset..." : "Save Asset to System"}
        </button>
      </form>
    </div>
  );
}