import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    // 1. BASIC IDENTITY
    assetId: { type: String, required: true, unique: true }, // Batch/Stock ID
    type: { type: String, required: true },
    category: { type: String, required: true },
    product: { type: String, required: true },
    
    // 2. COMPANY / BRANCH
    company: { 
      type: String, 
      required: true,
      enum: ["Bluediamond Infotech PVT LTD", "Trivesa HR Consultancy", "BDIT Institute"] 
    },
    
    // 3. STOCK / QUANTITY (Naya King 👑)
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },

    // Note: History, Status, aur Condition yahan se hata diye. 
    // Wo ek naye 'Assignment' collection mein jayenge jab hum employee ko assign karenge.

    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);

export default Asset;