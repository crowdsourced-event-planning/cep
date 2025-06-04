import { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AmountInput from "@/components/AmountInput";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Topup - Collabora",
  description:
    "Create a new collaborative event and start bringing people together.",
};

type Props = {
  searchParams: Promise<{
    notif?: string;
  }>;
};

export default async function TopUpPage({ searchParams }: Props) {
  const { notif } = await searchParams;

  const handleProcessTopup = async (formData: FormData) => {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const amount = formData.get("amount")?.toString().replace(/\./g, "");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction/topup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${token}`,
        },
        body: JSON.stringify({
          amount,
        }),
        credentials: "include",
      }
    );

    if (!res.ok) {
      const data = (await res.json()) as { error: string; status: number };

      const message = encodeURIComponent(data.error);

      return redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/topup?notif=${message}`
      );
    }

    const data = await res.json();
    if (data.invoiceUrl) {
      console.log(data, "<<< data ssr");
      redirect(data.invoiceUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">Topup</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Topup</h1>
          <p className="mt-2 text-gray-600">
            Topup to support for event via donation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form className="space-y-6" action={handleProcessTopup}>
              {/* Basic Information */}
              <Card>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Topup Information
                    </h2>
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Amount *
                    </label>
                    <div className="flex items-center">
                      <AmountInput
                        id="amount"
                        name="amount"
                        required
                        placeholder="1.000.000"
                        className="pl-8 text-lg"
                        error={notif}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 cursor-pointer">
                <Button type="submit">Process</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
