"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // NextAuth ka signIn function call kar rahe hain
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError("Invalid Email or Password");
    } else {
      router.push("/admin"); // Login success hone par admin dashboard pe bhej do
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="bg-white p-10 border border-gray-100 rounded-2xl shadow-xl w-[400px]">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to manage your assets
          </p>
        </div>

        {/* Premium Error Alert */}
        {error && (
          <div className="bg-red-50 text-[#e7000b] text-sm p-3 rounded-lg mb-6 text-center border border-red-100 font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-4 focus:ring-[#e7000b]/15 focus:border-[#e7000b] transition-all"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#e7000b] text-white font-semibold py-3 rounded-lg hover:bg-[#cc000a] transition-all shadow-md hover:shadow-lg active:scale-[0.98] mt-2"
          >
            Secure Login
          </button>
        </form>

      </div>
    </div>
  );
}