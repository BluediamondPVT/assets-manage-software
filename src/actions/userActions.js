"use server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Database se saare users laane ke liye
export async function getUsers() {
  await connectToDatabase();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  
  // Next.js ko plain object chahiye hota hai, isliye _id ko string me convert kar rahe hain
  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }));
}

// Naya user create karne ke liye
export async function createNewUser(formData) {
  await connectToDatabase();
  
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  // Check agar user pehle se hai
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists!");

  // Password secure karo
  const hashedPassword = await bcrypt.hash(password, 10);

  // Naya user save karo
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();

  // Bina page refresh kiye UI update karne ka magic trick!
  revalidatePath("/admin/users"); 
}