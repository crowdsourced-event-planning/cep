"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import doDonation from "./action";
import toast, { Toaster } from "react-hot-toast";

export default function DonationPage() {
  const params = useParams();
  const router = useRouter();
  const eventSlug = params.event as string;

  const [form, setForm] = useState({
    amount: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eventSlug", eventSlug);
    formData.append("amount", form.amount);
    formData.append("message", form.message);

    try {
      await doDonation(formData);
      toast.success("Donasi berhasil!");
      router.push(`/event/${eventSlug}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Donasi gagal";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Donasi untuk Event
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="hidden" name="eventSlug" value={eventSlug} />
          <div>
            <label className="block mb-1 font-medium">Nominal Donasi</label>
            <input
              type="number"
              name="amount"
              className="w-full border rounded px-3 py-2"
              placeholder="Contoh: 50000"
              min={1}
              required
              value={form.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Pesan (Opsional)</label>
            <textarea
              name="message"
              className="w-full border rounded px-3 py-2"
              placeholder="Tulis pesan dukungan..."
              rows={3}
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Donasi Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
