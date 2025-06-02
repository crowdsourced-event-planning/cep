"use client";

import React, { useState } from "react";
// import Swal from 'sweetalert2'; // Unused import removed
import { useRouter } from "next/navigation";
import Link from "next/link";
// import doLogin from "./action";
import Swal from "sweetalert2";

export interface IInputLogin {
  email: string;
  password: string;
}

export default function Login() {
  const [input, setInput] = useState<IInputLogin>({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted with input:", input);

    try {
      // const result = await doLogin(input);

      // if (result && !result.success) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Login Failed!",
      //     text: result.message,
      //     confirmButtonColor: "#3b82f6",
      //   });
      // } else if (result && result.success) {
      //   await Swal.fire({
      //     icon: "success",
      //     title: "Login Success!",
      //     text: "Redirecting to dashboard...",
      //     showConfirmButton: false,
      //   });

      //   router.push("/");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(input),
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        document.cookie = `x-user-id=${data.user._id}; path=/; max-age=86400`;
        document.cookie = `access_token=${data.access_token}; path=/; max-age=86400`;

        // Trigger event authChanged
        window.dispatchEvent(new Event("authChanged"));

        router.push("/");
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Login Failed!",
          text: data.message || "An unknown error occurred.",
          confirmButtonColor: "#3b82f6",
        });
      }
    } catch (err) {
      console.log(err);
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
          </Link>
        </p>
      </form>
    </div>
  );
}
