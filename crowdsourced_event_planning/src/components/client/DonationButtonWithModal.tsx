"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import doDonation from "@/app/event/[event]/donation/action";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import AmountInput from "@/components/AmountInput";
import { useRouter, usePathname } from "next/navigation";

export default function DonationButtonWithModal({
  eventSlug,
  userId,
}: {
  eventSlug: string;
  userId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", message: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handler khusus untuk AmountInput
  const handleAmountChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      amount: value, // langsung simpan angka asli dari AmountInput
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("eventSlug", eventSlug);
    formData.append("amount", form.amount);
    formData.append("message", form.message);

    try {
      await doDonation(formData);
      toast.success("Donasi berhasil!");
      setForm({ amount: "", message: "" });
      setOpen(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Donasi gagal";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (!userId) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      {/* <Toaster position="top-center" /> */}
      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer mb-3"
        onClick={handleOpen}
      >
        Make a Donation
      </Button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 rounded-full hover:bg-gray-200 transition p-1 cursor-pointer"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={22} />
            </button>
            <h1 className="text-2xl font-bold mb-6 text-center">
              Donasi untuk Event
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="hidden" name="eventSlug" value={eventSlug} />
              <div>
                <label className="block mb-1 font-medium">Nominal Donasi</label>
                <AmountInput
                  name="amount"
                  required
                  placeholder="1.000.000"
                  className="text-base"
                  onValueChange={handleAmountChange}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Pesan (Opsional)
                </label>
                <textarea
                  name="message"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Tulis pesan dukungan..."
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition cursor-pointer"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Donasi Sekarang"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
