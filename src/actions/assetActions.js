"use server"; // 🔥 YEH LINE SABSE ZAROORI HAI

import { connectToDatabase } from "@/lib/db";
import Asset from "@/models/Asset";

// 1. LIST PAGE KE LIYE
export const getAssets = async () => {
  try {
    await connectToDatabase(); 
    const assets = await Asset.find({}).sort({ createdAt: -1 }).lean();
    const serializedAssets = JSON.parse(JSON.stringify(assets));
    return serializedAssets.map(asset => ({ ...asset, id: asset._id }));
  } catch (error) {
    return [];
  }
};

// 2. EDIT PAGE PE DATA DIKHANE KE LIYE
export const getAssetById = async (id) => {
  try {
    await connectToDatabase();
    const asset = await Asset.findById(id).lean();
    if (!asset) return null;
    
    const plainAsset = JSON.parse(JSON.stringify(asset));
    plainAsset.id = plainAsset._id;
    return plainAsset;
  } catch (error) {
    return null;
  }
};