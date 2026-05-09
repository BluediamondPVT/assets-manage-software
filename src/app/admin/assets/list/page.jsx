import { getAssets } from "@/actions/assetActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AssetTable from "@/components/AssetTable"; // Naya Client Component Import Kiya

export default async function AssetListPage() {
  const assets = await getAssets();
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Asset Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all company assets.
          </p>
        </div>
        <div className="bg-[#e7000b]/10 border border-[#e7000b]/20 text-[#e7000b] px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm">
          Total Assets: {assets.length}
        </div>
      </div>

      {/* TanStack React Table Component */}
      <AssetTable data={assets} role={role} />

    </div>
  );
}