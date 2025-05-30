"use client";

import React, { useState } from "react";
import doRegister from "./action";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface IInput {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [input, setInput] = useState<IInput>({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await doRegister(input);

      if (result && !result.success) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed!",
          text: result.message,
          confirmButtonColor: "#3b82f6",
        });
      } else if (result && result.success) {
        await Swal.fire({
          icon: "success",
          title: "Registration Success!",
          text: "Redirecting to login...",
          showConfirmButton: false,
        });

        router.push("/login");
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
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
          Register
        </h1>
        <div className="flex flex-col w-full">
          <label className="text-gray-400 text-base mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={input.name}
            onChange={handleChange}
            className="border border-gray-700 rounded-md bg-[#18222e] py-2 px-3 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-gray-400 text-base mb-1">Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            name="email"
            value={input.email}
            onChange={handleChange}
            className="border border-gray-700 rounded-md bg-[#18222e] py-2 px-3 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 w-full py-2 px-4 rounded-lg cursor-pointer hover:bg-cyan-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg shadow-md"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
