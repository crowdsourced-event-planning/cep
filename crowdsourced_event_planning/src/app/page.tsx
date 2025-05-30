import { Metadata } from "next";
import { getAllEvents } from "@/lib/data/event";
import EventCard from "@/components/EventCard";

export const metadata: Metadata = {
  title: "Collabora - Crowdsourced Event Planning Platform",
  description:
    "Foster collaboration, transparency, and trust among creators, investors, volunteers, and viewers through crowdsourced event planning.",
  keywords: "event planning, crowdsourcing, collaboration, funding, volunteers",
  openGraph: {
    title: "Collabora - Crowdsourced Event Planning Platform",
    description:
      "Foster collaboration, transparency, and trust among creators, investors, volunteers, and viewers through crowdsourced event planning.",
    type: "website",
    url: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default async function HomePage() {
  try {
    const events = await getAllEvents();

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Collabora
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Foster collaboration, transparency, and trust through crowdsourced
              event planning
            </p>
            <div className="space-x-4">
              <a
                href="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Discover Events
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join exciting events, contribute to their success, and be part
                of amazing experiences
              </p>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No events available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    showJoinButton={false}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Collabora?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Collaborative Planning
                </h3>
                <p className="text-gray-600">
                  Work together with creators, volunteers, and participants to
                  organize amazing events.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Transparent Funding
                </h3>
                <p className="text-gray-600">
                  Real-time funding tracking with detailed budget breakdowns for
                  complete transparency.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Trust & Reputation
                </h3>
                <p className="text-gray-600">
                  Built-in reputation system ensures accountability and
                  encourages quality event execution.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error loading homepage:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Collabora
          </h1>
          <p className="text-gray-600 mb-8">
            Something went wrong. Please try again later.
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </a>{" "}
        </div>
      </div>
    );
  }
}
