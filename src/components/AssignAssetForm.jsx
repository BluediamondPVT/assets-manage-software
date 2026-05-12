"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AssignAssetForm() {
  const router = useRouter();
  
  // 1. Available Assets lane ka state
  const [availableAssets, setAvailableAssets] = useState([]);
  
  // 2. Form States
  const [employeeName, setEmployeeName] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [company, setCompany] = useState(""); // 🔥 NAYA STATE COMPANY KE LIYE
  const [selectedAssetRef, setSelectedAssetRef] = useState(""); 
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split('T')[0]); 
  const [condition, setCondition] = useState("New");
  const [remark, setRemark] = useState("");

  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Jab page load ho, Inventory se items utha lo
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get("/api/assets");
        if (response.data.success) {
          const inStockAssets = response.data.data.filter(asset => asset.quantity > 0);
          setAvailableAssets(inStockAssets);
        }
      } catch (error) {
        console.error("Error fetching available assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: "", text: "" });

    const assetDetails = availableAssets.find(a => a._id === selectedAssetRef);

    if (!assetDetails) {
      setStatusMsg({ type: "error", text: "❌ Please select a valid asset." });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/assignments", {
        employeeName,
        personalNumber,
        department,
        company, // 🔥 PAYLOAD MEIN COMPANY BHEJ RAHE HAIN
        assetRef: selectedAssetRef,
        category: assetDetails.category,
        product: assetDetails.product,
        assignedDate,
        condition,
        remark
      });

      if (response.data.success) {
        setStatusMsg({ type: "success", text: "✅ " + response.data.message });
        
        // Form reset
        setEmployeeName("");
        setPersonalNumber("");
        setDepartment("");
        setCompany(""); // 🔥 Naya state reset
        setSelectedAssetRef("");
        setCondition("New");
        setRemark("");
        
        setTimeout(() => {
          router.push("/admin/assign/list"); 
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to assign asset";
      setStatusMsg({ type: "error", text: "❌ " + errorMsg });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 font-sans mt-4">
      {statusMsg.text && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium border transition-all ${
            statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-[#e7000b] border-red-200'
          }`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: EMPLOYEE DETAILS */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">1. Employee Details & Branch</h3>
          {/* Grid ko 4 items ke liye 2 columns me set kiya */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employee Name</label>
              <input type="text" placeholder="e.g., Rahul Sharma" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b]" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Personal No. / Emp ID</label>
              <input type="text" placeholder="e.g., EMP-1042" value={personalNumber} onChange={(e) => setPersonalNumber(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b]" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] bg-white cursor-pointer" required>
                <option value="" disabled>Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            {/* 🔥 NAYA COMPANY DROPDOWN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company / Branch</label>
              <select value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] bg-white cursor-pointer" required>
                <option value="" disabled>Select Company</option>
                <option value="Bluediamond Infotech PVT LTD">Bluediamond Infotech PVT LTD</option>
                <option value="Trivesa HR Consultancy">Trivesa HR Consultancy</option>
                <option value="BDIT Institute">BDIT Institute</option>
                <option value="Inventory Management">Inventory Management</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: ASSET SELECTION */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">2. Select Asset from Inventory</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Available Asset (In Stock)</label>
            <select value={selectedAssetRef} onChange={(e) => setSelectedAssetRef(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] bg-white cursor-pointer" required>
              <option value="" disabled>-- Select an Asset --</option>
              {availableAssets.length === 0 ? (
                <option disabled>Loading or No assets available in Inventory...</option>
              ) : (
                availableAssets.map((asset) => (
                  <option key={asset._id} value={asset._id}>
                    {asset.product} ({asset.category}) - Stock: {asset.quantity} | Batch: {asset.assetId}
                  </option>
                ))
              )}
            </select>
            <p className="text-xs text-gray-500 mt-2">Note: Only assets with Quantity {">"} 0 are shown here.</p>
          </div>
        </div>

        {/* SECTION 3: ASSIGNMENT DETAILS */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">3. Assignment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assigned Date</label>
              <input type="date" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] cursor-pointer" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition at Assignment</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] bg-white cursor-pointer" required>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Remarks (Optional)</label>
              <textarea placeholder="e.g., Laptop given with charger and bag." value={remark} onChange={(e) => setRemark(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] min-h-[100px] resize-y"></textarea>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || availableAssets.length === 0}
          className="w-full cursor-pointer bg-[#e7000b] text-white font-semibold py-4 rounded-lg hover:bg-[#cc000a] transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-lg"
        >
          {isLoading ? "Assigning & Updating Stock..." : "Confirm Assignment"}
        </button>
      </form>
    </div>
  );
}