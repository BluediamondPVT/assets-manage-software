import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    // 1. EMPLOYEE DETAILS
    employeeName: { type: String, required: true },
    personalNumber: { type: String, required: true }, // Emp ID ya Phone Number
    department: { type: String, required: true },

    //1.5 COMPANY / BRANCH (Jahan se assign kar rahe hain)
    company:{
      type:String,
      required:true,
      enum: ["Bluediamond Infotech PVT LTD", "Trivesa HR Consultancy", "BDIT Institute","Inventory Management"] // Predefined companies
    },

    // 2. ASSET DETAILS (Kya assign kiya?)
    // assetRef: Inventory (Asset collection) ke original item ka link taaki quantity minus/plus kar sakein
    assetRef: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true }, 
    category: { type: String, required: true },
    product: { type: String, required: true },

    // 3. ASSIGNMENT INFO (Kab aur kaisa diya?)
    assignedDate: { type: Date, required: true },
    condition: { 
      type: String, 
      required: true,
      enum: ["New", "Good", "Fair", "Poor"] 
    },
    remark: { type: String, default: "" },

    // 4. LIFECYCLE TRACKING (Wapas aaya ya nahi?)
    status: {
      type: String,
      default: "Assigned",
      enum: ["Assigned", "Returned", "Lost/Damaged"]
    },
    returnedDate: { type: Date, default: null },

    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Kis admin ne assign kiya
  },
  { timestamps: true }
);

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export default Assignment;