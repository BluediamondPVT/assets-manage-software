"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "@/components/LogoutButton";

export default function Sidebar({ role }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Reusable NavItem Component
  const NavItem = ({ href, icon, text }) => (
    <Link
      href={href}
      title={isCollapsed ? text : ""}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-[#e7000b]/10 hover:text-[#e7000b] transition-all group font-medium mx-2 overflow-hidden ${
        isCollapsed ? "justify-center" : ""
      }`}
    >
      <span className="text-lg group-hover:scale-110 transition-transform shrink-0">
        {icon}
      </span>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      // flex-shrink-0 ensures sidebar doesn't get squeezed
      className="bg-gray-950 text-gray-400 flex flex-col border-r border-gray-800 font-sans shadow-xl z-20 relative shrink-0 h-screen"
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-8 bg-[#e7000b] border-[3px] border-[#f8f9fa] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md hover:bg-[#cc000a] hover:scale-110 transition-all z-50 outline-none"
      >
        <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.div>
      </button>

      {/* Brand Logo Area */}
      <div
        className={`h-20 shrink-0 flex items-center border-b border-gray-800 transition-all ${isCollapsed ? "justify-center px-0" : "px-6"}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded bg-[#e7000b] flex items-center justify-center shadow-lg shadow-[#e7000b]/20 shrink-0">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-white text-xl font-bold tracking-wide whitespace-nowrap"
              >
                Bluediamond
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

    {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2"
            >
              Overview
            </motion.p>
          )}
        </AnimatePresence>
        
        <NavItem href="/admin" icon="📊" text="Dashboard" />
        <NavItem href="/admin/assets/list" icon="📋" text="View Inventory" />
        
        {/* Ab yeh "Add Asset" dono (Admin aur Super Admin) ko dikhega */}
        <NavItem href="/admin/assets/add" icon="➕" text="Add Asset" />

        {/* Sirf Super Admin Section */}
        {role === "super-admin" && (
          <>
            <div className="pt-6 pb-2">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 text-[10px] font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Management
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <NavItem href="/admin/users" icon="👑" text="Manage Users" />
          </>
        )}
      </nav>

    {/* Logout Area */}
      <div className={`p-4 border-t border-gray-800 bg-gray-900/50 flex transition-all ${isCollapsed ? "justify-center" : "px-6"}`}>
        <div className={`transition-all duration-300 ${isCollapsed ? "w-10 rounded-md" : "w-full"}`}>
          
          {/* Yahan humne isCollapsed prop bhej diya */}
          <LogoutButton isCollapsed={isCollapsed} />
          
        </div>
      </div>
    </motion.aside>
  );
}