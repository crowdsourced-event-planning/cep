"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import Button from "@/components/ui/Button";
import AmountInput from "@/components/AmountInput";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { Wallet, X } from "lucide-react";

export default function TopupButtonWithModal() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleAmountChange = (value: string) => setAmount(value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/transaction/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Topup gagal");
        setLoading(false);
        return;
      }
      if (data.invoiceUrl) {
        toast.success("Topup berhasil! Mengalihkan ke pembayaran...");
        setOpen(false);
        router.push(data.invoiceUrl);
      }
    } catch {
      toast.error("Terjadi kesalahan saat topup");
    } finally {
      setLoading(false);
    }
  };

  // Render modal in portal (client only)
  const modal =
    typeof window !== "undefined" && open
      ? ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 rounded-full hover:bg-gray-200 transition p-1 cursor-pointer"
                onClick={() => setOpen(false)}
                type="button"
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
              <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                <Wallet size={24} /> Topup Saldo
              </h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-1 font-medium">
                    Nominal Topup
                  </label>
                  <AmountInput
                    name="amount"
                    required
                    placeholder="1.000.000"
                    className="text-base"
                    onValueChange={handleAmountChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Wallet size={18} />
                  {loading ? "Memproses..." : "Topup Sekarang"}
                </Button>
              </form>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        className={`px-3 py-2 rounded font-medium transition-colors cursor-pointer ${
          pathname === "/topup"
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
        }`}
        onClick={() => setOpen(true)}
        type="button"
      >
        Topup Saldo
      </button>
      {modal}
    </>
  );
}
