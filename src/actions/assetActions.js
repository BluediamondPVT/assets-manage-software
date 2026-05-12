"use server";

import { connectToDatabase } from "@/lib/db";
import Asset from "@/models/Asset";
import Assignment from "@/models/Assignment";

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

// 3. DASHBOARD MAGIC STATS 🔥
export const getDashboardStats = async () => {
  try {
    await connectToDatabase();

    // Godown se saara stock uthao
    const assets = await Asset.find({}).lean();
    
    // Active Assignments uthao (Jo abhi employees ke paas hain)
    const activeAssignments = await Assignment.find({ status: "Assigned" }).lean();

    const stats = {
      Laptops: { stock: 0, issued: 0 },
      Desktops: { stock: 0, issued: 0 },
      CPU: { stock: 0, issued: 0 },
      Mouse: { stock: 0, issued: 0 },
      Keyboard: { stock: 0, issued: 0 }, // 🔥 Keyboard Added
      "Mobile Phones": { stock: 0, issued: 0 },
      Chargers: { stock: 0, issued: 0 },
      Printer: { stock: 0, issued: 0 },
      "Camera / CCTV": { stock: 0, issued: 0 },
      Chairs: { stock: 0, issued: 0 },
    };

    // Godown Stock Count
    assets.forEach(a => {
      const p = a.product;
      const q = a.quantity || 0;
      if (stats[p]) stats[p].stock += q;
      else if (p === "Laptop Chargers" || p === "Mobile Chargers") stats.Chargers.stock += q;
    });

    // Issued Count
    activeAssignments.forEach(asgn => {
      const p = asgn.product;
      if (stats[p]) stats[p].issued += 1;
      else if (p === "Laptop Chargers" || p === "Mobile Chargers") stats.Chargers.issued += 1;
    });

    return JSON.parse(JSON.stringify(stats));
  } catch (error) {
    console.error("Stats Error:", error);
    return {};
  }
};