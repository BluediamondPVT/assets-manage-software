import AssignAssetForm from "@/components/AssignAssetForm";

export const metadata = {
  title: "Assign Asset | Asset Management Panel",
};

export default function AssignAssetPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Assign Asset to Employee
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Select an available item from the inventory and assign it to a staff member. Godown stock will update automatically.
        </p>
      </div>

      {/* Main Form Component */}
      <AssignAssetForm />
    </div>
  );
}