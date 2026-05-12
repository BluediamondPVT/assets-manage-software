"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton({ isCollapsed }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      title="Secure Logout"
      className={`flex items-center cursor-pointer justify-center gap-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-[#e7000b] hover:text-white transition-all font-semibold group ${
        isCollapsed ? "w-10 h-10 p-0" : "w-full py-2.5"
      }`}
    >
      <svg 
        width={isCollapsed ? "20" : "18"} 
        height={isCollapsed ? "20" : "18"}  
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={!isCollapsed ? "group-hover:-translate-x-1 transition-transform" : ""}
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      {/* Text sirf tab dikhega jab sidebar khula ho */}
      {!isCollapsed && <span className="whitespace-nowrap">Secure Logout</span>}
    </button>
  );
}