import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Asset from "@/models/Asset"; // Godown ka data update karne ke liye

// 1. GET ALL ASSIGNMENTS (Table mein dikhane ke liye)
export async function GET() {
  try {
    await connectToDatabase();
    
    // Saari history nikalenge latest pehle
    const assignments = await Assignment.find({})
      .populate("assetRef", "assetId") // Asset ID bhi sath me laayenge
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, data: assignments }, { status: 200 });
  } catch (error) {
    console.error("GET Assignments Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. ASSIGN ASSET TO EMPLOYEE (The Magic Function 🔥)
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const { 
      employeeName, 
      personalNumber, 
      department, 
      assetRef, // Yeh Godown wale asset ki MongoDB ID hai
      category, 
      product, 
      assignedDate, 
      condition, 
      remark 
    } = body;

    // STEP 1: Pehle check karo ki Godown mein wo item bacha hai ya nahi?
    const assetInGodown = await Asset.findById(assetRef);
    
    if (!assetInGodown) {
      return NextResponse.json({ success: false, error: "Asset not found in Godown!" }, { status: 404 });
    }

    if (assetInGodown.quantity < 1) {
      return NextResponse.json({ success: false, error: "Out of Stock! Ye item godown mein nahi bacha." }, { status: 400 });
    }

    // STEP 2: Nayi Assignment Entry Banao
    const newAssignment = new Assignment({
      employeeName,
      personalNumber,
      department,
      assetRef,
      category,
      product,
      assignedDate,
      condition,
      remark
    });

    await newAssignment.save();

    // STEP 3: Godown se 1 item minus (-) kar do!
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