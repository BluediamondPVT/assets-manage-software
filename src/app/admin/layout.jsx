import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({ children }) {
  // Server side pe session check
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  return (
    <div className="flex h-screen w-full bg-[#f4f5f7] overflow-hidden font-sans">
      
      {/* PERFECT SIDEBAR INJECTION */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 shrink-0 bg-white border-b border-gray-200 flex items-center px-10 shadow-sm justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-gray-500 font-medium tracking-wide text-sm uppercase">
              Current Role
            </h2>
            <span className="bg-[#e7000b]/10 text-[#e7000b] border border-[#e7000b]/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {role.replace("-", " ")}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 font-bold uppercase">
              {session.user.name?.[0] || "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 leading-tight capitalize">
                {session.user.name || "Admin User"}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {session.user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Rendering Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#f8f9fa]">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}