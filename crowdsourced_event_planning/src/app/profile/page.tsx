import { ObjectId } from "mongodb";
import UserModel from "@/db/models/UserModel";
import { verifyToken } from "@/lib/jwt";
import { getDb } from "@/db/config/mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BadgeDollarSign, Mail } from "lucide-react";
import multiavatar from "@multiavatar/multiavatar/esm";
import LogoutButton from "@/components/client/LogoutButton";

interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  role?: string;
  badge?: string;
  balance?: number;
  totalRating?: number;
  totalUserRating?: number;
  createdEvents?: string[];
  joinedEvents?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ITransaction {
  _id?: ObjectId;
  userId: ObjectId;
  amount: number;
  status: string;
  type: string; // topup / refund
  xenditId: string;
  invoiceId: string;
  invoiceUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IFunding {
  _id?: ObjectId;
  eventId: string;
  userId: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return <div className="p-4">Unauthorized</div>;
  }

  const payload: { _id: string; name: string } = await verifyToken(token);
  if (!payload) {
    return <div className="p-4">Unauthorized</div>;
  }

  const user: IUser | null = await UserModel.getById(payload._id);
  if (!user) {
    return <div className="p-4">Unauthorized</div>;
  }

  const db = await getDb();
  const transactions = await db
    .collection<ITransaction>("transactions")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray();

  const fundings = await db
    .collection<IFunding>("fundings")
    .find({ userId: user._id?.toString() })
    .sort({ createdAt: -1 })
    .toArray();

  const waitingPayments = transactions.filter((t) => t.status === "PENDING");
  const historyTransactions = transactions.filter(
    (t) => t.status !== "PENDING"
  );

  const handleCheck = async (formData: FormData) => {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const xenditId = formData.get("xenditId");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/topup/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${token}`,
        },
        body: JSON.stringify({
          invoiceId: xenditId,
        }),
        credentials: "include",
      }
    );

    const data: { status: number; invoiceUrl?: string; message?: string } =
      await res.json();

    if (res.ok) {
      if (data && data.invoiceUrl) {
        return redirect(data.invoiceUrl);
      } else if (data && data.message) {
        return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`);
      }
    } else {
      return redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Card */}
      <section>
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow p-6 mb-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow">
              <span
                className="w-20 h-20 block"
                dangerouslySetInnerHTML={{
                  __html: multiavatar(user.name || "User"),
                }}
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              {user.name}
              {user.role && (
                <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold uppercase">
                  {user.role}
                </span>
              )}
              {user.badge && (
                <span className="ml-2 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
                  {user.badge}
                </span>
              )}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <BadgeDollarSign size={18} className="text-green-600" />
              <span className="font-semibold text-lg text-green-700">
                Rp {user.balance?.toLocaleString() ?? 0}
              </span>
            </div>
            {/* Logout button: full width on mobile, auto on desktop */}
            <div className="mt-6 w-full">
              <LogoutButton />
            </div>
          </div>
        </div>
      </section>

      {/* Waiting Payment */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Waiting Payment</h2>
        <div className="bg-white rounded-xl shadow divide-y">
          {waitingPayments.length === 0 ? (
            <p className="p-4 text-gray-500">No pending payments.</p>
          ) : (
            waitingPayments.map((tx) => (
              <div
                key={tx._id?.toString()}
                className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <p>
                    <strong>Amount:</strong> Rp {tx.amount.toLocaleString()}
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
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition cursor-pointer"
                  >
                    Bayar Sekarang
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
        <div className="bg-white rounded-xl shadow divide-y">
          {historyTransactions.length === 0 ? (
            <p className="p-4 text-gray-500">No transaction history.</p>
          ) : (
            historyTransactions.map((tx) => (
              <div
                key={tx._id?.toString()}
                className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <p>
                    <strong>Type:</strong>{" "}
                    <span className="capitalize">{tx.type}</span>
                  </p>
                  <p>
                    <strong>Amount:</strong> Rp {tx.amount.toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        tx.status === "SUCCESS"
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
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Funding History */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Funding History</h2>
        <div className="bg-white rounded-xl shadow divide-y">
          {fundings.length === 0 ? (
            <p className="p-4 text-gray-500">No funding activity.</p>
          ) : (
            fundings.map((fund) => (
              <div
                key={fund._id?.toString()}
                className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div>
                  <p>
                    <strong>Event ID:</strong> {fund.eventId}
                  </p>
                  <p>
                    <strong>Amount:</strong> Rp {fund.amount.toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {fund.createdAt
                    ? new Date(fund.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
