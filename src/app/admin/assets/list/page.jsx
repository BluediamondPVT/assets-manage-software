import { getAssets, getDashboardStats } from "@/actions/assetActions";
import AssetTable from "@/components/AssetTable";

export default async function AssetListPage() {
  const assets = await getAssets();
  const stats = await getDashboardStats();

  const magicBoxes = [
    { label: "Laptop", data: stats.Laptops, icon: "💻" },
    { label: "Desktop", data: stats.Desktops, icon: "🖥️" },
    { label: "CPU", data: stats.CPU, icon: "🖧" },
    { label: "Mouse", data: stats.Mouse, icon: "🖱️" },
    { label: "Mobile", data: stats["Mobile Phones"], icon: "📱" },
    { label: "Charger", data: stats.Chargers, icon: "🔌" },
    { label: "Printer", data: stats.Printer, icon: "🖨️" },
    { label: "CCTV", data: stats["Camera / CCTV"], icon: "📹" },
    { label: "Chair", data: stats.Chairs, icon: "🪑" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Master Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Live stock and assignment overview.
          </p>
        </div>
      </div>

      {/* MAGIC BOX SECTION 🔥 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {magicBoxes.map((box, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-[#e7000b]/10 transition-colors">
                {box.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {box.label}
                </span>
                <div className="text-xl font-black text-gray-900">
                  {(box.data?.stock || 0) + (box.data?.issued || 0)}{" "}
                  <span className="text-[10px] text-gray-400 font-normal">
                    Total
                  </span>
                </div>
              </div>
            </div>

            {/* Split view: Godown vs Issued */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
              <div className="text-center">
                <div className="text-[10px] font-bold text-blue-500 uppercase">
                  Godown
                </div>
                <div className="text-sm font-bold text-gray-700">
                  {box.data?.stock || 0}
                </div>
              </div>
              <div className="text-center border-l border-gray-50">
                <div className="text-[10px] font-bold text-[#e7000b] uppercase">
                  Issued
                </div>
                <div className="text-sm font-bold text-gray-700">
                  {box.data?.issued || 0}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AssetTable data={assets} role="super-admin" />
    </div>
  );
}
