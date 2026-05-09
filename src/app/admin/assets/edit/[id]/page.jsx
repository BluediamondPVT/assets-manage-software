import { getAssetById, updateAsset } from "@/actions/assetActions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditAssetPage({ params }) {
  // NEXT.JS 15 FIX: params ko await karna zaruri hai
  const { id } = await params;
  const asset = await getAssetById(id);

  if (!asset) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-red-500 text-xl font-bold">Asset not found!</h1>
        <Link
          href="/admin/assets/list"
          className="text-blue-500 underline mt-4 block"
        >
          Go back to list
        </Link>
      </div>
    );
  }

  const handleUpdate = async (formData) => {
    "use server";
    await updateAsset(id, formData);
    redirect("/admin/assets/list");
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Asset</h1>
        <Link
          href="/admin/assets/list"
          className="text-sm text-gray-500 hover:text-black underline"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-100 text-sm text-gray-600">
        <p>
          <strong>Asset ID:</strong> {asset.assetId}
        </p>
        <p>
          <strong>Identity:</strong> {asset.type} &gt; {asset.category} &gt;{" "}
          {asset.product}
        </p>
      </div>

      <form action={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assets Number
          </label>
          <input
            type="text"
            name="assetName"
            defaultValue={asset.assetName}
            className="w-full border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Status
            </label>
            <select
              name="status"
              defaultValue={asset.status}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <select
              name="condition"
              defaultValue={asset.condition}
              className="w-full border border-gray-300 rounded-md p-2 outline-none"
            >
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition"
        >
          Update Asset
        </button>
      </form>
    </div>
  );
}
