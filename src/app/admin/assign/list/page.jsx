"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AssignmentTable from "@/components/AssignmentTable";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function AssignmentListPage() {
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

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#e7000b]"></div>
        </div>
      ) : (
        <AssignmentTable data={assignments} />
      )}
    </div>
  );
}