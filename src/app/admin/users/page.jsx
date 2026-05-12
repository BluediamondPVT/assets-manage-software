import { getUsers, createNewUser } from "@/actions/userActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  
  // Security check: Agar super-admin nahi hai toh dashboard pe fek do
  if (session?.user?.role !== "super-admin") {
    redirect("/admin");
  }

  const users = await getUsers();

  return (
    <div className="space-y-6 font-sans">
      
      {/* Premium Header */}
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          User Management
        </h1>
        <p className="text-gray-500 text-sm">
          Add and manage enterprise administrators and their access levels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Naya User Add Karne ka Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <span className="p-2 bg-[#e7000b]/10 rounded-lg text-[#e7000b]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            </span>
            <h2 className="text-lg font-bold text-gray-800">Add New User</h2>
          </div>
          
          <form action={createNewUser} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="e.g. Rahul Sharma"
                required 
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all bg-gray-50/50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="admin@company.com"
                required 
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all bg-gray-50/50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temporary Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••"
                required 
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all bg-gray-50/50 focus:bg-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">System Role</label>
              <select 
                name="role" 
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all bg-gray-50/50 focus:bg-white cursor-pointer"
              >
                <option value="admin">Normal Admin (Read-Only)</option>
                <option value="super-admin">Super Admin (Full Access)</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="w-full cursor-pointer bg-[#e7000b] text-white font-semibold py-3.5 rounded-lg hover:bg-[#cc000a] transition-all shadow-md hover:shadow-lg active:scale-[0.99] mt-2"
            >
              Create User Account
            </button>
          </form>
        </div>

        {/* Users ki List (Table) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-lg font-bold text-gray-800">Active Administrators</h2>
            <div className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Total: {users.length}
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="p-4 font-semibold text-gray-600 text-sm">User Details</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Role & Access</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                        user.role === "super-admin" 
                          ? "bg-red-50 text-[#e7000b] border-red-100" 
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {user.role === "super-admin" ? "👑 Super Admin" : "👤 Admin"}
                      </span>
                    </td>
                    <td className="p-4 text-right align-middle">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-400 italic">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}