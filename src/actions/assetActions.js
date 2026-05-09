"use server";
import { connectToDatabase } from "@/lib/db";
import Asset from "@/models/Asset";
import { revalidatePath } from "next/cache";

// 1. Fetch Assets (Ab isme company aur condition bhi aayegi)
export async function getAssets() {
  await connectToDatabase();
  const assets = await Asset.find({}).sort({ createdAt: -1 }).lean();

  return assets.map((asset) => ({
    id: asset._id.toString(),
    assetName: asset.assetName,
    assetId: asset.assetId,
    type: asset.type,
    category: asset.category,
    product: asset.product,
    company: asset.company, // Naya addition
    status: asset.status,
    currentCondition: asset.currentCondition, // Naya addition
  }));
}

// 2. Create Naya Asset (History timeline ke sath)
export async function createNewAsset(assetData) {
  try {
    await connectToDatabase();
    const assetId = `AST-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAsset = new Asset({
      assetName: assetData.assetName,
      assetId: assetId,
      type: assetData.selectedType,
      category: assetData.selectedCategory,
      product: assetData.selectedProduct,
      company: assetData.company, // Company ka naam
      status: "Available",
      currentCondition: "New", // Default naya aayega
      currentHolder: "IT Store", // Default store me rakha hai

      // HISTORY KI PEHLI ENTRY 🔥
      history: [
        {
          action: "Added to Inventory",
          holderName: "IT Store",
          conditionAtThatTime: "New",
          remarks: "Initial Setup / New Purchase",
          handledBy: "Super Admin", // Aage chalke ise session se lenge
        },
      ],
    });

    await newAsset.save();
    revalidatePath("/admin/assets/add");
    revalidatePath("/admin/assets/list");
    return {
      success: true,
      message: "Asset Added Successfully with History Tracking!",
    };
  } catch (error) {
    console.error("Asset save error:", error);
    return { success: false, error: "Failed to add asset." };
  }
}

// 3. Delete Asset
export async function deleteAsset(id) {
  await connectToDatabase();
  await Asset.findByIdAndDelete(id);
  revalidatePath("/admin/assets/list");
}

// (Abhi ke liye basic Update/Get by ID yahan niche rakhna hai, aage assign asset banayenge tab isko modify karenge)
export async function getAssetById(id) {
  await connectToDatabase();
  const asset = await Asset.findById(id).lean();
  if (!asset) return null;

  return {
    id: asset._id.toString(),
    assetName: asset.assetName,
    assetId: asset.assetId,
    type: asset.type,
    category: asset.category,
    product: asset.product,
    status: asset.status,
    condition: asset.currentCondition,
  };
}


// 4. Asset Update karne ke liye (Missing Function)
export async function updateAsset(id, formData) {
  await connectToDatabase();
  
  const assetName = formData.get("assetName");
  const status = formData.get("status");
  const condition = formData.get("condition"); 

  await Asset.findByIdAndUpdate(id, {
    assetName,
    status,
    currentCondition: condition // Schema mein ab yeh currentCondition hai
  });

  revalidatePath("/admin/assets/list");
}