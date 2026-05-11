import { getAssets } from "@/actions/assetActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AssetTable from "@/components/AssetTable"; 

export default async function AssetListPage() {
  const assets = await getAssets();
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  // Magic Box ke liye specific products ka STOCK COUNT
  const stats = {
    Laptops: 0,
    Desktops: 0,
    CPU: 0,
    Mouse: 0,
    "Mobile Phones": 0,
    Chargers: 0,
    Printer: 0,
    "Camera / CCTV": 0,
    Chairs: 0,
  };

  let grandTotalStock = 0; // Pure godown mein total kitne items hain

  assets.forEach((asset) => {
    const prod = asset.product || "";
    // Naye schema ke hisaab se quantity utha rahe hain (agar purana data hai jisme quantity nahi, toh 0 maan lega)
    const qty = asset.quantity || 0; 
    
    grandTotalStock += qty; // Total me plus kar diya

    // Ab har specific item me uski quantity PLUS hogi
    if (prod === "Laptops") stats.Laptops += qty;
    else if (prod === "Desktops") stats.Desktops += qty;
    else if (prod === "CPU") stats.CPU += qty;
    else if (prod === "Mouse") stats.Mouse += qty;
    else if (prod === "Mobile Phones") stats["Mobile Phones"] += qty;
    else if (prod === "Laptop Chargers" || prod === "Mobile Chargers") stats.Chargers += qty;
    else if (prod === "Printer") stats.Printer += qty;
    else if (prod === "Camera / CCTV") stats["Camera / CCTV"] += qty;
    else if (prod === "Chairs") stats.Chairs += qty;
  });

  // UI render karne ke liye array
  const magicBoxes = [
    { label: "Laptop", count: stats.Laptops, icon: "💻" },
    { label: "Desktop", count: stats.Desktops, icon: "🖥️" },
    { label: "CPU", count: stats.CPU, icon: "🖧" },
    { label: "Mouse", count: stats.Mouse, icon: "🖱️" },
    { label: "Mobile", count: stats["Mobile Phones"], icon: "📱" },
    { label: "Charger", count: stats.Chargers, icon: "🔌" },
    { label: "Printer", count: stats.Printer, icon: "🖨️" },
    { label: "CCTV", count: stats["Camera / CCTV"], icon: "📹" },
    { label: "Chair", count: stats.Chairs, icon: "🪑" },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Asset Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all company assets.
          </p>
        </div>
      
      </div>

      {/* MAGIC BOX SECTION 🔥 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {magicBoxes.map((box, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#e7000b]/30 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl group-hover:bg-[#e7000b]/10 transition-colors">
                {box.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{box.label}</span>
                <span className="text-lg font-bold text-gray-900 leading-tight">{box.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TanStack React Table Component */}
      <AssetTable data={assets} role={role} />

    </div>
  );
}