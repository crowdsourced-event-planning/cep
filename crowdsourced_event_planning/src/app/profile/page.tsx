import { ObjectId } from "mongodb";
import UserModel from "@/db/models/UserModel";
import { verifyToken } from "@/lib/jwt";
import { getDb } from "@/db/config/mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <section>
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <div className="bg-white rounded-xl shadow p-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Balance:</strong> Rp {user.balance?.toLocaleString() ?? 0}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Waiting Payment</h2>
        <div className="bg-white rounded-xl shadow divide-y">
          {waitingPayments.length === 0 ? (
            <p className="p-4">No pending payments.</p>
          ) : (
            waitingPayments.map((tx) => (
              <div key={tx._id?.toString()} className="p-4">
                <p>
                  <strong>Amount:</strong> Rp {tx.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {tx.status}
                </p>
                <form action={handleCheck}>
                  <input type="hidden" name="xenditId" value={tx.xenditId} />
                  <button type="submit" className="text-blue-600 underline">
                    Bayar Sekarang
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
        <div className="bg-white rounded-xl shadow divide-y">
          {historyTransactions.length === 0 ? (
            <p className="p-4">No transaction history.</p>
          ) : (
            historyTransactions.map((tx) => (
              <div key={tx._id?.toString()} className="p-4">
                <p>
                  <strong>Type:</strong> {tx.type}
                </p>
                <p>
                  <strong>Amount:</strong> Rp {tx.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {tx.status}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(tx.createdAt!).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Funding History</h2>
        <div className="bg-white rounded-xl shadow divide-y">
          {fundings.length === 0 ? (
            <p className="p-4">No funding activity.</p>
          ) : (
            fundings.map((fund) => (
              <div key={fund._id?.toString()} className="p-4">
                <p>
                  <strong>Event ID:</strong> {fund.eventId}
                </p>
                <p>
                  <strong>Amount:</strong> Rp {fund.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(fund.createdAt!).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
