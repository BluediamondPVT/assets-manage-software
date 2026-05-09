import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();

    // Check karo agar pehle se koi admin hai ya nahi
    const existingUser = await User.findOne({ email: "admin@mycompany.com" });
    
    if (existingUser) {
      return NextResponse.json({ message: "Admin already exists!" });
    }

    // Naya password encrypt karo
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Database mein pehla user save karo
    const newUser = new User({
      name: "Main Boss",
      email: "superadmin@blue.com",
      password: hashedPassword,
      role: "super-admin", // Pehla user super-admin
    });

    await newUser.save();

    return NextResponse.json({ message: "Super Admin created successfully!" });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}