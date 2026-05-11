"use client";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import AssignmentTable from "@/components/AssignmentTable";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlusCircle, XCircle } from "lucide-react";

// MAIN LOGIC COMPONENT
function AssignmentListContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter"); // URL se filter word nikalna
  
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("/api/assignments");
        if (response.data.success) {
          setAssignments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  // DATA FILTERING LOGIC 🔥
  let displayedAssignments = assignments;
  if (filterParam) {
    displayedAssignments = assignments.filter((item) => {
      const prodName = item.product?.toLowerCase() || "";
      // Charger wale case ke liye (Laptop Charger / Mobile Charger)
      if (filterParam === "Charger") {
        return prodName.includes("charger");
      }
      return prodName.includes(filterParam.toLowerCase());
    });
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Active Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">
            List of all assets currently issued to employees.
          </p>
        </div>
        <Link href="/admin/assign/add" className="bg-[#e7000b] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#cc000a] transition-all shadow-md active:scale-[0.98]">
          <PlusCircle className="w-5 h-5" />
          Assign New Asset
        </Link>
      </div>

      {/* FILTER ACTIVE BADGE */}
      {filterParam && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
          <span>Filtering by: <span className="font-black uppercase">{filterParam}</span></span>
          <Link href="/admin/assign/list" className="ml-2 hover:text-blue-900">
            <XCircle className="w-4 h-4" />
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e7000b]"></div>
        </div>
      ) : (
        <AssignmentTable data={displayedAssignments} />
      )}
    </div>
  );
}

// WRAPPER COMPONENT FOR NEXT.JS COMPATIBILITY
export default function AssignmentListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading assignments...</div>}>
      <AssignmentListContent />
    </Suspense>
  );
}