import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const userName = session?.user?.name || "Admin";

  return (
    <div className="bg-white min-h-[500px] h-full rounded-2xl border border-gray-100 shadow-sm p-8 font-sans">
      
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          Welcome, <span className="text-[#e7000b]">{userName}</span>! 👋
        </h1>
        <p className="text-gray-500">
          Here is an overview of your enterprise asset management system.
        </p>
      </div>

      {/* Role-Based Content */}
      {role === "super-admin" ? (
        <div className="bg-gradient-to-r from-red-50 to-white border-l-4 border-[#e7000b] p-6 rounded-r-xl shadow-sm mb-8 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">👑</span>
            <h3 className="text-lg font-bold text-gray-900">
              Super Admin Workspace
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            You have full access to manage all assets, users, and company configurations. Use the sidebar to navigate through the advanced modules.
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-slate-500 p-6 rounded-r-xl shadow-sm mb-8 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">👤</span>
            <h3 className="text-lg font-bold text-gray-900">
              Admin Workspace
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Welcome to your dashboard. Here you can view and track the inventory across different branches.
          </p>
        </div>
      )}

      {/* Placeholder Stats Grid (Dashboard Look) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
          <h4 className="text-gray-500 text-sm font-medium mb-1">Total Assets</h4>
          <span className="text-3xl font-bold text-gray-900">---</span>
        </div>
        <div className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
          <h4 className="text-gray-500 text-sm font-medium mb-1">Assigned</h4>
          <span className="text-3xl font-bold text-gray-900">---</span>
        </div>
        <div className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
          <h4 className="text-gray-500 text-sm font-medium mb-1">Maintenance</h4>
          <span className="text-3xl font-bold text-gray-900">---</span>
        </div>
      </div>

    </div>
  );
}