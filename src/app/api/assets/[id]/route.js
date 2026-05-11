import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Asset from "@/models/Asset";

// GET SINGLE ASSET
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const asset = await Asset.findById(id);
    
    if (!asset) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: asset }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// UPDATE ASSET (QUANTITY)
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { quantity: Number(body.quantity) },
      { new: true, runValidators: true }
    );

    if (!updatedAsset) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Stock quantity updated successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE ASSET
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Asset.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Asset deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}