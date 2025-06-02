import { Metadata } from "next";
import { getAllEvents } from "@/lib/data/event";
import EventCard from "@/components/EventCard";
import GetStartedButton from "@/components/client/GetStartedButton";
import Image from "next/image";
import HowItWorks from "@/components/HowItWorks";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collabora - Crowdsourced Event Planning Platform",
  description:
    "Foster collaboration, transparency, and trust among creators, investors, volunteers, and viewers through crowdsourced event planning.",
  keywords: [
    "event planning",
    "crowdsourcing",
    "collaboration",
    "funding",
    "volunteers",
  ],
  openGraph: {
    title: "Collabora - Crowdsourced Event Planning Platform",
    description:
      "Foster collaboration, transparency, and trust among creators, investors, volunteers, and viewers through crowdsourced event planning.",
    type: "website",
    url: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

// Fetch a random event image from Pixabay
async function getRandomEventImage() {
  try {
    const apiKey = process.env.PIXABAY_API_KEY;
    const query = "event crowd concert festival party";
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch Pixabay image:", res.statusText);
      return "/default-hero.jpg"; // fallback
    }

    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      const randomIdx = Math.floor(Math.random() * data.hits.length);
      return data.hits[randomIdx].webformatURL;
    }
  } catch (error) {
    console.error("Error fetching Pixabay image:", error);
  }

  return "/default-hero.jpg"; // fallback if failed
}

export default async function HomePage() {
  const events = await getAllEvents();
  const heroImage = await getRandomEventImage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Bring Creative Projects to Life
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover, support, and join innovative events and projects from
              creators around the world.
            </p>
            <div className="space-x-4">
              <GetStartedButton />
              <Link
                href="/events"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Explore Projects
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src={heroImage}
              alt="Event Crowd"
              width={400}
              height={300}
              className="w-full max-w-md rounded-xl shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Trending Projects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trending Projects
            </h2>
            <Link
              href="/events"
              className="text-green-600 font-semibold hover:underline"
            >
              See all
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No projects available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {events.slice(0, 8).map((event) => (
                <EventCard
                  key={event._id?.toString() || ""}
                  event={{
                    ...event,
                    _id: event._id?.toString() || "",
                    createdAt: event.createdAt || new Date(),
                    updatedAt: event.updatedAt || new Date(),
                    createdBy: event.createdBy || "",
                  }}
                  showJoinButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start your own project?
          </h2>
          <p className="text-xl mb-8">
            Launch your idea and find your community on Collabora.
          </p>
          <Link
            href="/event/create"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}
