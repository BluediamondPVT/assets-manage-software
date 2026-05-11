import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Asset from "@/models/Asset"; // Godown me plus karne ke liye

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    // Frontend se reason/condition lenge (Optional)
    const body = await req.json();
    const { returnCondition, returnRemark } = body;

    // 1. Assignment find karo
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return NextResponse.json({ success: false, error: "Assignment record not found!" }, { status: 404 });
    }

    if (assignment.status === "Returned") {
      return NextResponse.json({ success: false, error: "This asset is already returned." }, { status: 400 });
    }

    // 2. Assignment ko "Returned" mark karo
    assignment.status = "Returned";
    assignment.returnedDate = new Date(); // Aaj ki date
    
    // Agar wapas aate time koi nayi condition ya remark hai, toh update karo
    if (returnCondition) assignment.condition = returnCondition;
    if (returnRemark) assignment.remark = assignment.remark + ` | Return Note: ${returnRemark}`;

    await assignment.save();

    // 3. Godown (Asset) mein wapas +1 (Plus) kar do! 🔥
    const assetInGodown = await Asset.findById(assignment.assetRef);
    if (assetInGodown) {
      assetInGodown.quantity += 1;
      await assetInGodown.save();
    }

    return NextResponse.json(
      { success: true, message: "Asset returned successfully & Stock updated!" }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("PUT Return Assignment Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}