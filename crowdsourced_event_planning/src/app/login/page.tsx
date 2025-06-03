"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import doLogin from "./action";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

export interface IInputLogin {
  email: string;
  password: string;
}

function LoginForm() {
  const [input, setInput] = useState<IInputLogin>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, refreshAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await doLogin(input);

      if (result && !result.success) {
        toast.error(result.message || "Login Failed!");
      } else if (result && result.success) {
        login();
        setTimeout(() => {
          refreshAuth();
        }, 100);
        toast.success("Login Success! Redirecting...");
        setTimeout(() => {
          const callbackUrl = searchParams.get("callbackUrl");
          router.push(callbackUrl || "/");
        }, 800);
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] rounded-full bg-cyan-400 opacity-20 blur-3xl"></div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="z-10 bg-[#10151c] bg-opacity-95 p-10 rounded-2xl shadow-2xl flex flex-col items-center space-y-6 min-w-[350px] w-full max-w-md"
      >
        <h1 className="text-gray-200 font-bold text-4xl text-center mb-2">
          Login
        </h1>
        <div className="flex flex-col w-full">
          <label className="text-gray-400 text-base mb-1">Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            name="email"
            value={input.email}
            onChange={handleChange}
            className="border border-gray-700 rounded-md bg-[#18222e] py-2 px-3 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-gray-400 text-base mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={input.password}
            onChange={handleChange}
            className="border border-gray-700 rounded-md bg-[#18222e] py-2 px-3 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div>
        <button
          type="submit"
          className="bg-cyan-500 w-full py-2 px-4 rounded-lg cursor-pointer hover:bg-cyan-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg shadow-md"
        >
          Login
        </button>
        <p className="text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register here
          </Link>{" "}
        </p>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
