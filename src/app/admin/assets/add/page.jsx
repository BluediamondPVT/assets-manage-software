import AddAssetForm from "@/components/AddAssetForm";

export const metadata = {
  title: "Add New Asset | Asset Management Panel",
};

export default function AddAssetPage() {
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

      {/* Imported the Form Component */}
      <AddAssetForm />
    </div>
  );
}