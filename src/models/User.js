import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"], // Sirf yeh 2 role allow honge
      default: "admin",
    },
  },
  { timestamps: true }
);

// Agar model pehle se bana hai toh wahi use karo, warna naya banao
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;