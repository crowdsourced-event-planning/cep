"use client";

import ShowMoreSection from "./ShowMoreSection";
import { formatCurrency } from "@/lib/utils/format";
import { format } from "date-fns";
import { useState } from "react";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  createdAt?: string;
  xenditId?: string;
  invoiceId?: string;
}

interface Funding {
  _id: string;
  eventId?: string;
  eventTitle: string;
  eventSlug?: string | null;
  amount: number;
  createdAt?: string;
}

interface Props {
  transactions: Transaction[];
  fundings: Funding[];
  waitingPayments: Transaction[];
  handleCheck: (formData: FormData) => Promise<void>;
}

const STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Paid", value: "PAID" },
  { label: "Settled", value: "SETTLED" },
  { label: "Failed", value: "FAILED" },
];

export default function ProfileHistorySection({
  transactions,
  fundings,
  waitingPayments,
  handleCheck,
}: Props) {
  // Group fundings by eventId
  const fundingGroups = fundings.reduce<Record<string, Funding[]>>(
    (acc, fund) => {
      const key = fund.eventId || fund.eventTitle;
      if (!acc[key]) acc[key] = [];
      acc[key].push(fund);
      return acc;
    },
    {}
  );

  // State for open/close dropdown per event
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filter transactions sesuai status
  const filteredTransactions =
    statusFilter === "ALL"
      ? transactions
      : transactions.filter((tx) => tx.status.toUpperCase() === statusFilter);

  return (
    <>
      {/* Waiting Payment */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Waiting Payment</h2>
        <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
          {waitingPayments.length === 0 ? (
            <p className="p-4 text-gray-500">No pending payments.</p>
          ) : (
            waitingPayments.map((tx) => (
              <div
                key={tx._id ?? tx.invoiceId}
                className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <p>
                    <strong>Amount:</strong> {formatCurrency(tx.amount)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
                      {tx.status}
                    </span>
                  </p>
                </div>
                <form action={handleCheck}>
                  <input type="hidden" name="xenditId" value={tx.xenditId} />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition cursor-pointer"
                  >
                    Pay Now
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Transaction History */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`px-3 py-1 rounded-full border text-sm font-medium transition cursor-pointer
                ${
                  statusFilter === opt.value
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }
              `}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
          <ShowMoreSection<Transaction>
            items={filteredTransactions}
            emptyText="No transaction history."
            renderItem={(tx, idx) => (
              <div
                key={tx._id ?? idx}
                className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <p>
                    <strong>Type:</strong>{" "}
                    <span className="capitalize">{tx.type}</span>
                  </p>
                  <p>
                    <strong>Amount:</strong> {formatCurrency(tx.amount)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        ["COMPLETED", "PAID", "SETTLED"].includes(tx.status)
                          ? "bg-green-100 text-green-700"
                          : tx.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {tx.createdAt
                    ? format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm:ss")
                    : "-"}
                </p>
              </div>
            )}
          />
        </div>
      </section>

      {/* Funding History Accordion */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Funding History</h2>
        <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
          {Object.entries(fundingGroups).length === 0 ? (
            <p className="p-4 text-gray-500">No funding activity.</p>
          ) : (
            Object.entries(fundingGroups).map(([eventId, funds]) => {
              const event = funds[0];
              const isOpen = open[eventId] ?? false;
              return (
                <div key={eventId} className="border-b last:border-b-0">
                  {/* Parent row */}
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition"
                    onClick={() =>
                      setOpen((prev) => ({
                        ...prev,
                        [eventId]: !isOpen,
                      }))
                    }
                  >
                    <span className="font-semibold text-left">
                      {event.eventSlug ? (
                        <a
                          href={`/event/${event.eventSlug}`}
                          className="text-blue-600 hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {event.eventTitle}
                        </a>
                      ) : (
                        event.eventTitle
                      )}
                    </span>
                    <span className="ml-2 text-gray-400">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {/* Child rows */}
                  {isOpen && (
                    <div className="bg-gray-50">
                      {funds.map((fund, idx) => (
                        <div
                          key={fund._id ?? idx}
                          className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-3 border-t border-gray-100"
                        >
                          <div>
                            <p>
                              <strong>Amount:</strong>{" "}
                              {formatCurrency(fund.amount)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {fund.createdAt
                              ? format(
                                  new Date(fund.createdAt),
                                  "dd/MM/yyyy HH:mm:ss"
                                )
                              : "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
