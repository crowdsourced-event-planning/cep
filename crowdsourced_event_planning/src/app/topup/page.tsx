import { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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

export default async function CreateEventPage({ searchParams }: Props) {
  const { notif } = await searchParams;

  const handleProcessTopup = async (formData: FormData) => {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const amount = formData.get("amount");
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
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      required
                      placeholder="100.000"
                      className="text-lg"
                      error={notif}
                    />
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">Process</Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tips for Success
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Use a clear, descriptive title
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Add high-quality images
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Be specific about location and time
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Set realistic funding goals
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Provide detailed descriptions
                  </li>
                </ul>
              </div>
            </Card>

            {/* Help */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600">
                  Check out our event creation guide or contact support.
                </p>
                <div className="space-y-2">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Guide
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
