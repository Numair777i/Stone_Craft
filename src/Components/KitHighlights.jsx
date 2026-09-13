function KitHighlights() {
  return (
    <section
      className="py-24 px-8 md:px-24"
      style={{ backgroundColor: "#F2EAD8" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span
            className="text-xs uppercase tracking-widest font-semibold block mb-3"
            style={{ color: "#C1442C" }}
          >
            Crafted for Creativity
          </span>
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ color: "#234B3B", marginBottom: "12px" }}
          >
            What Comes in Every Box
          </h2>
          <p
            className="text-base"
            style={{ color: "#2A2118", opacity: 0.75, lineHeight: 1.6 }}
          >
            An effortless, screen-free activity designed for all skill levels.
            Everything you need is right inside.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "bx bx-cube",
              title: "1. Unbox the Figurine",
              desc: "Each kit arrives with a carefully cast, smooth white plaster figurine ready for color.",
            },
            {
              icon: "bx bx-paint",
              title: "2. Mix & Paint",
              desc: "Use the included fine-tip brush and 4 vibrant paint pots to bring your design to life.",
            },
            {
              icon: "bx bx-sparkles",
              title: "3. Display & Enjoy",
              desc: "Let it dry for a few hours and showcase your custom creation in your space.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-sm"
              style={{
                backgroundColor: "#F7F1E6",
                border: "1px solid rgba(35,75,59,0.1)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
              >
                <i className={`${item.icon} text-2xl`} />
              </div>
              <h3
                className="text-xl font-bold tracking-tight mb-3"
                style={{ color: "#234B3B" }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#2A2118", opacity: 0.75 }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KitHighlights;
