export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Discover",
      description:
        "Browse a variety of creative projects and events from passionate creators.",
      color: "green",
    },
    {
      number: 2,
      title: "Support",
      description:
        "Back your favorite projects and help bring them to life with your support.",
      color: "blue",
    },
    {
      number: 3,
      title: "Join & Enjoy",
      description:
        "Participate in events, connect with creators, and enjoy the results together.",
      color: "purple",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div
                className={`bg-${step.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <span className={`text-2xl font-bold text-${step.color}-600`}>
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
