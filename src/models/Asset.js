import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    // 1. BASIC IDENTITY
    assetName: { type: String, required: true },
    assetId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    product: { type: String, required: true },
    
    // 2. COMPANY / BRANCH TRACKING (Naya feature)
    company: { 
      type: String, 
      required: true,
      enum: ["Bluediamond Infotech PVT LTD", "Trivesa HR Consultancy", "BDIT Institute"] 
    },
    
    // 3. CURRENT STATUS & HOLDER
    status: { 
      type: String, 
      default: "Available", 
      enum: ["Available", "Assigned", "Under Maintenance", "Retired"] 
    },
    currentCondition: {
      type: String,
      default: "New",
      enum: ["New", "Good", "Fair", "Poor"]
    },
    currentHolder: { 
      type: String, // Employee ka naam ya ID
      default: null 
    },
    assignedDate: { 
      type: Date, 
      default: null 
    },

    // 4. LIFECYCLE HISTORY (The Timeline)
    history: [
      {
        action: { 
          type: String, 
          enum: ["Added to Inventory", "Assigned", "Returned", "Sent to Repair", "Repaired"] 
        },
        holderName: { type: String, default: "N/A" }, // Kisko diya ya kisse wapas liya
        date: { type: Date, default: Date.now },
        conditionAtThatTime: { type: String }, // Us waqt condition kaisi thi
        remarks: { type: String }, // Admin ke notes (e.g., "Screen pe scratch hai")
        handledBy: { type: String } // Kis Admin ne yeh entry ki
      }
    ],

    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);

export default Asset;