import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Asset from "@/models/Asset";

// GET ALL ASSETS
export async function GET() {
  try {
    await connectToDatabase();
    const assets = await Asset.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: assets }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CREATE NEW ASSET
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json(); // Frontend se data nikalna
    
    const { company, selectedType, selectedCategory, selectedProduct, quantity } = body;

    const assetId = `AST-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAsset = new Asset({
      assetId,
      type: selectedType,
      category: selectedCategory,
      product: selectedProduct,
      company,
      quantity: Number(quantity),
    });

    await newAsset.save();
    return NextResponse.json({ success: true, message: "Inventory updated successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}