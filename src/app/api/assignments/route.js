import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Asset from "@/models/Asset"; 

// 1. GET ALL ASSIGNMENTS
export async function GET() {
  try {
    await connectToDatabase();
    const assignments = await Assignment.find({})
      .populate("assetRef", "assetId") 
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, data: assignments }, { status: 200 });
  } catch (error) {
    console.error("GET Assignments Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. ASSIGN ASSET TO EMPLOYEE
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const { 
      employeeName, 
      personalNumber, 
      department, 
      company, // 🔥 NAYA FIELD EXTRACT KIYA
      assetRef, 
      category, 
      product, 
      assignedDate, 
      condition, 
      remark 
    } = body;

    // STEP 1: Check in Godown
    const assetInGodown = await Asset.findById(assetRef);
    
    if (!assetInGodown) {
      return NextResponse.json({ success: false, error: "Asset not found in Godown!" }, { status: 404 });
    }

    if (assetInGodown.quantity < 1) {
      return NextResponse.json({ success: false, error: "Out of Stock! Ye item godown mein nahi bacha." }, { status: 400 });
    }

    // STEP 2: Create Assignment
    const newAssignment = new Assignment({
      employeeName,
      personalNumber,
      department,
      company, // 🔥 YAHAN DB ME SAVE KAR DIYA
      assetRef,
      category,
      product,
      assignedDate,
      condition,
      remark
    });

    await newAssignment.save();

    // STEP 3: Deduct from Godown
    assetInGodown.quantity -= 1;
    await assetInGodown.save();

    return NextResponse.json(
      { success: true, message: "Asset successfully assigned & Godown stock updated!" }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("POST Assignment Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}